document.addEventListener('DOMContentLoaded', function () {
    Store.init();
    Store.redirectIfAuthenticated();
    fillPreview();
    bindLogin();
    bindResetPassword();
    bindPanelToggle();
});

function bindLogin() {
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();
        submitLogin();
    });
}

function bindResetPassword() {
    document.getElementById('resetPasswordForm').addEventListener('submit', function (event) {
        event.preventDefault();
        submitResetPassword();
    });
}

function bindPanelToggle() {
    document.getElementById('showResetForm').addEventListener('click', function () {
        showResetPanel();
    });

    document.getElementById('showLoginForm').addEventListener('click', function () {
        showLoginPanel();
    });
}

function submitLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    hideError();

    if (!username || !password) {
        showError('Vui lòng nhập đủ tài khoản và mật khẩu.');
        return;
    }

    const result = Store.login(username, password);
    if (!result.ok) {
        showError(result.message);
        return;
    }

    window.location.href = 'trangchu.html';
}

function submitResetPassword() {
    hideResetFeedback();

    const result = Store.resetAdminPassword({
        username: document.getElementById('resetUsername').value.trim(),
        recoveryKey: document.getElementById('recoveryKey').value.trim(),
        newPassword: document.getElementById('newPassword').value.trim(),
        confirmPassword: document.getElementById('confirmPassword').value.trim()
    });

    if (!result.ok) {
        showResetError(result.message);
        return;
    }

    document.getElementById('username').value = document.getElementById('resetUsername').value.trim();
    document.getElementById('password').value = '';
    showResetMessage(result.message);
}

function showResetPanel() {
    hideError();
    hideResetFeedback();
    document.getElementById('loginPanel').style.display = 'none';
    document.getElementById('resetPanel').style.display = 'block';
    document.getElementById('resetUsername').value = document.getElementById('username').value.trim();
}

function showLoginPanel() {
    document.getElementById('loginPanel').style.display = 'block';
    document.getElementById('resetPanel').style.display = 'none';
    hideResetFeedback();
}

function fillPreview() {
    const stats = Store.analytics();
    document.getElementById('previewRevenue').textContent = Store.money(stats.expectedRevenue);
    document.getElementById('previewBookings').textContent = stats.activeBookings;
    document.getElementById('previewFields').textContent = stats.fieldCount;
}

function showError(message) {
    const node = document.getElementById('errorMessage');
    node.textContent = message;
    node.style.display = 'block';
}

function hideError() {
    const node = document.getElementById('errorMessage');
    node.textContent = '';
    node.style.display = 'none';
}

function showResetMessage(message) {
    const node = document.getElementById('resetMessage');
    node.textContent = message + ' Quay lại đăng nhập để vào hệ thống.';
    node.style.display = 'block';
    document.getElementById('resetErrorMessage').style.display = 'none';
}

function showResetError(message) {
    const node = document.getElementById('resetErrorMessage');
    node.textContent = message;
    node.style.display = 'block';
}

function hideResetFeedback() {
    const successNode = document.getElementById('resetMessage');
    const errorNode = document.getElementById('resetErrorMessage');
    successNode.textContent = '';
    successNode.style.display = 'none';
    errorNode.textContent = '';
    errorNode.style.display = 'none';
}
