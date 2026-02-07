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
    const btnArrow = submitBtn.querySelector('.btn-arrow');
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
                return { valid: false, message: 'Username is required' };
            }
            if (value.length < 3) {
                return { valid: false, message: 'Username must be at least 3 characters' };
            }
            return { valid: true };
        },
        password: (value) => {
            if (!value) {
                return { valid: false, message: 'Password is required' };
            }
            if (value.length < 6) {
                return { valid: false, message: 'Password must be at least 6 characters' };
            }
            return { valid: true };
        }
    };

    // Show/hide error message
    const showError = (input, message) => {
        const wrapper = input.closest('.input-wrapper');
        wrapper.classList.add('error');
        wrapper.classList.remove('success');

        // Remove existing error message
        const existingError = wrapper.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        wrapper.parentElement.appendChild(errorDiv);
    };

    const showSuccess = (input) => {
        const wrapper = input.closest('.input-wrapper');
        wrapper.classList.remove('error');
        wrapper.classList.add('success');

        // Remove existing error message
        const existingError = wrapper.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    };

    const clearValidation = (input) => {
        const wrapper = input.closest('.input-wrapper');
        wrapper.classList.remove('error', 'success');

        const existingError = wrapper.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    };

    // Real-time validation on blur
    usernameInput.addEventListener('blur', () => {
        const result = validators.username(usernameInput.value);
        if (!result.valid) {
            showError(usernameInput, result.message);
        } else {
            showSuccess(usernameInput);
        }
    });

    passwordInput.addEventListener('blur', () => {
        const result = validators.password(passwordInput.value);
        if (!result.valid) {
            showError(passwordInput, result.message);
        } else {
            showSuccess(passwordInput);
        }
    });

    // Clear validation on focus
    usernameInput.addEventListener('focus', () => clearValidation(usernameInput));
    passwordInput.addEventListener('focus', () => clearValidation(passwordInput));

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        const usernameResult = validators.username(usernameInput.value);
        const passwordResult = validators.password(passwordInput.value);

        let isValid = true;

        if (!usernameResult.valid) {
            showError(usernameInput, usernameResult.message);
            isValid = false;
        } else {
            showSuccess(usernameInput);
        }

        if (!passwordResult.valid) {
            showError(passwordInput, passwordResult.message);
            isValid = false;
        } else {
            showSuccess(passwordInput);
        }

        if (!isValid) {
            // Shake animation for invalid form
            loginForm.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 500);
            return;
        }

        // Show loading state
        btnText.classList.add('hidden');
        btnArrow.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        submitBtn.disabled = true;

        // Simulate API call
        try {
            await simulateLogin(usernameInput.value, passwordInput.value);

            // Success - show success message
            showSuccessMessage();
        } catch (error) {
            // Error - show error message
            showErrorMessage(error.message);
        } finally {
            // Reset button state
            btnText.classList.remove('hidden');
            btnArrow.classList.remove('hidden');
            btnLoader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });

    // Simulate login API call
    const simulateLogin = (username, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Accept any credentials - store username for display
                console.log('Login attempt:', { username, password: '***' });
                localStorage.setItem('username', username);
                resolve({ success: true, message: 'Login successful!' });
            }, 1500);
        });
    };

    // Show success message and redirect to video page
    const showSuccessMessage = () => {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-toast';
        successDiv.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Login successful! Redirecting...</span>
        `;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 24px;
            background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
            color: white;
            border-radius: 12px;
            font-weight: 500;
            box-shadow: 0 10px 40px rgba(52, 211, 153, 0.3);
            animation: slideIn 0.4s ease;
            z-index: 1000;
        `;
        document.body.appendChild(successDiv);

        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);

        // Redirect to video page after showing success message
        setTimeout(() => {
            window.location.href = 'video.html';
        }, 1500);
    };

    // Show error message
    const showErrorMessage = (message) => {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-toast';
        errorDiv.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span>${message}</span>
        `;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 24px;
            background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
            color: white;
            border-radius: 12px;
            font-weight: 500;
            box-shadow: 0 10px 40px rgba(248, 113, 113, 0.3);
            animation: slideIn 0.4s ease;
            z-index: 1000;
        `;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    };

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && document.activeElement.tagName !== 'BUTTON') {
            submitBtn.click();
        }
    });

    // Add subtle parallax effect to orbs on mouse move
    document.addEventListener('mousemove', (e) => {
        const orbs = document.querySelectorAll('.gradient-orb');
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const x = mouseX * speed;
            const y = mouseY * speed;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
});
