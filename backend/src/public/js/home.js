let currentPage = 1;
const limit = 10;
let selectedUsers = new Set();

// Check authentication
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/';
    return null;
  }
  return token;
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}

// Show error message
function showError(message) {
  const errorContainer = document.getElementById('error-message');
  errorContainer.textContent = message;
  errorContainer.classList.add('show');
  document.getElementById('loading').style.display = 'none';
  document.getElementById('table-container').style.display = 'none';
  document.getElementById('mobile-users-list').style.display = 'none';
  document.querySelector('.table-controls').style.display = 'none';
  document.getElementById('pagination').style.display = 'none';
}

// Hide loading
function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

// Update selected count
function updateSelectedCount() {
  const count = selectedUsers.size;
  document.getElementById('selected-count').textContent = count;
  document.getElementById('delete-selected-btn').disabled = count === 0;
}

// Toggle select all
function toggleSelectAll(checked) {
  const desktopCheckboxes = document.querySelectorAll('.user-checkbox');
  const mobileCheckboxes = document.querySelectorAll('.user-checkbox-mobile');

  desktopCheckboxes.forEach((checkbox) => {
    checkbox.checked = checked;
    const userId = parseInt(checkbox.dataset.userId);
    if (checked) {
      selectedUsers.add(userId);
      checkbox.closest('tr').classList.add('selected');
    } else {
      selectedUsers.delete(userId);
      checkbox.closest('tr').classList.remove('selected');
    }
  });

  mobileCheckboxes.forEach((checkbox) => {
    checkbox.checked = checked;
    const userId = parseInt(checkbox.dataset.userId);
    const card = document.querySelector(
      `.mobile-user-card[data-user-id="${userId}"]`,
    );
    if (checked) {
      selectedUsers.add(userId);
      card.classList.add('selected');
    } else {
      selectedUsers.delete(userId);
      card.classList.remove('selected');
    }
  });

  updateSelectedCount();
}

// Toggle single user selection
function toggleUserSelection(userId, checked) {
  const row = document
    .querySelector(`input[data-user-id="${userId}"]`)
    .closest('tr');
  if (checked) {
    selectedUsers.add(userId);
    row.classList.add('selected');
  } else {
    selectedUsers.delete(userId);
    row.classList.remove('selected');
  }
  updateSelectedCount();
  updateSelectAllCheckbox();
}

// Update select all checkbox state
function updateSelectAllCheckbox() {
  const checkboxes = document.querySelectorAll('.user-checkbox');
  const selectAllCheckbox = document.getElementById('select-all');
  const allChecked = Array.from(checkboxes).every((cb) => cb.checked);
  selectAllCheckbox.checked = allChecked && checkboxes.length > 0;
}

