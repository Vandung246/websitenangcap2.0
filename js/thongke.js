let bookingEditingId = '';
let currentAddons = [];

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('bookingForm').addEventListener('submit', function (event) {
        event.preventDefault();
        saveBooking();
    });

    document.getElementById('cancelBookingEdit').addEventListener('click', resetBookingForm);
    document.getElementById('addAddon').addEventListener('click', addAddon);
    document.getElementById('bookingAddonsBody').addEventListener('click', handleAddonClick);
    document.getElementById('bookingAddonsBody').addEventListener('input', handleAddonInput);
    document.getElementById('bookingField').addEventListener('change', renderAddons);
    document.getElementById('bookingStartTime').addEventListener('input', renderAddons);
    document.getElementById('bookingEndTime').addEventListener('input', renderAddons);
    document.getElementById('exportData').addEventListener('click', exportData);

    ['bookingSearch', 'bookingStatusFilter', 'bookingPaymentFilter', 'bookingSort'].forEach(function (id) {
        document.getElementById(id).addEventListener(id === 'bookingSearch' ? 'input' : 'change', renderBookings);
    });

    resetBookingForm();
    renderBookings();
    window.addEventListener('store:updated', renderBookings);
    window.addEventListener('storage', renderBookings);
});

function renderBookings() {
    const customers = Store.customers();
    const fields = Store.fields();
    const all = Store.bookings();
    const stats = Store.analytics();

    fillSelect('bookingCustomer', customers, function (customer) {
        return {
            value: customer.id,
            label: customer.name + ' · ' + customer.phone
        };
    }, 'Chọn khách hàng');

    fillSelect('bookingField', fields, function (field) {
        return {
            value: field.id,
            label: field.name + ' · ' + field.type + ' · ' + Store.money(field.hourlyRate) + '/giờ'
        };
    }, 'Chọn sân');

    renderReports(stats);

    const search = document.getElementById('bookingSearch').value.trim().toLowerCase();
    const status = document.getElementById('bookingStatusFilter').value;
    const payment = document.getElementById('bookingPaymentFilter').value;
    const sort = document.getElementById('bookingSort').value;

    let rows = all.filter(function (booking) {
        const haystack = [
            booking.code,
            booking.customerName,
            booking.customerPhone,
            booking.fieldName,
            booking.bookingDate,
            booking.startTime,
            booking.endTime,
            booking.notes
        ].join(' ').toLowerCase();

        return (!search || haystack.includes(search))
            && (!status || booking.status === status)
            && (!payment || booking.paymentStatus === payment);
    });

    rows = rows.sort(function (a, b) {
        if (sort === 'oldest') return slotTime(a) - slotTime(b);
        if (sort === 'value') return b.total - a.total;
        if (sort === 'upcoming') return slotTime(a) - slotTime(b);
        return slotTime(b) - slotTime(a);
    });

    document.getElementById('bookingTableBody').innerHTML = rows.length ? rows.map(function (booking, index) {
        return '<tr>'
            + '<td>' + (index + 1) + '</td>'
            + '<td><strong>' + Store.esc(booking.code) + '</strong><br><span class="table-muted">' + Store.hoursText(booking.durationHours) + '</span></td>'
            + '<td><strong>' + Store.esc(booking.customerName) + '</strong><br><span class="table-muted">' + Store.esc(booking.customerPhone || '-') + '</span></td>'
            + '<td>' + Store.esc(booking.fieldName) + '<br><span class="table-muted">' + Store.esc(booking.fieldType || '-') + '</span></td>'
            + '<td>' + Store.esc(booking.bookingDate) + '<br><span class="table-muted">' + Store.esc(booking.startTime) + ' - ' + Store.esc(booking.endTime) + '</span></td>'
            + '<td>' + Store.money(booking.total) + '</td>'
            + '<td><span class="badge badge-' + booking.status + '">' + Store.LABELS.bookingStatus[booking.status] + '</span></td>'
            + '<td><span class="badge badge-' + booking.paymentStatus + '">' + Store.LABELS.payment[booking.paymentStatus] + '</span></td>'
            + '<td><div class="table-actions"><button class="table-button" onclick="editBooking(\'' + booking.id + '\')">Sửa</button><button class="table-button danger" onclick="deleteBooking(\'' + booking.id + '\')">Xóa</button></div></td>'
            + '</tr>';
    }).join('') : '<tr><td colspan="9" class="table-empty">Không tìm thấy lịch đặt phù hợp.</td></tr>';

    renderAddons();
}

