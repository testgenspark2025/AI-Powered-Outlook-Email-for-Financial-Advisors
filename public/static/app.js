// Financial Advisor Outlook - Personalized Client Communications Platform

let emails = [];
let clientSegments = [];
let selectedEmailId = null;
let darkMode = false;
let analytics = {};

// Initialize Financial Advisor application
document.addEventListener('DOMContentLoaded', function() {
    initializeFA();
});

async function initializeFA() {
    setupThemeToggle();
    await loadClientSegments();
    await loadEmails();
    await loadFAAnalytics();
    setupSearch();
    setupKeyboardShortcuts();
    renderWealthSegments();
    updateUI();
    showWelcomeMessage();
}

// Theme Management
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('fa-theme') || 'light';
    
    darkMode = savedTheme === 'dark';
    applyTheme();
    
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    darkMode = !darkMode;
    applyTheme();
    localStorage.setItem('fa-theme', darkMode ? 'dark' : 'light');
}

function applyTheme() {
    const html = document.documentElement;
    const themeIcon = document.querySelector('#theme-toggle i');
    
    if (darkMode) {
        html.classList.add('dark');
        themeIcon.className = 'fas fa-sun';
    } else {
        html.classList.remove('dark');
        themeIcon.className = 'fas fa-moon';
    }
}

// Data Loading Functions
async function loadClientSegments() {
    try {
        const response = await fetch('/api/clients/segments');
        clientSegments = await response.json();
    } catch (error) {
        console.error('Error loading client segments:', error);
        showNotification('Failed to load client segments', 'error');
    }
}

async function loadEmails() {
    try {
        const response = await fetch('/api/emails');
        emails = await response.json();
        renderEmailList();
        updateCounts();
    } catch (error) {
        console.error('Error loading client emails:', error);
        showNotification('Failed to load client communications', 'error');
    }
}

async function loadFAAnalytics() {
    try {
        const response = await fetch('/api/analytics/fa-dashboard');
        analytics = await response.json();
        updateFADashboard();
    } catch (error) {
        console.error('Error loading FA analytics:', error);
    }
}

