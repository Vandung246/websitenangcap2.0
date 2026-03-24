let fieldEditingId = '';

document.addEventListener('DOMContentLoaded', function () {
    bindFieldForm();
    bindFieldFilters();
    renderFields();
    window.addEventListener('store:updated', renderFields);
    window.addEventListener('storage', renderFields);
});

function bindFieldForm() {
    document.getElementById('fieldForm').addEventListener('submit', function (event) {
        event.preventDefault();
        saveField();
    });

    document.getElementById('cancelFieldEdit').addEventListener('click', resetFieldForm);
}

function bindFieldFilters() {
    ['fieldSearch', 'fieldTypeFilter', 'fieldStatusFilter', 'fieldSort'].forEach(function (id) {
        document.getElementById(id).addEventListener(id === 'fieldSearch' ? 'input' : 'change', renderFields);
    });
}

function saveField() {
    try {
        Store.saveField({
            id: fieldEditingId || undefined,
            name: document.getElementById('fieldName').value,
            code: document.getElementById('fieldCode').value,
            type: document.getElementById('fieldType').value,
            surface: document.getElementById('fieldSurface').value,
            hourlyRate: document.getElementById('fieldHourlyRate').value,
            capacity: document.getElementById('fieldCapacity').value,
            status: document.getElementById('fieldStatus').value,
            location: document.getElementById('fieldLocation').value,
            amenities: document.getElementById('fieldAmenities').value,
            notes: document.getElementById('fieldNotes').value
        });

        resetFieldForm();
        renderFields();
    } catch (error) {
        window.alert(error.message);
    }
}

