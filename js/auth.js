document.addEventListener('DOMContentLoaded', function () {
    Store.init();
    Store.requireAuth();
    renderAdmin();
    bindLogout();
});

function renderAdmin() {
    const admin = Store.currentAdmin();
    document.querySelectorAll('[data-admin-name]').forEach(function (node) {
        node.textContent = admin ? admin.name : 'Dũngcris';
    });
    document.querySelectorAll('[data-admin-role]').forEach(function (node) {
        node.textContent = admin ? admin.role : 'Quản lý ADM';
    });
}

function bindLogout() {
    document.querySelectorAll('[data-logout]').forEach(function (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            logout();
        });
    });
}

function logout() {
    if (window.confirm('Bạn muốn đăng xuất khỏi khu vực Quản lý ADM?')) {
        Store.logout();
        window.location.href = 'index.html';
    }
}

window.logout = logout;
