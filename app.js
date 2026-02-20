// ============================================
// DUMMY DATA & STATE MANAGEMENT
// ============================================

const dummyData = {
    user: {
        company: 'Acme Corporation',
        email: 'admin@company.com',
        role: 'Admin'
    },
    messages: [
        { id: 1, contact: 'John Doe', channel: 'SMS', preview: 'Order shipped...', date: 'Feb 18, 2:30 PM', status: 'delivered' },
        { id: 2, contact: 'Jane Smith', channel: 'Email', preview: 'Welcome to platform...', date: 'Feb 18, 1:15 PM', status: 'read' },
    ],
    contacts: [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 555-0101', group: 'VIP', tags: ['Priority', 'SMS'] },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 555-0102', group: 'Regular', tags: ['Email'] },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+1 555-0103', group: 'Subscriber', tags: ['WhatsApp'] },
        { id: 4, name: 'Alice Williams', email: 'alice@example.com', phone: '+1 555-0104', group: 'VIP', tags: ['Priority', 'SMS', 'Email'] },
    ]
};

// ============================================
// THEME MANAGEMENT
// ============================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
    updateThemeIcons();
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
}

function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.theme-btn').forEach(btn => {
        const sunIcon = btn.querySelector('.icon-sun');
        const moonIcon = btn.querySelector('.icon-moon');
        if (sunIcon && moonIcon) {
            sunIcon.style.display = isDark ? 'none' : 'block';
            moonIcon.style.display = isDark ? 'block' : 'none';
        }
    });
}

// ============================================
// AUTHENTICATION
// ============================================

function handleLogin(e) {
    e.preventDefault();
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoader = loginBtn.querySelector('.btn-loader');

    // Show loading state
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-flex';

    // Simulate API call
    setTimeout(() => {
        sessionStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'dashboard.html';
    }, 1500);
}

function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    if (!isLoggedIn && !currentPage.includes('index.html')) {
        window.location.href = 'index.html';
    }
}

function handleLogout() {
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// ============================================
// MESSAGING FUNCTIONALITY
// ============================================

function initMessaging() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.messaging-form');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            forms.forEach(f => f.style.display = 'none');

            // Add active to clicked
            btn.classList.add('active');
            const channel = btn.dataset.channel;
            document.getElementById(channel + 'Form').style.display = 'block';
        });
    });

    // SMS Character counter
    const smsTextarea = document.querySelector('#smsForm .message-input');
    if (smsTextarea) {
        smsTextarea.addEventListener('input', (e) => {
            const length = e.target.value.length;
            const segments = Math.ceil(length / 160) || 0;
            const charCount = document.querySelector('#smsForm .char-count');
            const segmentCount = document.querySelector('#smsForm .segment-count');
            if (charCount) charCount.textContent = length + ' characters';
            if (segmentCount) segmentCount.textContent = segments + ' segments';
        });
    }

    // Send message handlers
    const sendSmsBtn = document.getElementById('sendSmsBtn');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    const sendWhatsappBtn = document.getElementById('sendWhatsappBtn');

    if (sendSmsBtn) sendSmsBtn.addEventListener('click', () => sendMessage('SMS'));
    if (sendEmailBtn) sendEmailBtn.addEventListener('click', () => sendMessage('Email'));
    if (sendWhatsappBtn) sendWhatsappBtn.addEventListener('click', () => sendMessage('WhatsApp'));
}

function sendMessage(channel) {
    showToast(`${channel} message scheduled successfully!`, 'success');
    // Reset form
    setTimeout(() => {
        document.querySelectorAll('.messaging-form')[0].reset();
    }, 500);
}

// ============================================
// CONTACTS MANAGEMENT
// ============================================