function renderReports(stats) {
    document.getElementById('reportRevenue').textContent = Store.money(stats.expectedRevenue);
    document.getElementById('reportOrders').textContent = stats.activeBookings;
    document.getElementById('reportPending').textContent = stats.pendingBookings;
    document.getElementById('reportAverage').textContent = Store.money(stats.avgBookingValue);

    document.getElementById('topCustomers').innerHTML = stats.topCustomers.length ? stats.topCustomers.map(function (customer) {
        return '<article class="mini-card">'
            + '<div><h4>' + Store.esc(customer.name) + '</h4><p>' + Store.esc(customer.teamName || 'Khách lẻ') + '</p></div>'
            + '<div class="mini-card__meta"><strong>' + customer.bookingCount + ' lượt đặt</strong><span>' + Store.money(customer.totalSpent) + '</span></div>'
            + '</article>';
    }).join('') : '<div class="empty-state">Chưa có khách hàng nổi bật.</div>';

    const paymentMax = Math.max(1, Math.max.apply(null, stats.paymentStats.map(function (item) {
        return item.count;
    })));

    document.getElementById('paymentStats').innerHTML = stats.paymentStats.map(function (item) {
        return '<div class="progress-list__item">'
            + '<div class="progress-list__label"><strong>' + Store.esc(item.label) + '</strong><span>' + item.count + ' lịch</span></div>'
            + '<div class="progress-list__track"><span style="width:' + Math.max(10, Math.round((item.count / paymentMax) * 100)) + '%"></span></div>'
            + '</div>';
    }).join('');

    if (!stats.monthlyRevenue.length) {
        document.getElementById('monthlyRevenueList').innerHTML = '<div class="empty-state">Chưa có doanh thu để tổng hợp.</div>';
        return;
    }

    const revenueMax = Math.max.apply(null, stats.monthlyRevenue.map(function (item) {
        return item.revenue;
    }).concat([1]));

    document.getElementById('monthlyRevenueList').innerHTML = stats.monthlyRevenue.map(function (item) {
        return '<div class="revenue-row">'
            + '<div><strong>' + Store.esc(item.label) + '</strong><p>' + Store.money(item.revenue) + '</p></div>'
            + '<div class="revenue-bar"><span style="width:' + Math.max(10, Math.round((item.revenue / revenueMax) * 100)) + '%"></span></div>'
            + '</div>';
    }).join('');
}

function fillSelect(id, rows, mapper, placeholder) {
    const select = document.getElementById(id);
    const keep = select.value;

    select.innerHTML = '<option value="">' + placeholder + '</option>' + rows.map(function (item) {
        const mapped = mapper(item);
        return '<option value="' + Store.esc(mapped.value) + '">' + Store.esc(mapped.label) + '</option>';
    }).join('');

    select.value = rows.some(function (item) {
        return mapper(item).value === keep;
    }) ? keep : '';
}

function addAddon() {
    const name = document.getElementById('addonName').value.trim();
    const price = Math.max(0, Number(document.getElementById('addonPrice').value) || 0);

    if (!name) {
        window.alert('Vui lòng nhập tên dịch vụ thêm.');
        return;
    }

    currentAddons.push({
        id: addonId(),
        name: name,
        price: price
    });

    document.getElementById('addonName').value = '';
    document.getElementById('addonPrice').value = '';
    renderAddons();
}

function renderAddons() {
    document.getElementById('bookingAddonsBody').innerHTML = currentAddons.length ? currentAddons.map(function (item) {
        return '<tr>'
            + '<td><input class="mini-input" data-addon-name="' + Store.esc(item.id) + '" type="text" value="' + Store.esc(item.name) + '"></td>'
            + '<td><input class="mini-input" data-addon-price="' + Store.esc(item.id) + '" type="number" min="0" step="1000" value="' + item.price + '"></td>'
            + '<td><button class="table-button danger" type="button" data-remove-addon="' + Store.esc(item.id) + '">Xóa</button></td>'
            + '</tr>';
    }).join('') : '<tr><td colspan="3" class="table-empty">Chưa có dịch vụ thêm.</td></tr>';
    updateTotals();
}

function handleAddonClick(event) {
    const id = event.target.getAttribute('data-remove-addon');
    if (!id) return;

    currentAddons = currentAddons.filter(function (item) {
        return item.id !== id;
    });

    renderAddons();
}

