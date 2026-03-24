document.addEventListener('DOMContentLoaded', function () {
    Store.init();
    bindPublicBookingForm();
    renderPublicHome();
    resetPublicBookingForm();
    window.addEventListener('store:updated', renderPublicHome);
    window.addEventListener('storage', renderPublicHome);
});

function bindPublicBookingForm() {
    document.getElementById('publicBookingForm').addEventListener('submit', function (event) {
        event.preventDefault();
        submitPublicBooking();
    });

    ['publicBookingField', 'publicBookingStart', 'publicBookingEnd'].forEach(function (id) {
        document.getElementById(id).addEventListener('input', updatePublicSummary);
        document.getElementById(id).addEventListener('change', updatePublicSummary);
    });
}

function renderPublicHome() {
    const allFields = Store.fields();
    const availableFields = allFields.filter(function (field) {
        return field.status === 'available';
    });
    const stats = Store.analytics();

    fillPublicFieldOptions(availableFields);
    renderPublicStats(allFields, availableFields, stats);
    renderPublicFieldCards(availableFields);
    updatePublicSummary();
}

function fillPublicFieldOptions(fields) {
    const select = document.getElementById('publicBookingField');
    const keep = select.value;

    select.innerHTML = '<option value="">Chọn sân muốn thuê</option>' + fields.map(function (field) {
        return '<option value="' + Store.esc(field.id) + '">' + Store.esc(field.name) + ' · ' + Store.esc(field.type) + ' · ' + Store.money(field.hourlyRate) + '/giờ</option>';
    }).join('');

    select.value = fields.some(function (field) {
        return field.id === keep;
    }) ? keep : '';
}

function renderPublicStats(allFields, availableFields, stats) {
    const startingRate = availableFields.length ? Math.min.apply(null, availableFields.map(function (field) {
        return field.hourlyRate;
    })) : 0;
    const topField = stats.topFields[0];
    const locationMap = {};

    availableFields.forEach(function (field) {
        const key = field.location || 'Chưa cập nhật';
        locationMap[key] = (locationMap[key] || 0) + 1;
    });

    const topLocation = Object.keys(locationMap).sort(function (a, b) {
        return locationMap[b] - locationMap[a];
    })[0] || 'Đang cập nhật';

    document.getElementById('publicFieldTotal').textContent = allFields.length + ' sân';
    document.getElementById('publicAvailableFields').textContent = availableFields.length + ' sẵn sàng';
    document.getElementById('publicStartingRate').textContent = Store.money(startingRate);
    document.getElementById('publicTodayBookings').textContent = stats.todayBookings.length;
    document.getElementById('publicTopField').textContent = topField ? topField.name : 'Chưa có';
    document.getElementById('publicTopLocation').textContent = topLocation;
}