function initContacts() {
    const addContactBtn = document.getElementById('addContactBtn');
    const contactModal = document.getElementById('contactModal');
    const closeModal = document.getElementById('closeContactModal');
    const cancelBtn = document.getElementById('cancelContactBtn');
    const contactForm = document.getElementById('contactForm');

    if (addContactBtn) {
        addContactBtn.addEventListener('click', () => {
            contactModal.style.display = 'flex';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            contactModal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            contactModal.style.display = 'none';
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Contact added successfully!', 'success');
            contactModal.style.display = 'none';
            contactForm.reset();
        });
    }

    // Select all checkbox
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            document.querySelectorAll('.contacts-table tbody input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
        });
    }

    // Group filter
    const groupFilter = document.getElementById('groupFilter');
    if (groupFilter) {
        groupFilter.addEventListener('change', (e) => {
            // Filter implementation
            showToast(`Filtered by: ${e.target.value || 'All Groups'}`, 'info');
        });
    }
}

// ============================================
// CAMPAIGNS
// ============================================

function initCampaigns() {
    const createCampaignBtn = document.getElementById('createCampaignBtn');
    const campaignModal = document.getElementById('campaignModal');
    const closeCampaignModal = document.getElementById('closeCampaignModal');
    const cancelCampaignBtn = document.getElementById('cancelCampaignBtn');
    const campaignForm = document.getElementById('campaignForm');

    if (createCampaignBtn) {
        createCampaignBtn.addEventListener('click', () => {
            campaignModal.style.display = 'flex';
        });
    }

    if (closeCampaignModal) {
        closeCampaignModal.addEventListener('click', () => {
            campaignModal.style.display = 'none';
        });
    }

    if (cancelCampaignBtn) {
        cancelCampaignBtn.addEventListener('click', () => {
            campaignModal.style.display = 'none';
        });
    }

    if (campaignForm) {
        campaignForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Campaign created successfully!', 'success');
            campaignModal.style.display = 'none';
            campaignForm.reset();
        });
    }
}

// ============================================
// DASHBOARD CHARTS
// ============================================