function handleAddonInput(event) {
    const addonNameId = event.target.getAttribute('data-addon-name');
    const addonPriceId = event.target.getAttribute('data-addon-price');
    const item = currentAddons.find(function (entry) {
        return entry.id === addonNameId || entry.id === addonPriceId;
    });

    if (!item) return;

    if (addonNameId) {
        item.name = event.target.value.trim();
        return;
    }

    if (addonPriceId) {
        item.price = Math.max(0, Number(event.target.value) || 0);
        updateTotals();
    }
}

function saveBooking() {
    try {
        Store.saveBooking({
            id: bookingEditingId || undefined,
            customerId: document.getElementById('bookingCustomer').value,
            fieldId: document.getElementById('bookingField').value,
            bookingDate: document.getElementById('bookingDate').value,
            startTime: document.getElementById('bookingStartTime').value,
            endTime: document.getElementById('bookingEndTime').value,
            status: document.getElementById('bookingStatus').value,
            paymentStatus: document.getElementById('bookingPaymentStatus').value,
            notes: document.getElementById('bookingNotes').value,
            addons: currentAddons
        });

        resetBookingForm();
        renderBookings();
    } catch (error) {
        window.alert(error.message);
    }
}

function editBooking(id) {
    const booking = Store.bookings().find(function (entry) {
        return entry.id === id;
    });
    if (!booking) return;

    bookingEditingId = booking.id;
    currentAddons = booking.addons.map(function (item) {
        return {
            id: item.id || addonId(),
            name: item.name,
            price: item.price
        };
    });

    document.getElementById('bookingCustomer').value = booking.customerId;
    document.getElementById('bookingField').value = booking.fieldId;
    document.getElementById('bookingDate').value = booking.bookingDate;
    document.getElementById('bookingStartTime').value = booking.startTime;
    document.getElementById('bookingEndTime').value = booking.endTime;
    document.getElementById('bookingStatus').value = booking.status;
    document.getElementById('bookingPaymentStatus').value = booking.paymentStatus;
    document.getElementById('bookingNotes').value = booking.notes || '';
    document.getElementById('bookingSubmitLabel').textContent = 'Cập nhật lịch đặt';
    document.getElementById('cancelBookingEdit').style.display = 'inline-flex';
    renderAddons();
    document.getElementById('bookingPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteBooking(id) {
    if (!window.confirm('Bạn chắc chắn muốn xóa lịch đặt này?')) return;

    Store.removeBooking(id);
    if (bookingEditingId === id) resetBookingForm();
    renderBookings();
}

function resetBookingForm() {
    bookingEditingId = '';
    currentAddons = [];
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingDate').value = localToday();
    document.getElementById('bookingStartTime').value = '18:00';
    document.getElementById('bookingEndTime').value = '19:30';
    document.getElementById('bookingStatus').value = 'pending';
    document.getElementById('bookingPaymentStatus').value = 'unpaid';
    document.getElementById('bookingSubmitLabel').textContent = 'Lưu lịch đặt';
    document.getElementById('cancelBookingEdit').style.display = 'none';
    renderAddons();
}

function exportData() {
    const blob = new Blob([JSON.stringify(Store.exportData(), null, 2)], {
        type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'thue-san-de-data-' + localToday() + '.json';
    link.click();
    URL.revokeObjectURL(url);
}

function slotTime(booking) {
    return Store.combineDateTime(booking.bookingDate, booking.startTime).getTime();
}

function localToday() {
    const now = new Date();
    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0')
    ].join('-');
}

function addonId() {
    return 'addon-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5);
}

function updateTotals() {
    const field = Store.fields().find(function (entry) {
        return entry.id === document.getElementById('bookingField').value;
    });
    const startTime = document.getElementById('bookingStartTime').value;
    const endTime = document.getElementById('bookingEndTime').value;
    const duration = Store.durationHours(startTime, endTime);
    const fieldFee = field && duration > 0 ? field.hourlyRate * duration : 0;
    const addonFee = currentAddons.reduce(function (sum, item) {
        return sum + item.price;
    }, 0);

    document.getElementById('bookingFieldFee').textContent = Store.money(fieldFee);
    document.getElementById('bookingAddonTotal').textContent = Store.money(addonFee);
    document.getElementById('bookingTotal').textContent = Store.money(fieldFee + addonFee);
}

window.editBooking = editBooking;
window.deleteBooking = deleteBooking;