// Wealth Segments Rendering
function renderWealthSegments() {
    const segmentsContainer = document.getElementById('wealth-segments');
    if (!segmentsContainer) return;
    
    segmentsContainer.innerHTML = '';
    
    clientSegments.forEach(segment => {
        const segmentItem = document.createElement('div');
        segmentItem.className = 'flex items-center justify-between px-2 py-1 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded';
        segmentItem.dataset.segmentId = segment.id;
        
        segmentItem.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-folder mr-1 text-gray-500" style="font-size: 11px;"></i>
                <span class="truncate">${segment.name}</span>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400">${getSegmentClientCount(segment.id)}</span>
        `;
        
        segmentItem.addEventListener('click', () => filterBySegment(segment));
        segmentsContainer.appendChild(segmentItem);
    });
}

function getSegmentClientCount(segmentId) {
    // Mock client counts per segment
    const counts = { 1: 3, 2: 8, 3: 12, 4: 15, 5: 6, 6: 3, 7: 4, 8: 2, 9: 7, 10: 1 };
    return counts[segmentId] || 0;
}

// Email List Rendering
function renderEmailList(filteredEmails = null) {
    const emailList = document.getElementById('email-list');
    const emailsToRender = filteredEmails || emails;
    emailList.innerHTML = '';

    if (emailsToRender.length === 0) {
        emailList.innerHTML = `
            <div class="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                <div class="text-center">
                    <i class="fas fa-inbox text-2xl mb-2"></i>
                    <p>No client communications found</p>
                </div>
            </div>
        `;
        return;
    }

    emailsToRender.forEach(email => {
        const emailItem = createClientEmailItem(email);
        emailList.appendChild(emailItem);
    });
}

function createClientEmailItem(email) {
    const div = document.createElement('div');
    div.className = `client-email-item ${!email.isRead ? 'unread' : ''}`;
    div.dataset.emailId = email.id;
    
    div.innerHTML = `
        <div class="px-3 py-2">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2 flex-1 min-w-0">
                    ${email.isImportant ? '<i class="fas fa-exclamation text-red-600 text-xs mr-1"></i>' : ''}
                    ${!email.isRead ? '<div class="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>' : '<div class="w-2 h-2 mr-2"></div>'}
                    <span class="text-sm text-gray-900 dark:text-gray-100 truncate ${!email.isRead ? 'font-semibold' : ''}">${email.clientName || email.from}</span>
                    ${email.needsReply ? '<i class="fas fa-reply text-blue-600 text-xs ml-1" title="Reply required"></i>' : ''}
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-400 ml-2">${email.time}</div>
            </div>
            <div class="mt-1">
                <div class="text-sm text-gray-900 dark:text-gray-100 ${!email.isRead ? 'font-semibold' : ''} truncate">${email.subject}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">${email.preview}</div>
            </div>
            ${email.clientSegment ? `
                <div class="mt-1">
                    <span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">${email.clientSegment.name}</span>
                </div>
            ` : ''}
        </div>
    `;

    div.addEventListener('click', () => selectClientEmail(email.id));
    return div;
}

// Email Selection and Preview
async function selectClientEmail(emailId) {
    try {
        // Update UI selection - Outlook style
        document.querySelectorAll('.client-email-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        const selectedItem = document.querySelector(`[data-email-id="${emailId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }

        // Fetch email details
        const response = await fetch(`/api/emails/${emailId}`);
        const email = await response.json();
        
        // Mark as read
        if (!email.isRead) {
            email.isRead = true;
            const emailIndex = emails.findIndex(e => e.id === emailId);
            if (emailIndex !== -1) {
                emails[emailIndex].isRead = true;
            }
            renderEmailList();
            updateCounts();
        }

        selectedEmailId = emailId;
        await renderClientEmailPreview(email);
        
    } catch (error) {
        console.error('Error selecting client email:', error);
        showNotification('Failed to load client communication', 'error');
    }
}

async function renderClientEmailPreview(email) {
    const previewPane = document.getElementById('email-preview');
    
    previewPane.className = 'flex-1 bg-white dark:bg-gray-800 flex flex-col border-l border-gray-300 dark:border-gray-600 reading-pane';
    
    // Show Client Insights panel if email has client profile
    if (email.clientProfile) {
        showClientInsights(email);
    } else {
        hideClientInsights();
    }
    
    previewPane.innerHTML = `
        <!-- Outlook-style Email Header -->
        <div class="px-4 py-3 border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
            <div class="flex items-center justify-between mb-2">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">${email.subject}</h2>
                <div class="flex items-center space-x-1">
                    ${email.isImportant ? '<i class="fas fa-exclamation text-red-600 text-sm"></i>' : ''}
                    <button onclick="personalizeResponse()" class="outlook-button text-xs" title="AI Personalization">
                        <i class="fas fa-robot"></i> AI
                    </button>
                    <button class="outlook-button text-xs" onclick="replyToEmail()" title="Reply">
                        <i class="fas fa-reply"></i>
                    </button>
                    <button class="outlook-button text-xs" title="Reply All">
                        <i class="fas fa-reply-all"></i>
                    </button>
                    <button class="outlook-button text-xs" title="Forward">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="outlook-button text-xs" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="flex items-center space-x-3 text-sm">
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-semibold">${email.clientName ? email.clientName.split(' ').map(n => n[0]).join('') : email.from.charAt(0).toUpperCase()}</span>
                </div>
                <div class="flex-1">
                    <div class="font-medium text-gray-900 dark:text-gray-100">${email.clientName || email.from}</div>
                    <div class="text-gray-600 dark:text-gray-400 text-xs">
                        <span>${email.date} ${email.time}</span>
                        ${email.clientSegment ? `• ${email.clientSegment.name}` : ''}
                        ${email.needsReply ? ' • <span class="text-red-600">Reply Required</span>' : ''}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Email Body -->
        <div class="flex-1 p-4 overflow-y-auto bg-white dark:bg-gray-800">
            <div class="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                ${formatOutlookEmailBody(email.body)}
            </div>
        </div>
        
        <!-- Client Insights Footer -->
        ${email.clientSegment ? `
        <div class="border-t border-gray-300 dark:border-gray-600 p-3 bg-gray-50 dark:bg-gray-700">
            <div class="text-xs text-gray-600 dark:text-gray-400">
                <span class="font-medium">Client Segment:</span> ${email.clientSegment.name} (${email.clientSegment.range})
                <span class="mx-2">•</span>
                <span class="font-medium">Tone:</span> ${email.clientSegment.emailTone}
                ${email.marketContext ? ` • <span class="font-medium">Context:</span> ${email.marketContext}` : ''}
            </div>
        </div>
        ` : ''}
    `;
}

// Utility Functions
function formatOutlookEmailBody(body) {
    return body
        .split('\n')
        .map(line => {
            line = line.trim();
            if (line === '') return '<br>';
            if (line.match(/^\d+\./)) { // Numbered lists
                return `<div class="mb-1">${line}</div>`;
            }
            if (line.startsWith('•') || line.startsWith('-')) { // Bullet points
                return `<div class="ml-4 mb-1">${line}</div>`;
            }
            if (line.includes(':') && line.length < 60 && !line.includes('@')) { // Headers
                return `<div class="font-medium mb-2 mt-3">${line}</div>`;
            }
            return `<div class="mb-2">${line}</div>`;
        })
        .join('');
}

function updateCounts() {
    const unreadCount = emails.filter(email => !email.isRead).length;
    const replyCount = emails.filter(email => email.needsReply).length;
    
    // Update both navigation and main inbox counters
    const inboxCountNav = document.getElementById('inbox-count-nav');
    const inboxCountMain = document.getElementById('inbox-count-main');
    const needsReplyElement = document.getElementById('needs-reply');
    
    if (inboxCountNav) inboxCountNav.textContent = unreadCount;
    if (inboxCountMain) inboxCountMain.textContent = unreadCount;
    if (needsReplyElement) needsReplyElement.textContent = replyCount;
}

function updateFADashboard() {
    if (!analytics) return;
    
    const elements = {
        'total-clients': analytics.totalClients,
        'needs-reply': analytics.needsReplyCount
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

// Financial Advisor Specific Functions
function personalizeResponse() {
    showNotification('AI analyzing client segment and market context for personalized response...', 'info');
    // In real implementation, this would call AI API for personalization
}

function replyToEmail() {
    showNotification('Opening personalized reply composer...', 'info');
    // In real implementation, this would open Outlook-style compose window
}

function filterBySegment(segment) {
    showNotification(`Filtering communications for ${segment.name} clients...`, 'info');
    // In real implementation, this would filter emails by client segment
}

// Search and Navigation
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    if (!query) {
        renderEmailList();
        return;
    }
    
    const filteredEmails = emails.filter(email => 
        email.subject.toLowerCase().includes(query) ||
        (email.clientName && email.clientName.toLowerCase().includes(query)) ||
        email.preview.toLowerCase().includes(query) ||
        email.body.toLowerCase().includes(query) ||
        (email.clientSegment && email.clientSegment.name.toLowerCase().includes(query)) ||
        (email.marketContext && email.marketContext.toLowerCase().includes(query))
    );
    
    renderEmailList(filteredEmails);
}

function goBack() {
    selectedEmailId = null;
    document.querySelectorAll('.client-email-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Hide Client Insights panel
    hideClientInsights();
    
    const previewPane = document.getElementById('email-preview');
    previewPane.innerHTML = `
        <div class="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div class="text-center">
                <div class="mb-6">
                    <i class="fas fa-handshake text-6xl text-blue-600 opacity-50"></i>
                </div>
                <h3 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Financial Advisor Email Center</h3>
                <p class="text-lg mb-4">Select a client communication to view personalized insights</p>
                <div class="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <p>• AI-powered personalization for 10 wealth segments</p>
                    <p>• Compliance-ready communication templates</p>
                    <p>• Market context and client insights</p>
                </div>
            </div>
        </div>
    `;
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            goBack();
        }
        
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('search-input').focus();
        }
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            navigateEmails(e.key === 'ArrowDown' ? 1 : -1);
        }
    });
}