// Delete single user
async function deleteUser(userId, userName) {
  if (!confirm(`Are you sure you want to delete ${userName}?`)) {
    return;
  }

  const token = checkAuth();
  if (!token) return;

  try {
    const response = await fetch(`/v1/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      logout();
      return;
    }

    if (response.ok) {
      selectedUsers.delete(userId);
      fetchUsers(currentPage);
    } else {
      const data = await response.json();
      alert(data.message || 'Failed to delete user');
    }
  } catch (error) {
    alert('Connection error. Please try again.');
    console.error('Delete user error:', error);
  }
}

// Delete selected users
async function deleteSelectedUsers() {
  if (selectedUsers.size === 0) return;

  if (
    !confirm(
      `Are you sure you want to delete ${selectedUsers.size} user(s)? This action cannot be undone.`,
    )
  ) {
    return;
  }

  const token = checkAuth();
  if (!token) return;

  const deleteBtn = document.getElementById('delete-selected-btn');
  deleteBtn.disabled = true;
  deleteBtn.innerHTML = '<span class="spinner"></span> Deleting...';

  const userIds = Array.from(selectedUsers);
  let successCount = 0;
  let failCount = 0;

  for (const userId of userIds) {
    try {
      const response = await fetch(`/v1/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        successCount++;
        selectedUsers.delete(userId);
      } else {
        failCount++;
      }
    } catch (error) {
      failCount++;
      console.error(`Failed to delete user ${userId}:`, error);
    }
  }

  deleteBtn.innerHTML = `Delete Selected (<span id="selected-count">0</span>)`;

  if (successCount > 0) {
    fetchUsers(currentPage);
  }

  if (failCount > 0) {
    alert(
      `Deleted ${successCount} user(s). Failed to delete ${failCount} user(s).`,
    );
  }
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Get initials from name
function getInitials(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Fetch users from API
async function fetchUsers(page = 1) {
  const token = checkAuth();
  if (!token) return;

  document.getElementById('loading').style.display = 'block';
  document.getElementById('error-message').classList.remove('show');

  try {
    const response = await fetch(`/v1/users?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      logout();
      return;
    }

    const data = await response.json();

    if (response.ok && data.success) {
      hideLoading();
      displayUsers(data.data);
      displayPagination(data.pagination);
    } else {
      showError(data.message || 'Failed to load users');
    }
  } catch (error) {
    showError('Connection error. Please check your network.');
    console.error('Fetch users error:', error);
  }
}

// Display users
function displayUsers(users) {
  const tableBody = document.getElementById('table-body');
  const tableContainer = document.getElementById('table-container');
  const mobileList = document.getElementById('mobile-users-list');
  const tableControls = document.querySelector('.table-controls');

  tableContainer.style.display = 'block';
  mobileList.style.display = 'flex';
  tableControls.style.display = 'flex';

  selectedUsers.clear();
  document.getElementById('select-all').checked = false;
  updateSelectedCount();

  if (!users || users.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #9ca3af;">No users found.</td></tr>';
    mobileList.innerHTML =
      '<div style="text-align: center; padding: 40px; color: white; width: 100%;">No users found.</div>';
    return;
  }

  // Desktop table view
  tableBody.innerHTML = users
    .map(
      (user, index) => `
    <tr style="animation-delay: ${index * 0.05}s;">
      <td class="checkbox-col">
        <input type="checkbox" class="user-checkbox" data-user-id="${user.id}" />
      </td>
      <td>
        <div class="user-avatar">${getInitials(user.name)}</div>
      </td>
      <td class="user-name">${user.name}</td>
      <td class="user-email">${user.email}</td>
      <td class="user-date">${user.createdAt ? formatDate(user.createdAt) : 'N/A'}</td>
      <td class="actions-col">
        <button class="btn-delete" data-user-id="${user.id}" data-user-name="${user.name}">Delete</button>
      </td>
    </tr>
  `,
    )
    .join('');

  // Mobile card view
  mobileList.innerHTML = users
    .map(
      (user, index) => `
    <div class="mobile-user-card" data-user-id="${user.id}" style="animation-delay: ${index * 0.05}s;">
      <div class="mobile-card-header">
        <div class="mobile-card-checkbox">
          <input type="checkbox" class="user-checkbox-mobile" data-user-id="${user.id}" />
        </div>
        <div class="mobile-card-avatar">${getInitials(user.name)}</div>
        <div class="mobile-card-info">
          <div class="mobile-card-name">${user.name}</div>
          <div class="mobile-card-email">${user.email}</div>
        </div>
      </div>
      <div class="mobile-card-footer">
        <div class="mobile-card-date">${user.createdAt ? `Joined ${formatDate(user.createdAt)}` : 'N/A'}</div>
        <div class="mobile-card-actions">
          <button class="btn-delete-mobile" data-user-id="${user.id}" data-user-name="${user.name}">Delete</button>
        </div>
      </div>
    </div>
  `,
    )
    .join('');

  attachTableEventListeners();
  attachMobileEventListeners();
}

// Attach event listeners to table elements
function attachTableEventListeners() {
  document.getElementById('select-all').addEventListener('change', (e) => {
    toggleSelectAll(e.target.checked);
  });

  document.querySelectorAll('.user-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
      const userId = parseInt(e.target.dataset.userId);
      toggleUserSelection(userId, e.target.checked);
    });
  });

  document.querySelectorAll('.btn-delete').forEach((button) => {
    button.addEventListener('click', (e) => {
      const userId = parseInt(e.target.dataset.userId);
      const userName = e.target.dataset.userName;
      deleteUser(userId, userName);
    });
  });
}

// Attach event listeners to mobile cards
function attachMobileEventListeners() {
  document.querySelectorAll('.user-checkbox-mobile').forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
      const userId = parseInt(e.target.dataset.userId);
      const card = document.querySelector(
        `.mobile-user-card[data-user-id="${userId}"]`,
      );

      if (e.target.checked) {
        selectedUsers.add(userId);
        card.classList.add('selected');
      } else {
        selectedUsers.delete(userId);
        card.classList.remove('selected');
      }

      updateSelectedCount();
      updateMobileSelectAllState();
    });
  });

  document.querySelectorAll('.btn-delete-mobile').forEach((button) => {
    button.addEventListener('click', (e) => {
      const userId = parseInt(e.target.dataset.userId);
      const userName = e.target.dataset.userName;
      deleteUser(userId, userName);
    });
  });
}

// Update mobile select all state
function updateMobileSelectAllState() {
  const mobileCheckboxes = document.querySelectorAll('.user-checkbox-mobile');
  const desktopCheckboxes = document.querySelectorAll('.user-checkbox');
  const selectAllCheckbox = document.getElementById('select-all');

  const allMobileChecked =
    mobileCheckboxes.length > 0 &&
    Array.from(mobileCheckboxes).every((cb) => cb.checked);
  const allDesktopChecked =
    desktopCheckboxes.length > 0 &&
    Array.from(desktopCheckboxes).every((cb) => cb.checked);

  selectAllCheckbox.checked = allMobileChecked || allDesktopChecked;
}

// Display pagination
function displayPagination(pagination) {
  const container = document.getElementById('pagination');
  container.style.display = 'flex';

  const { page, totalPages } = pagination;

  container.innerHTML = `
    <button id="prev-btn" ${page <= 1 ? 'disabled' : ''}>Previous</button>
    <span class="page-info">Page ${page} of ${totalPages}</span>
    <button id="next-btn" ${page >= totalPages ? 'disabled' : ''}>Next</button>
  `;

  document.getElementById('prev-btn').addEventListener('click', () => {
    if (page > 1) {
      currentPage = page - 1;
      fetchUsers(currentPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  document.getElementById('next-btn').addEventListener('click', () => {
    if (page < totalPages) {
      currentPage = page + 1;
      fetchUsers(currentPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  const token = checkAuth();
  if (!token) return;

  document.getElementById('logout-btn').addEventListener('click', logout);

  document
    .getElementById('delete-selected-btn')
    .addEventListener('click', deleteSelectedUsers);

  fetchUsers(currentPage);
});
