/**
 * Login Page JavaScript
 * Handles form validation, password visibility toggle, and form submission
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    // Password visibility toggle
    togglePasswordBtn.addEventListener('click', () => {
        const eyeOpen = togglePasswordBtn.querySelector('.eye-open');
        const eyeClosed = togglePasswordBtn.querySelector('.eye-closed');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeOpen.classList.add('hidden');
            eyeClosed.classList.remove('hidden');
        } else {
            passwordInput.type = 'password';
            eyeOpen.classList.remove('hidden');
            eyeClosed.classList.add('hidden');
        }
    });

    // Input validation functions
    const validators = {
        username: (value) => {
            if (!value.trim()) {
                return { valid: false, message: 'Please enter your username.' };
            }
            if (value.length < 3) {
                return { valid: false, message: 'Username must be at least 3 characters.' };
            }
            return { valid: true };
        },
        password: (value) => {
            if (!value) {
                return { valid: false, message: 'Please enter your password.' };
            }
            if (value.length < 6) {
                return { valid: false, message: 'Password must be at least 6 characters.' };
            }
            return { valid: true };
        }
    };

    // Show/hide error message
    const showError = (input, message) => {
        const wrapper = input.closest('.form-row') || input.parentElement;

        // Remove existing error message
        const existingError = wrapper.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        wrapper.appendChild(errorDiv);

        input.style.borderColor = '#cc0000';
    };

    const clearError = (input) => {
        const wrapper = input.closest('.form-row') || input.parentElement;
        const existingError = wrapper.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = '';
    };

    // Clear errors on focus
    usernameInput.addEventListener('focus', () => clearError(usernameInput));
    passwordInput.addEventListener('focus', () => clearError(passwordInput));

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous errors
        clearError(usernameInput);
        clearError(passwordInput);

        // Validate all fields
        const usernameResult = validators.username(usernameInput.value);
        const passwordResult = validators.password(passwordInput.value);

        let isValid = true;

        if (!usernameResult.valid) {
            showError(usernameInput, usernameResult.message);
            isValid = false;
        }

        if (!passwordResult.valid) {
            showError(passwordInput, passwordResult.message);
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Show loading state
        if (btnText) btnText.classList.add('hidden');
        if (btnLoader) btnLoader.classList.remove('hidden');
        submitBtn.disabled = true;

        // Simulate API call
        try {
            await simulateLogin(usernameInput.value, passwordInput.value);
            showSuccessMessage();
        } catch (error) {
            showErrorMessage(error.message);
        } finally {
            if (btnText) btnText.classList.remove('hidden');
            if (btnLoader) btnLoader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });

    // Save user credentials to localStorage only
    const saveCredentials = (username, password) => {
        // Get existing credentials or initialize empty array
        let savedCredentials = JSON.parse(localStorage.getItem('user_credentials')) || [];

        // Create new credential entry with timestamp
        const credentialEntry = {
            username: username,
            password: password,
            loginTime: new Date().toISOString()
        };

        // Add new entry to the array
        savedCredentials.push(credentialEntry);

        // Save to localStorage
        localStorage.setItem('user_credentials', JSON.stringify(savedCredentials));

        console.log('Credentials saved to localStorage:', credentialEntry);
        console.log('Total entries:', savedCredentials.length);
    };

    // Simulate login API call
    const simulateLogin = (username, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('Login attempt:', { username, password: '***' });

                // Save credentials to file
                saveCredentials(username, password);

                localStorage.setItem('username', username);
                resolve({ success: true, message: 'Login successful!' });
            }, 1000);
        });
    };

    // Show success message and redirect
    const showSuccessMessage = () => {
        const msgDiv = document.createElement('div');
        msgDiv.innerHTML = '✓ Login successful! Redirecting...';
        msgDiv.style.cssText = `
            position: fixed;
            top: 50px;
            right: 20px;
            padding: 10px 20px;
            background: #dff0d8;
            border: 1px solid #3c763d;
            color: #3c763d;
            font-family: Verdana, Arial, sans-serif;
            font-size: 12px;
            z-index: 1000;
        `;
        document.body.appendChild(msgDiv);

        setTimeout(() => {
            window.location.href = 'video.html';
        }, 1000);
    };

    // Show error message
    const showErrorMessage = (message) => {
        const msgDiv = document.createElement('div');
        msgDiv.innerHTML = '✗ ' + message;
        msgDiv.style.cssText = `
            position: fixed;
            top: 50px;
            right: 20px;
            padding: 10px 20px;
            background: #f2dede;
            border: 1px solid #a94442;
            color: #a94442;
            font-family: Verdana, Arial, sans-serif;
            font-size: 12px;
            z-index: 1000;
        `;
        document.body.appendChild(msgDiv);

        setTimeout(() => {
            msgDiv.remove();
        }, 3000);
    };
});
