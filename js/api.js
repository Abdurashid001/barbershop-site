// API and Form Handling Logic
document.addEventListener('DOMContentLoaded', () => {
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const messageEl = document.getElementById('loginMessage');
            messageEl.style.color = 'black';
            messageEl.innerText = 'Загрузка...';

            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userName', data.name);
                    messageEl.style.color = 'green';
                    messageEl.innerText = 'Успешный вход! Переадресация...';
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    messageEl.style.color = 'red';
                    messageEl.innerText = data.error || 'Ошибка входа';
                }
            } catch (err) {
                messageEl.style.color = 'red';
                messageEl.innerText = 'Ошибка соединения с сервером';
            }
        });
    }

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const messageEl = document.getElementById('regMessage');
            messageEl.style.color = 'black';
            messageEl.innerText = 'Загрузка...';

            try {
                const res = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                if (data.success) {
                    messageEl.style.color = 'green';
                    messageEl.innerText = 'Успешная регистрация! Теперь вы можете войти.';
                    registerForm.reset();
                } else {
                    messageEl.style.color = 'red';
                    messageEl.innerText = data.error || 'Ошибка регистрации';
                }
            } catch (err) {
                messageEl.style.color = 'red';
                messageEl.innerText = 'Ошибка соединения с сервером';
            }
        });
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            const messageEl = document.getElementById('contactMessage');
            messageEl.style.color = 'black';
            messageEl.innerText = 'Отправка...';

            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, subject, message })
                });
                const data = await res.json();
                if (data.success) {
                    messageEl.style.color = 'green';
                    messageEl.innerText = data.message;
                    contactForm.reset();
                } else {
                    messageEl.style.color = 'red';
                    messageEl.innerText = data.error || 'Ошибка отправки';
                }
            } catch (err) {
                messageEl.style.color = 'red';
                messageEl.innerText = 'Ошибка соединения с сервером';
            }
        });
    }

    // Booking form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('bookName').value;
            const phone = document.getElementById('bookPhone').value;
            const service_type = document.getElementById('bookService').value;
            const booking_date = document.getElementById('bookDate').value;
            const booking_time = document.getElementById('bookTime').value;
            
            const messageEl = document.getElementById('bookMessage');
            messageEl.style.color = 'black';
            messageEl.innerText = 'Загрузка...';

            try {
                const res = await fetch('/api/book', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, phone, service_type, booking_date, booking_time })
                });
                const data = await res.json();
                if (data.success) {
                    messageEl.style.color = 'green';
                    messageEl.innerText = data.message;
                    bookingForm.reset();
                    setTimeout(() => {
                        const modalElement = document.getElementById('bookingModal');
                        const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                        modal.hide();
                    }, 2000);
                } else {
                    messageEl.style.color = 'red';
                    messageEl.innerText = data.error || 'Ошибка записи';
                }
            } catch (err) {
                messageEl.style.color = 'red';
                messageEl.innerText = 'Ошибка соединения с сервером';
            }
        });
    }

    // UI Updates for logged in users
    const userName = localStorage.getItem('userName');
    const authLink = document.getElementById('navAuthLink');
    if (userName && authLink) {
        authLink.innerHTML = `<i class="fa fa-user me-2"></i>${userName} (Выход)`;
        authLink.href = '#';
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.reload();
        });
    }
});
