export function initializeScripts() {
    document.getElementById('registerBtn').addEventListener('click', function() {
        document.getElementById('loginSection').classList.add('blurred');
        document.getElementById('registerSection').classList.remove('blurred');
    });

    document.getElementById('loginBtn').addEventListener('click', function() {
        document.getElementById('loginSection').classList.remove('blurred');
        document.getElementById('registerSection').classList.add('blurred');
    });

    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        if (this.checkValidity()) {
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password === confirmPassword) {
                localStorage.setItem('email', email);
                localStorage.setItem('password', password);
                alert('Registro exitoso!');
                this.reset();
                this.classList.remove('was-validated');
                resetInputValidation(this);
            } else {
                alert('Las contraseñas no coinciden.');
            }
        } else {
            this.classList.add('was-validated');
        }
    });

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        if (this.checkValidity()) {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            if (email === localStorage.getItem('email') && password === localStorage.getItem('password')) {
                alert('Inicio de sesión exitoso!');
                this.reset();
                this.classList.remove('was-validated');
                resetInputValidation(this);
            } else {
                alert('Correo electrónico o contraseña incorrectos.');
            }
        } else {
            this.classList.add('was-validated');
        }
    });

    document.querySelectorAll('#registerEmail, #registerPassword, #confirmPassword, #loginEmail, #loginPassword').forEach(input => {
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        });
    });

    document.getElementById('confirmPassword').addEventListener('input', function() {
        const password = document.getElementById('registerPassword').value;
        if (this.value === password) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        } else {
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
        }
    });
}

function resetInputValidation(form) {
    Array.from(form.querySelectorAll('.form-control')).forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
    });
}