function renderPublicFieldCards(fields) {
    const box = document.getElementById('homeFieldGrid');

    box.innerHTML = fields.length ? fields.map(function (field) {
        return '<article class="field-preview-card">'
            + '<div class="field-preview__media field-preview__media--' + field.status + '">'
            + '<span class="field-preview__tag">🟢 Đang nhận thuê</span>'
            + '<span class="field-preview__code">' + Store.esc(field.code) + '</span>'
            + '<div class="pitch-visual pitch-visual-compact">'
            + '<div class="pitch-visual__field">'
            + '<span class="pitch-visual__line pitch-visual__line-half"></span>'
            + '<span class="pitch-visual__circle"></span>'
            + '<span class="pitch-visual__box pitch-visual__box-left"></span>'
            + '<span class="pitch-visual__box pitch-visual__box-right"></span>'
            + '<span class="pitch-visual__goal pitch-visual__goal-left"></span>'
            + '<span class="pitch-visual__goal pitch-visual__goal-right"></span>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '<div class="field-preview__body">'
            + '<div class="field-preview__head"><h3>' + Store.esc(field.name) + '</h3><span class="badge badge-available">' + Store.esc(field.type) + '</span></div>'
            + '<p class="field-preview__meta">📍 ' + Store.esc(field.location || 'Chưa có khu vực') + ' · ✨ ' + Store.esc(field.amenities || 'Tiện ích cơ bản') + '</p>'
            + '<div class="field-preview__chips">'
            + '<span>👥 ' + (field.capacity || 0) + ' người</span>'
            + '<span>📅 ' + field.bookingCount + ' lượt đặt</span>'
            + '<span>⏰ ' + (field.nextBookingAt ? Store.dateText(field.nextBookingAt, true) : 'Có thể đặt ngay') + '</span>'
            + '</div>'
            + '<div class="field-preview__stats">'
            + '<article><span>💸</span><strong>' + Store.money(field.hourlyRate) + '</strong><small>/giờ</small></article>'
            + '<article><span>⚽</span><strong>' + Store.esc(field.surface || 'Cỏ nhân tạo') + '</strong><small>mặt sân</small></article>'
            + '</div>'
            + '<div class="field-preview__actions"><button class="table-button" type="button" onclick="pickPublicField(\'' + field.id + '\')">Thuê sân này</button></div>'
            + '</div>'
            + '</article>';
    }).join('') : '<div class="empty-state">Hiện chưa có sân sẵn sàng để khách đặt.</div>';
}

function updatePublicSummary() {
    const fieldId = document.getElementById('publicBookingField').value;
    const field = Store.fields().find(function (item) {
        return item.id === fieldId;
    });
    const startTime = document.getElementById('publicBookingStart').value;
    const endTime = document.getElementById('publicBookingEnd').value;
    const duration = Store.durationHours(startTime, endTime);
    const total = field && duration > 0 ? field.hourlyRate * duration : 0;

    document.getElementById('publicSummaryField').textContent = field ? field.name : 'Chưa chọn sân';
    document.getElementById('publicSummaryRate').textContent = field ? Store.money(field.hourlyRate) + ' / giờ' : '0 VNĐ / giờ';
    document.getElementById('publicSummaryDuration').textContent = Store.hoursText(duration);
    document.getElementById('publicSummaryTotal').textContent = Store.money(total);
}

function submitPublicBooking() {
    const message = document.getElementById('publicBookingMessage');

    try {
        const booking = Store.savePublicBooking({
            customerName: document.getElementById('publicCustomerName').value,
            customerPhone: document.getElementById('publicCustomerPhone').value,
            customerEmail: document.getElementById('publicCustomerEmail').value,
            customerTeamName: document.getElementById('publicCustomerTeam').value,
            bookingDate: document.getElementById('publicBookingDate').value,
            fieldId: document.getElementById('publicBookingField').value,
            startTime: document.getElementById('publicBookingStart').value,
            endTime: document.getElementById('publicBookingEnd').value,
            notes: document.getElementById('publicBookingNotes').value
        });

        message.style.display = 'block';
        message.className = 'public-message public-message-success field-span-2';
        message.textContent = 'Đã gửi yêu cầu thuê sân thành công. Mã yêu cầu: ' + booking.code + '. Quản lý sẽ liên hệ xác nhận.';

        resetPublicBookingForm();
        renderPublicHome();
    } catch (error) {
        message.style.display = 'block';
        message.className = 'public-message public-message-error field-span-2';
        message.textContent = error.message;
    }
}

function resetPublicBookingForm() {
    document.getElementById('publicBookingForm').reset();
    document.getElementById('publicBookingDate').value = todayLocal();
    document.getElementById('publicBookingStart').value = '18:00';
    document.getElementById('publicBookingEnd').value = '19:30';
    updatePublicSummary();
}

function todayLocal() {
    const now = new Date();
    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0')
    ].join('-');
}

function pickPublicField(id) {
    document.getElementById('publicBookingField').value = id;
    updatePublicSummary();
    document.getElementById('bookingFormSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.pickPublicField = pickPublicField;
