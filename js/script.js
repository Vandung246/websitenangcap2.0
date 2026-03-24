document.addEventListener('DOMContentLoaded', function () {
    renderDashboard();
    window.addEventListener('store:updated', renderDashboard);
    window.addEventListener('storage', renderDashboard);
});

function renderDashboard() {
    const stats = Store.analytics();
    const admin = Store.currentAdmin();

    text('welcomeName', admin ? admin.name : 'Dũngcris');
    text('metricRevenue', Store.money(stats.expectedRevenue));
    text('metricBookings', stats.activeBookings);
    text('metricCustomers', stats.customerCount);
    text('metricHours', Store.hoursText(stats.bookedHours));
    text('heroBookedToday', stats.todayBookings.length + ' lịch hôm nay');
    text('heroAvailableFields', stats.availableFields + ' sân sẵn sàng');
    text('heroMaintenanceFields', stats.maintenanceFields + ' sân bảo trì');

    renderRecentBookings(stats.recentBookings);
    renderTopFields(stats.topFields);
    renderTodaySchedule(stats.todayBookings);
    renderFieldTypes(stats.typeStats);
    renderRevenue(stats.monthlyRevenue);
}

function renderRecentBookings(rows) {
    const body = document.getElementById('recentBookings');
    body.innerHTML = rows.length ? rows.map(function (booking) {
        return '<tr>'
            + '<td><strong>' + Store.esc(booking.code) + '</strong></td>'
            + '<td>' + Store.esc(booking.customerName) + '</td>'
            + '<td><strong>' + Store.esc(booking.fieldName) + '</strong><br><span class="table-muted">' + Store.esc(booking.bookingDate) + ' · ' + Store.esc(booking.startTime) + ' - ' + Store.esc(booking.endTime) + '</span></td>'
            + '<td>' + Store.money(booking.total) + '</td>'
            + '<td><span class="badge badge-' + booking.status + '">' + Store.LABELS.bookingStatus[booking.status] + '</span></td>'
            + '<td>' + Store.dateText(booking.createdAt, true) + '</td>'
            + '</tr>';
    }).join('') : '<tr><td colspan="6" class="table-empty">Chưa có lịch đặt nào.</td></tr>';
}

function renderTopFields(rows) {
    const box = document.getElementById('topFields');
    box.innerHTML = rows.length ? rows.map(function (field) {
        return '<article class="mini-card">'
            + '<div><h4>' + Store.esc(field.name) + '</h4><p>' + Store.esc(field.type) + ' · ' + Store.esc(field.location || 'Chưa cập nhật khu vực') + '</p></div>'
            + '<div class="mini-card__meta"><strong>' + field.bookingCount + ' lượt đặt</strong><span>' + Store.money(field.revenue) + '</span></div>'
            + '</article>';
    }).join('') : '<div class="empty-state">Chưa có sân nổi bật.</div>';
}

function renderTodaySchedule(rows) {
    const box = document.getElementById('todaySchedule');
    box.innerHTML = rows.length ? rows.map(function (booking) {
        return '<article class="alert-row">'
            + '<div><h4>' + Store.esc(booking.fieldName) + '</h4><p>' + Store.esc(booking.customerName) + ' · ' + Store.esc(booking.startTime) + ' - ' + Store.esc(booking.endTime) + '</p></div>'
            + '<strong>' + Store.LABELS.bookingStatus[booking.status] + '</strong>'
            + '</article>';
    }).join('') : '<div class="empty-state">Hôm nay chưa có lịch đặt nào.</div>';
}

function renderFieldTypes(rows) {
    const box = document.getElementById('fieldTypeStats');
    if (!rows.length) {
        box.innerHTML = '<div class="empty-state">Chưa có dữ liệu loại sân.</div>';
        return;
    }

    const max = Math.max.apply(null, rows.map(function (item) {
        return item.count;
    }));

    box.innerHTML = rows.map(function (item) {
        const width = max ? Math.max(12, Math.round((item.count / max) * 100)) : 0;
        return '<div class="progress-list__item">'
            + '<div class="progress-list__label"><strong>' + Store.esc(item.label) + '</strong><span>' + item.count + ' sân · ' + Store.hoursText(item.bookedHours) + '</span></div>'
            + '<div class="progress-list__track"><span style="width:' + width + '%"></span></div>'
            + '</div>';
    }).join('');
}

function renderRevenue(rows) {
    const box = document.getElementById('monthlyRevenue');
    if (!rows.length) {
        box.innerHTML = '<div class="empty-state">Doanh thu sẽ xuất hiện khi có lịch đặt.</div>';
        return;
    }

    const max = Math.max.apply(null, rows.map(function (item) {
        return item.revenue;
    }).concat([1]));

    box.innerHTML = rows.map(function (item) {
        const width = max ? Math.max(10, Math.round((item.revenue / max) * 100)) : 0;
        return '<div class="revenue-row">'
            + '<div><strong>' + Store.esc(item.label) + '</strong><p>' + Store.money(item.revenue) + '</p></div>'
            + '<div class="revenue-bar"><span style="width:' + width + '%"></span></div>'
            + '</div>';
    }).join('');
}

function text(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
}