function navigateEmails(direction) {
    const emailItems = document.querySelectorAll('.client-email-item');
    let currentIndex = -1;
    
    if (selectedEmailId) {
        emailItems.forEach((item, index) => {
            if (item.dataset.emailId == selectedEmailId) {
                currentIndex = index;
            }
        });
    }
    
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < emailItems.length) {
        const newEmailId = emailItems[newIndex].dataset.emailId;
        selectClientEmail(parseInt(newEmailId));
    }
}

// Client Insights Panel Functions
function showClientInsights(email) {
    const insightsPanel = document.getElementById('client-insights-panel');
    const insightsContent = document.getElementById('client-insights-content');
    
    if (!insightsPanel || !email.clientProfile) return;
    
    insightsPanel.classList.remove('hidden');
    renderClientInsightsContent(email.clientProfile, email.clientSegment, email.householdProfile);
}

function hideClientInsights() {
    const insightsPanel = document.getElementById('client-insights-panel');
    if (insightsPanel) {
        insightsPanel.classList.add('hidden');
    }
}

function toggleClientInsights() {
    const insightsPanel = document.getElementById('client-insights-panel');
    if (insightsPanel) {
        insightsPanel.classList.toggle('hidden');
    }
}

function renderClientInsightsContent(clientProfile, clientSegment, householdProfile = null) {
    const insightsContent = document.getElementById('client-insights-content');
    if (!insightsContent) return;
    
    insightsContent.innerHTML = `
        <!-- Client Profile Card -->
        <div class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6 mb-4">
            <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <i class="fas fa-user-circle mr-2 text-blue-600"></i>
                Client Profile
            </h4>
            
            <!-- Profile Avatar and Name -->
            <div class="flex items-center space-x-4 mb-6">
                <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-xl font-semibold">${getInitials(clientProfile.fullName)}</span>
                </div>
                <div>
                    <h5 class="text-lg font-semibold text-gray-900 dark:text-gray-100">${clientProfile.fullName}</h5>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${clientSegment.name}</p>
                </div>
            </div>
            
            <!-- Client Details Grid -->
            <div class="space-y-4">
                <div class="grid grid-cols-1 gap-4">
                    <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Name</span>
                        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">${clientProfile.fullName}</span>
                    </div>
                    
                    <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Age</span>
                        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">${clientProfile.age} years old</span>
                    </div>
                    
                    <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Occupation</span>
                        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">${clientProfile.occupation}</span>
                    </div>
                    
                    <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Company</span>
                        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">${clientProfile.company}</span>
                    </div>
                    
                    <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Client Since</span>
                        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">${clientProfile.clientSince}</span>
                    </div>
                    
                    <div class="flex justify-between items-center py-2">
                        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Profile</span>
                        <span class="text-sm font-semibold text-${getRiskProfileColor(clientProfile.riskProfile)}-600 bg-${getRiskProfileColor(clientProfile.riskProfile)}-100 dark:bg-${getRiskProfileColor(clientProfile.riskProfile)}-900 px-2 py-1 rounded-full">
                            ${clientProfile.riskProfile}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        ${householdProfile ? `
        <!-- Household Profile Card -->
        <div class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
            <h4 class="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <i class="fas fa-home mr-2 text-green-600"></i>
                Household Profile
            </h4>
            
            <!-- Household Summary -->
            <div class="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-600 rounded-lg mb-4">
                <div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Members</span>
                    <p class="text-lg font-bold text-gray-900 dark:text-gray-100">${householdProfile.totalMembers}</p>
                </div>
                <div class="text-right">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Assets</span>
                    <p class="text-lg font-bold text-green-600 dark:text-green-400">${householdProfile.householdAssets}</p>
                </div>
            </div>
            
            <!-- Household Members -->
            <div class="space-y-3">
                ${householdProfile.members.map((member, index) => `
                    <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 bg-${getHouseholdMemberColor(member.role)} rounded-full flex items-center justify-center">
                                    <span class="text-white text-sm font-semibold">${getInitials(member.name)}</span>
                                </div>
                                <div>
                                    <h6 class="font-semibold text-gray-900 dark:text-gray-100">${member.name}</h6>
                                    <p class="text-xs text-gray-600 dark:text-gray-400">${member.relation}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">${member.assets}</p>
                                <p class="text-xs text-gray-600 dark:text-gray-400">${member.role}</p>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="text-gray-500 dark:text-gray-400">Age:</span>
                                <span class="font-medium text-gray-900 dark:text-gray-100 ml-1">${member.age}</span>
                            </div>
                            <div>
                                <span class="text-gray-500 dark:text-gray-400">Occupation:</span>
                                <span class="font-medium text-gray-900 dark:text-gray-100 ml-1">${member.occupation}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    `;
}

// Helper functions for Client Insights
function getInitials(fullName) {
    return fullName.split(' ').map(name => name[0]).join('').toUpperCase();
}

function getRiskProfileColor(riskProfile) {
    const colors = {
        'Conservative': 'blue',
        'Moderate': 'yellow',
        'Aggressive': 'red'
    };
    return colors[riskProfile] || 'gray';
}

function getHouseholdMemberColor(role) {
    const colors = {
        'Primary Client': 'blue-600',
        'Spouse': 'purple-600',
        'Beneficiary': 'green-600',
        'Dependent': 'orange-600'
    };
    return colors[role] || 'gray-600';
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };
    
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function showWelcomeMessage() {
    setTimeout(() => {
        showNotification('🎯 Financial Advisor Platform Ready! Client Profile & Household Insights Available.', 'success');
    }, 1000);
}

function updateUI() {
    updateCounts();
    updateFADashboard();
    renderWealthSegments();
}