function renderFields() {
    const all = Store.fields();
    const search = document.getElementById('fieldSearch').value.trim().toLowerCase();
    const type = document.getElementById('fieldTypeFilter').value;
    const status = document.getElementById('fieldStatusFilter').value;
    const sort = document.getElementById('fieldSort').value;

    let rows = all.filter(function (field) {
        const haystack = [field.name, field.code, field.location, field.surface, field.amenities, field.notes].join(' ').toLowerCase();
        return (!search || haystack.includes(search))
            && (!type || field.type === type)
            && (!status || field.status === status);
    });

    rows = rows.sort(function (a, b) {
        if (sort === 'rate-desc') return b.hourlyRate - a.hourlyRate;
        if (sort === 'rate-asc') return a.hourlyRate - b.hourlyRate;
        if (sort === 'bookings') return b.bookingCount - a.bookingCount;
        if (sort === 'name') return a.name.localeCompare(b.name, 'vi');
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    document.getElementById('fieldTotal').textContent = all.length;
    document.getElementById('fieldAvailable').textContent = all.filter(function (field) {
        return field.status === 'available';
    }).length;
    document.getElementById('fieldMaintenance').textContent = all.filter(function (field) {
        return field.status === 'maintenance';
    }).length;
    document.getElementById('fieldRevenue').textContent = Store.money(all.reduce(function (sum, field) {
        return sum + field.revenue;
    }, 0));

    renderFieldHero(all);
    renderFieldSpotlight(all);
    renderFieldPreview(rows);

    document.getElementById('fieldTableBody').innerHTML = rows.length ? rows.map(function (field, index) {
        return '<tr>'
            + '<td>' + (index + 1) + '</td>'
            + '<td><strong>' + Store.esc(field.name) + '</strong><br><span class="table-muted">Mã ' + Store.esc(field.code) + '</span></td>'
            + '<td>' + Store.esc(field.location || '-') + '</td>'
            + '<td>' + Store.esc(field.type) + '<br><span class="table-muted">' + Store.esc(field.surface || '-') + ' · ' + field.capacity + ' người</span></td>'
            + '<td>' + Store.money(field.hourlyRate) + '</td>'
            + '<td><span class="badge badge-' + field.status + '">' + Store.LABELS.fieldStatus[field.status] + '</span></td>'
            + '<td>' + field.bookingCount + '</td>'
            + '<td>' + Store.money(field.revenue) + '</td>'
            + '<td>' + (field.nextBookingAt ? Store.dateText(field.nextBookingAt, true) : '-') + '</td>'
            + '<td><div class="table-actions"><button class="table-button" onclick="editField(\'' + field.id + '\')">Sửa</button><button class="table-button danger" onclick="deleteField(\'' + field.id + '\')">Xóa</button></div></td>'
            + '</tr>';
    }).join('') : '<tr><td colspan="10" class="table-empty">Không tìm thấy sân phù hợp.</td></tr>';
}

function renderFieldHero(all) {
    const featured = all.slice().sort(function (a, b) {
        return b.bookingCount - a.bookingCount || b.revenue - a.revenue;
    })[0];

    document.getElementById('heroFieldCount').textContent = all.length + ' sân';
    document.getElementById('heroReadyCount').textContent = all.filter(function (field) {
        return field.status === 'available';
    }).length + ' sẵn sàng';
    document.getElementById('heroHotField').textContent = featured ? featured.name : 'Chưa có';
}

function renderFieldSpotlight(all) {
    const featured = all.slice().sort(function (a, b) {
        return b.bookingCount - a.bookingCount || b.revenue - a.revenue;
    })[0];

    if (!featured) {
        document.getElementById('spotlightFieldName').textContent = 'Chưa có sân';
        document.getElementById('spotlightFieldMeta').textContent = 'Danh sách sân sẽ hiển thị nổi bật tại đây khi có dữ liệu.';
        document.getElementById('spotlightFieldLocation').textContent = '-';
        document.getElementById('spotlightFieldCapacity').textContent = '0';
        document.getElementById('spotlightFieldRate').textContent = '0 VNĐ';
        document.getElementById('spotlightFieldBookingCount').textContent = '0';
        return;
    }

    document.getElementById('spotlightFieldName').textContent = featured.name + ' ' + fieldStatusIcon(featured.status);
    document.getElementById('spotlightFieldMeta').textContent = [
        featured.type,
        featured.surface || 'Chưa có mặt sân',
        featured.amenities || 'Chưa có tiện ích'
    ].join(' · ');
    document.getElementById('spotlightFieldLocation').textContent = featured.location || '-';
    document.getElementById('spotlightFieldCapacity').textContent = String(featured.capacity || 0);
    document.getElementById('spotlightFieldRate').textContent = Store.money(featured.hourlyRate);
    document.getElementById('spotlightFieldBookingCount').textContent = String(featured.bookingCount || 0);
}

function renderFieldPreview(rows) {
    const box = document.getElementById('fieldPreviewGrid');

    box.innerHTML = rows.length ? rows.map(function (field) {
        return '<article class="field-preview-card">'
            + '<div class="field-preview__media field-preview__media--' + field.status + '">'
            + '<span class="field-preview__tag">' + fieldStatusIcon(field.status) + ' ' + Store.LABELS.fieldStatus[field.status] + '</span>'
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
            + '<div class="field-preview__head"><h3>' + Store.esc(field.name) + '</h3><span class="badge badge-' + field.status + '">' + Store.LABELS.fieldStatus[field.status] + '</span></div>'
            + '<p class="field-preview__meta">📍 ' + Store.esc(field.location || 'Chưa có khu vực') + ' · 👟 ' + Store.esc(field.surface || 'Chưa có mặt sân') + '</p>'
            + '<div class="field-preview__chips">'
            + '<span>👥 ' + (field.capacity || 0) + ' người</span>'
            + '<span>📅 ' + field.bookingCount + ' lượt đặt</span>'
            + '<span>⏰ ' + (field.nextBookingAt ? Store.dateText(field.nextBookingAt, true) : 'Trống lịch') + '</span>'
            + '</div>'
            + '<div class="field-preview__stats">'
            + '<article><span>💸</span><strong>' + Store.money(field.hourlyRate) + '</strong><small>/giờ</small></article>'
            + '<article><span>🔥</span><strong>' + Store.money(field.revenue) + '</strong><small>doanh thu</small></article>'
            + '</div>'
            + '<div class="field-preview__actions"><button class="table-button" type="button" onclick="editField(\'' + field.id + '\')">Sửa nhanh</button></div>'
            + '</div>'
            + '</article>';
    }).join('') : '<div class="empty-state">Chưa có sân phù hợp để hiển thị gallery.</div>';
}

function editField(id) {
    const field = Store.fields().find(function (entry) {
        return entry.id === id;
    });
    if (!field) return;

    fieldEditingId = field.id;
    document.getElementById('fieldName').value = field.name;
    document.getElementById('fieldCode').value = field.code;
    document.getElementById('fieldType').value = field.type;
    document.getElementById('fieldSurface').value = field.surface || '';
    document.getElementById('fieldHourlyRate').value = field.hourlyRate;
    document.getElementById('fieldCapacity').value = field.capacity || 0;
    document.getElementById('fieldStatus').value = field.status || 'available';
    document.getElementById('fieldLocation').value = field.location || '';
    document.getElementById('fieldAmenities').value = field.amenities || '';
    document.getElementById('fieldNotes').value = field.notes || '';
    document.getElementById('fieldSubmitLabel').textContent = 'Cập nhật sân';
    document.getElementById('cancelFieldEdit').style.display = 'inline-flex';
    document.getElementById('fieldPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteField(id) {
    if (!window.confirm('Bạn chắc chắn muốn xóa sân này?')) return;

    try {
        Store.removeField(id);
        if (fieldEditingId === id) resetFieldForm();
        renderFields();
    } catch (error) {
        window.alert(error.message);
    }
}

function resetFieldForm() {
    fieldEditingId = '';
    document.getElementById('fieldForm').reset();
    document.getElementById('fieldType').value = 'Sân 5';
    document.getElementById('fieldStatus').value = 'available';
    document.getElementById('fieldSubmitLabel').textContent = 'Lưu sân';
    document.getElementById('cancelFieldEdit').style.display = 'none';
}

function fieldStatusIcon(status) {
    if (status === 'available') return '🟢';
    if (status === 'maintenance') return '🛠️';
    if (status === 'inactive') return '🌙';
    return '⚽';
}

window.editField = editField;
window.deleteField = deleteField;
