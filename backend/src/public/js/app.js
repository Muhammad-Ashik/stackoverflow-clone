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

// Handle login
async function handleLogin(event) {
  event.preventDefault();
  hideAlert();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');

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
      showAlert('Login successful! Welcome back! 🎉', 'success');
      localStorage.setItem('token', data.data.token);

      setTimeout(() => {
        showAlert('Token saved! You can now use the API.', 'success');
        console.log('JWT Token:', data.data.token);
      }, 1500);
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

  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const btn = document.getElementById('register-btn');

  if (name.length < 2) {
    showAlert('Name must be at least 2 characters long.', 'error');
    return;
  }

  if (password.length < 8) {
    showAlert('Password must be at least 8 characters long.', 'error');
    return;
  }

  if (
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/\d/.test(password)
  ) {
    showAlert(
      'Password must contain uppercase, lowercase, and numbers.',
      'error',
    );
    return;
  }

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
      showAlert('Account created successfully! 🎉 Please sign in.', 'success');

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

  document
    .getElementById('register-password')
    .addEventListener('input', (e) => {
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
