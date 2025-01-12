// Main Application Class
class MyFuelApp {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('user')) || null;
        this.init();
        this.setupEventListeners();
        this.setupSidebar();
    }

    async init() {
        try {
            await this.checkAuth();
            this.setupEventListeners();
        } catch (error) {
            console.error('Initialization error:', error);
            window.location.href = '/login.html';
        }
    }

    async checkAuth() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await fetch('/api/auth/check', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Auth check failed');
            }

            const data = await response.json();
            if (data.authenticated) {
                this.currentUser = data.user;
                this.updateUI();
            } else {
                throw new Error('Not authenticated');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        }
    }

    setupEventListeners() {
        // Navigation Events
        document.querySelectorAll('[data-nav]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(e.target.dataset.nav);
            });
        });
    }

    setupSidebar() {
        // Toggle sidebar on mobile
        document.getElementById('sidebarCollapseShow')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.add('active');
        });

        document.getElementById('sidebarCollapse')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const sidebarButton = document.getElementById('sidebarCollapseShow');
            
            if (window.innerWidth <= 768 && 
                sidebar && 
                !sidebar.contains(e.target) && 
                !sidebarButton.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }

    updateUI() {
        console.log('Current User:', this.currentUser);
        console.log('Current User:', this.currentUser);
        // Navigation items for different roles
        const navItems = {
            CLIENT_ADMIN: [
                { path: 'dashboard', name: 'Dashboard', icon: 'bi-speedometer2' },
                { path: 'sites', name: 'Sites', icon: 'bi-geo-alt' },
                { path: 'vehicles', name: 'Vehicles', icon: 'bi-truck' },
                { path: 'drivers', name: 'Drivers', icon: 'bi-person' },
                { path: 'reports', name: 'Reports', icon: 'bi-file-earmark-text' },
                { path: 'profile', name: 'Profile', icon: 'bi-person-circle' }
            ],
            DRIVER: [
                { path: 'dashboard', name: 'Dashboard', icon: 'bi-speedometer2' },
                { path: 'profile', name: 'Profile', icon: 'bi-person-circle' }
            ]
        };

        // Generate navigation items
        const navItemsContainer = document.getElementById('nav-items');
        if (navItemsContainer && this.currentUser) {
            const items = navItems[this.currentUser.role] || [];
            let navHtml = items.map(item => `
                <li class="nav-item">
                    <a class="nav-link" href="#" data-page="${item.path}">
                        <i class="bi ${item.icon}"></i>
                        <span>${item.name}</span>
                    </a>
                </li>
            `).join('');

            // Add Messages menu item for all users
            navHtml += `
                <li class="nav-item">
                    <a class="nav-link" href="#" data-page="messages">
                        <i class="bi bi-chat-dots"></i>
                        <span>Messages</span>
                    </a>
                </li>
            `;

            // Add Logout at the bottom
            navHtml += `
                <li class="nav-item mt-auto">
                    <a class="nav-link text-danger" href="#" id="logout">
                        <i class="bi bi-box-arrow-right"></i>
                        <span>Logout</span>
                    </a>
                </li>
            `;

            navItemsContainer.innerHTML = navHtml;

            // Setup click handlers for navigation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = e.currentTarget.dataset.page;
                    if (page) {
                        this.loadPage(page);
                    } else if (e.currentTarget.id === 'logout') {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login.html';
                    }
                });
            });

            // Load default page
            this.loadPage('dashboard');
        }
    }

    async navigateTo(page) {
        try {
            // Show loading state
            document.getElementById('main-content').innerHTML = `
                <div class="d-flex justify-content-center align-items-center" style="height: 400px;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            `;

            const response = await fetch(`/api/pages/${page}`);
            if (!response.ok) throw new Error(`Failed to load ${page}`);
            
            const data = await response.json();
            document.getElementById('main-content').innerHTML = data.html;
            
            // Update active nav item
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.dataset.page === page) {
                    link.classList.add('active');
                }
            });

            // Setup page-specific features
            this.loadPage(page);
        } catch (error) {
            console.error('Navigation failed:', error);
            document.getElementById('main-content').innerHTML = `
                <div class="alert alert-danger m-4" role="alert">
                    Failed to load content. Please try again.
                </div>
            `;
        }
    }

    async loadPage(page) {
        try {
            const response = await fetch(`/api/pages/${page}`);
            if (!response.ok) throw new Error('Failed to load page');
            
            const data = await response.json();
            
            // Update content and navigation
            document.getElementById('main-content').innerHTML = data.html;
            document.querySelectorAll('.nav-link').forEach(link => {
                if (link.dataset.page === page) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Initialize page-specific functionality
            if (page === 'sites') {
                window.sitesManager = new SitesManager();
            }

            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar')?.classList.remove('active');
            }

            // Load default page if none specified
            if (!page) {
                this.loadPage('dashboard');
            }
        } catch (error) {
            console.error('Error loading page:', error);
            // Show error message to user
            document.getElementById('main-content').innerHTML = `
                <div class="alert alert-danger m-3">
                    Failed to load page. Please try again.
                </div>
            `;
        }
    }

    initializeDashboardCharts() {
        console.log('Initializing dashboard charts...');
        const canvas = document.getElementById('fuel-consumption-chart');
        if (!canvas) {
            console.error('Canvas element not found');
            return;
        }

        try {
            console.log('Creating fuel consumption chart...');
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Diesel Consumption (L)',
                        data: [350, 420, 380, 450, 400, 480],
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Petrol Consumption (L)',
                        data: [280, 310, 290, 340, 320, 360],
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.parsed.y + 'L';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Liters'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Month'
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });
            console.log('Chart created successfully');
        } catch (error) {
            console.error('Error creating chart:', error);
        }
    }
}

// Initialize the application
window.app = new MyFuelApp();
