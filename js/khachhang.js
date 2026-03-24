let customerEditingId = '';

document.addEventListener('DOMContentLoaded', function () {
    bindCustomerForm();
    bindCustomerFilters();
    renderCustomers();
    window.addEventListener('store:updated', renderCustomers);
    window.addEventListener('storage', renderCustomers);
});

function bindCustomerForm() {
    document.getElementById('customerForm').addEventListener('submit', function (event) {
        event.preventDefault();
        saveCustomer();
    });

    document.getElementById('cancelCustomerEdit').addEventListener('click', resetCustomerForm);
}

function bindCustomerFilters() {
    ['customerSearch', 'customerLevelFilter', 'customerStatusFilter', 'customerSort'].forEach(function (id) {
        document.getElementById(id).addEventListener(id === 'customerSearch' ? 'input' : 'change', renderCustomers);
    });
}

function saveCustomer() {
    try {
        Store.saveCustomer({
            id: customerEditingId || undefined,
            name: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            email: document.getElementById('customerEmail').value,
            teamName: document.getElementById('customerTeamName').value,
            level: document.getElementById('customerLevel').value,
            status: document.getElementById('customerStatus').value,
            notes: document.getElementById('customerNotes').value
        });

        resetCustomerForm();
        renderCustomers();
    } catch (error) {
        window.alert(error.message);
    }
}

function renderCustomers() {
    const all = Store.customers();
    const search = document.getElementById('customerSearch').value.trim().toLowerCase();
    const level = document.getElementById('customerLevelFilter').value;
    const status = document.getElementById('customerStatusFilter').value;
    const sort = document.getElementById('customerSort').value;

    let rows = all.filter(function (customer) {
        const haystack = [customer.name, customer.phone, customer.email, customer.teamName, customer.notes].join(' ').toLowerCase();
        return (!search || haystack.includes(search))
            && (!level || customer.level === level)
            && (!status || customer.status === status);
    });

    rows = rows.sort(function (a, b) {
        if (sort === 'spent') return b.totalSpent - a.totalSpent;
        if (sort === 'bookings') return b.bookingCount - a.bookingCount;
        if (sort === 'name') return a.name.localeCompare(b.name, 'vi');
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    document.getElementById('customerTotal').textContent = all.length;
    document.getElementById('customerActive').textContent = all.filter(function (customer) {
        return customer.status === 'active';
    }).length;
    document.getElementById('customerVip').textContent = all.filter(function (customer) {
        return customer.level === 'vip' || customer.level === 'team';
    }).length;
    document.getElementById('customerRevenue').textContent = Store.money(all.reduce(function (sum, customer) {
        return sum + customer.totalSpent;
    }, 0));

    document.getElementById('customerTableBody').innerHTML = rows.length ? rows.map(function (customer, index) {
        return '<tr>'
            + '<td>' + (index + 1) + '</td>'
            + '<td><strong>' + Store.esc(customer.name) + '</strong><br><span class="table-muted">' + Store.esc(customer.phone) + '</span></td>'
            + '<td>' + Store.esc(customer.teamName || '-') + '</td>'
            + '<td><span class="badge badge-' + customer.level + '">' + Store.LABELS.customerLevel[customer.level] + '</span></td>'
            + '<td><span class="badge badge-' + customer.status + '">' + Store.LABELS.customerStatus[customer.status] + '</span></td>'
            + '<td>' + customer.bookingCount + '</td>'
            + '<td>' + Store.money(customer.totalSpent) + '</td>'
            + '<td>' + (customer.lastBookingAt ? Store.dateText(customer.lastBookingAt, true) : '-') + '</td>'
            + '<td><div class="table-actions"><button class="table-button" onclick="editCustomer(\'' + customer.id + '\')">Sửa</button><button class="table-button danger" onclick="deleteCustomer(\'' + customer.id + '\')">Xóa</button></div></td>'
            + '</tr>';
    }).join('') : '<tr><td colspan="9" class="table-empty">Không tìm thấy khách hàng phù hợp.</td></tr>';
}

function editCustomer(id) {
    const customer = Store.customers().find(function (entry) {
        return entry.id === id;
    });
    if (!customer) return;

    customerEditingId = customer.id;
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerPhone').value = customer.phone;
    document.getElementById('customerEmail').value = customer.email || '';
    document.getElementById('customerTeamName').value = customer.teamName || '';
    document.getElementById('customerLevel').value = customer.level || 'standard';
    document.getElementById('customerStatus').value = customer.status || 'active';
    document.getElementById('customerNotes').value = customer.notes || '';
    document.getElementById('customerSubmitLabel').textContent = 'Cập nhật khách hàng';
    document.getElementById('cancelCustomerEdit').style.display = 'inline-flex';
    document.getElementById('customerPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteCustomer(id) {
    if (!window.confirm('Bạn chắc chắn muốn xóa khách hàng này?')) return;

    try {
        Store.removeCustomer(id);
        if (customerEditingId === id) resetCustomerForm();
        renderCustomers();
    } catch (error) {
        window.alert(error.message);
    }
}

function resetCustomerForm() {
    customerEditingId = '';
    document.getElementById('customerForm').reset();
    document.getElementById('customerLevel').value = 'standard';
    document.getElementById('customerStatus').value = 'active';
    document.getElementById('customerSubmitLabel').textContent = 'Lưu khách hàng';
    document.getElementById('cancelCustomerEdit').style.display = 'none';
}

window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;