function initCharts() {
    // Bar Chart - Messages Per Day
    const barChartCanvas = document.getElementById('barChart');
    if (barChartCanvas) {
        new Chart(barChartCanvas, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Messages',
                    data: [2400, 3200, 2800, 3500, 3800, 2200, 1800],
                    backgroundColor: '#3B82F6',
                    borderRadius: 6,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // Pie Chart - Channel Distribution
    const pieChartCanvas = document.getElementById('pieChart');
    if (pieChartCanvas) {
        new Chart(pieChartCanvas, {
            type: 'doughnut',
            data: {
                labels: ['SMS', 'Email', 'WhatsApp'],
                datasets: [{
                    data: [12145, 8234, 4203],
                    backgroundColor: ['#22C55E', '#A855F7', '#06B6D4'],
                    borderColor: 'var(--bg-primary)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    // Channel Performance Chart
    const channelChartCanvas = document.getElementById('channelChart');
    if (channelChartCanvas) {
        new Chart(channelChartCanvas, {
            type: 'bar',
            data: {
                labels: ['SMS', 'Email', 'WhatsApp'],
                datasets: [
                    {
                        label: 'Sent',
                        data: [12145, 8234, 4203],
                        backgroundColor: '#3B82F6',
                        borderRadius: 6
                    },
                    {
                        label: 'Delivered',
                        data: [11970, 8198, 4088],
                        backgroundColor: '#22C55E',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Delivery Status Chart
    const deliveryChartCanvas = document.getElementById('deliveryChart');
    if (deliveryChartCanvas) {
        new Chart(deliveryChartCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Delivered', 'Failed', 'Pending'],
                datasets: [{
                    data: [98.7, 1.2, 0.1],
                    backgroundColor: ['#22C55E', '#EF4444', '#F59E0B'],
                    borderColor: 'var(--bg-primary)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    // Engagement Metrics Chart
    const engagementChartCanvas = document.getElementById('engagementChart');
    if (engagementChartCanvas) {
        new Chart(engagementChartCanvas, {
            type: 'bar',
            data: {
                labels: ['Opens', 'Clicks', 'Replies'],
                datasets: [{
                    label: 'Rate (%)',
                    data: [42.3, 18.5, 8.2],
                    backgroundColor: '#A855F7',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: { beginAtZero: true, max: 100 }
                }
            }
        });
    }

    // Message Volume Trend
    const volumeChartCanvas = document.getElementById('volumeChart');
    if (volumeChartCanvas) {
        new Chart(volumeChartCanvas, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Message Volume',
                    data: [4800, 5200, 5800, 6200],
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

// ============================================
// NOTIFICATIONS & UI
// ============================================

function initNotifications() {
    const notificationBtns = document.querySelectorAll('.notification-btn');
    
    notificationBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = btn.querySelector('.notification-dropdown');
            if (dropdown) {
                dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            }
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.notification-dropdown').forEach(d => {
            d.style.display = 'none';
        });
    });
}

function initUserMenu() {
    const userMenuBtns = document.querySelectorAll('.user-btn');
    
    userMenuBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = btn.parentElement.querySelector('.user-dropdown');
            if (dropdown) {
                dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            }
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.user-dropdown').forEach(d => {
            d.style.display = 'none';
        });
    });
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#22C55E' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-size: 14px;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// SETTINGS
// ============================================

function initSettings() {
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            showToast('Add user feature - coming soon!', 'info');
        });
    }

    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            showToast('Exporting data...', 'success');
        });
    }
}

// ============================================
// MODAL CLOSE ON OUTSIDE CLICK
// ============================================

function initModalHandlers() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function initSearch() {
    const contactSearch = document.getElementById('contactSearch');
    if (contactSearch) {
        contactSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.contacts-table tbody tr').forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }

    const historySearch = document.getElementById('historySearch');
    if (historySearch) {
        historySearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.history-table tbody tr').forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }

    const campaignSearch = document.getElementById('campaignSearch');
    if (campaignSearch) {
        campaignSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.campaign-card').forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }
}

// ============================================
// FILTERS
// ============================================

function initFilters() {
    const channelFilter = document.getElementById('channelFilter');
    const statusFilter = document.getElementById('statusFilter');

    if (channelFilter) {
        channelFilter.addEventListener('change', () => {
            applyFilters();
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            applyFilters();
        });
    }
}

function applyFilters() {
    const channelFilter = document.getElementById('channelFilter');
    const statusFilter = document.getElementById('statusFilter');

    if (!channelFilter || !statusFilter) return;

    const channel = channelFilter.value.toLowerCase();
    const status = statusFilter.value.toLowerCase();

    document.querySelectorAll('.history-table tbody tr').forEach(row => {
        const rowChannel = row.querySelector('.badge')?.textContent.trim().toLowerCase() || '';
        const rowStatus = row.querySelector('.status-badge')?.textContent.trim().toLowerCase() || '';

        const channelMatch = !channel || rowChannel.includes(channel);
        const statusMatch = !status || rowStatus.includes(status);

        row.style.display = channelMatch && statusMatch ? '' : 'none';
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Auth check (commented for demo purposes)
    // checkAuth();

    // Initialize theme
    initTheme();

    // Theme toggle
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout buttons
    document.querySelectorAll('.btn-logout').forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });

    // Page-specific initialization
    const currentPath = window.location.pathname;

    if (currentPath.includes('messaging.html')) {
        initMessaging();
    }

    if (currentPath.includes('contacts.html')) {
        initContacts();
    }

    if (currentPath.includes('campaigns.html')) {
        initCampaigns();
    }

    if (currentPath.includes('dashboard.html') || currentPath.includes('analytics.html')) {
        initCharts();
    }

    if (currentPath.includes('history.html')) {
        initFilters();
    }

    if (currentPath.includes('settings.html')) {
        initSettings();
    }

    // Global features
    initNotifications();
    initUserMenu();
    initModalHandlers();
    initSearch();

    // Add smooth animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Handle ESC key to close modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
});
