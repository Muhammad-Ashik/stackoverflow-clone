// Switch between login and register tabs with slide transition
function switchTab(tab) {
  const tabs = document.querySelectorAll('.tab');
  const forms = document.querySelectorAll('.form-section');
  const activeForm = document.querySelector('.form-section.active');

  // Remove active class from current form
  if (activeForm) {
    activeForm.style.animation = 'slideOut 0.3s ease forwards';

    setTimeout(() => {
      forms.forEach((f) => {
        f.classList.remove('active');
        f.style.animation = '';
      });

      // Activate new tab and form
      tabs.forEach((t) => t.classList.remove('active'));

      if (tab === 'login') {
        document.getElementById('login-tab').classList.add('active');
        document.getElementById('login-form').classList.add('active');
      } else {
        document.getElementById('register-tab').classList.add('active');
        document.getElementById('register-form').classList.add('active');
      }
    }, 300);
  } else {
    // First load - no transition needed
    tabs.forEach((t) => t.classList.remove('active'));
    forms.forEach((f) => f.classList.remove('active'));

    if (tab === 'login') {
      document.getElementById('login-tab').classList.add('active');
      document.getElementById('login-form').classList.add('active');
    } else {
      document.getElementById('register-tab').classList.add('active');
      document.getElementById('register-form').classList.add('active');
    }
  }

  hideAlert();
}

// Password strength checker
function checkPasswordStrength(password) {
  const strengthIndicator = document.getElementById('password-strength');

  if (password.length === 0) {
    strengthIndicator.classList.remove('show', 'weak', 'medium', 'strong');
    return;
  }

  strengthIndicator.classList.add('show');
  strengthIndicator.classList.remove('weak', 'medium', 'strong');

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) {
    strengthIndicator.classList.add('weak');
  } else if (strength === 3) {
    strengthIndicator.classList.add('medium');
  } else {
    strengthIndicator.classList.add('strong');
  }
}

// Show alert message
function showAlert(message, type) {
  const alert = document.getElementById('alert');
  alert.textContent = message;
  alert.className = `alert ${type} show`;
}

// Hide alert message
function hideAlert() {
  const alert = document.getElementById('alert');
  alert.className = 'alert';
}

// Show field error
function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}-error`);

  input.classList.add('error');
  errorElement.textContent = message;
  errorElement.classList.add('show');
}

// Hide field error
function hideFieldError(fieldId) {
  const input = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}-error`);

  input.classList.remove('error');
  errorElement.textContent = '';
  errorElement.classList.remove('show');
}

// Clear all errors
function clearAllErrors(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll('input');

  inputs.forEach((input) => {
    hideFieldError(input.id);
  });
}

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
function isStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
}

// Handle login
async function handleLogin(event) {
  event.preventDefault();
  hideAlert();
  clearAllErrors('login-form');

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');

  let hasError = false;

  // Validate email
  if (!email) {
    showFieldError('login-email', 'Email is required');
    hasError = true;
  } else if (!isValidEmail(email)) {
    showFieldError('login-email', 'Please enter a valid email address');
    hasError = true;
  }

  // Validate password
  if (!password) {
    showFieldError('login-password', 'Password is required');
    hasError = true;
  } else if (password.length < 8) {
    showFieldError('login-password', 'Password must be at least 8 characters');
    hasError = true;
  }

  if (hasError) return;

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Signing in...';

  try {
    const response = await fetch('/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      localStorage.setItem('token', data.data.token);
      showAlert('Login successful! Redirecting...', 'success');

      setTimeout(() => {
        window.location.href = '/home.html';
      }, 800);
    } else {
      showAlert(
        data.message || 'Invalid credentials. Please try again.',
        'error',
      );
    }
  } catch (error) {
    showAlert('Connection error. Please check your network.', 'error');
    console.error('Login error:', error);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
}

// Handle registration
async function handleRegister(event) {
  event.preventDefault();
  hideAlert();
  clearAllErrors('register-form');

  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const btn = document.getElementById('register-btn');

  let hasError = false;

  // Validate name
  if (!name) {
    showFieldError('register-name', 'Name is required');
    hasError = true;
  } else if (name.length < 2) {
    showFieldError('register-name', 'Name must be at least 2 characters long');
    hasError = true;
  } else if (name.length > 50) {
    showFieldError('register-name', 'Name must not exceed 50 characters');
    hasError = true;
  }

  // Validate email
  if (!email) {
    showFieldError('register-email', 'Email is required');
    hasError = true;
  } else if (!isValidEmail(email)) {
    showFieldError('register-email', 'Please enter a valid email address');
    hasError = true;
  }

  // Validate password
  if (!password) {
    showFieldError('register-password', 'Password is required');
    hasError = true;
  } else if (password.length < 8) {
    showFieldError(
      'register-password',
      'Password must be at least 8 characters long',
    );
    hasError = true;
  } else if (!isStrongPassword(password)) {
    showFieldError(
      'register-password',
      'Password must contain uppercase, lowercase, and numbers',
    );
    hasError = true;
  }

  if (hasError) return;

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Creating account...';

  try {
    const response = await fetch('/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showAlert('Account created successfully! Please sign in.', 'success');

      setTimeout(() => {
        switchTab('login');
        document.getElementById('login-email').value = email;
      }, 2000);
    } else {
      showAlert(
        data.message ||
          data.errors?.[0] ||
          'Registration failed. Please try again.',
        'error',
      );
    }
  } catch (error) {
    showAlert('Connection error. Please check your network.', 'error');
    console.error('Registration error:', error);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Create Account';
  }
}

// Check if user is already logged in and setup event listeners
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-tab').addEventListener('click', () => {
    switchTab('login');
  });

  document.getElementById('register-tab').addEventListener('click', () => {
    switchTab('register');
  });

  document
    .getElementById('login-form')
    .querySelector('form')
    .addEventListener('submit', handleLogin);

  document
    .getElementById('register-form')
    .querySelector('form')
    .addEventListener('submit', handleRegister);

  // Real-time validation - clear errors on input
  document.getElementById('login-email').addEventListener('input', () => {
    hideFieldError('login-email');
  });

  document.getElementById('login-password').addEventListener('input', () => {
    hideFieldError('login-password');
  });

  document.getElementById('register-name').addEventListener('input', () => {
    hideFieldError('register-name');
  });

  document.getElementById('register-email').addEventListener('input', () => {
    hideFieldError('register-email');
  });

  document
    .getElementById('register-password')
    .addEventListener('input', (e) => {
      hideFieldError('register-password');
      checkPasswordStrength(e.target.value);
    });

  const token = localStorage.getItem('token');
  if (token) {
    showAlert(
      'You are already logged in! Token is stored in localStorage.',
      'success',
    );
  }
});
