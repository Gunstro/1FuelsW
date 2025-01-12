const express = require('express');
const router = express.Router();

// Common wrapper for all pages
const wrapContent = (content) => `
    <div class="gradient-background">
        <style>
            .gradient-background {
                min-height: 100vh;
                background: linear-gradient(-45deg, #0a2463, #247ba0, #1b998b, #2d936c);
                background-size: 400% 400%;
                animation: gradient 15s ease infinite;
            }
            @keyframes gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        </style>
        ${content}
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <script src="/js/utilities.js"></script>
        <script src="/js/messages.js"></script>
        <script src="/js/sites.js"></script>
        <script src="/js/vehicles.js"></script>
    </div>
`;

// Dashboard page content
router.get('/dashboard', (req, res) => {
    const dashboardHtml = wrapContent(`
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-xl-3 col-sm-6 mb-4">
                    <div class="card">
                        <div class="card-body p-3">
                            <div class="row">
                                <div class="col-8">
                                    <div class="numbers">
                                        <p class="text-sm mb-0 text-uppercase font-weight-bold">Total Vehicles</p>
                                        <h5 class="font-weight-bolder mb-0">12</h5>
                                    </div>
                                </div>
                                <div class="col-4 text-end">
                                    <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                                        <i class="bi bi-truck text-lg opacity-10" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-sm-6 mb-4">
                    <div class="card">
                        <div class="card-body p-3">
                            <div class="row">
                                <div class="col-8">
                                    <div class="numbers">
                                        <p class="text-sm mb-0 text-uppercase font-weight-bold">Total Fuel (L)</p>
                                        <h5 class="font-weight-bolder mb-0">2,300</h5>
                                    </div>
                                </div>
                                <div class="col-4 text-end">
                                    <div class="icon icon-shape bg-gradient-success shadow text-center border-radius-md">
                                        <i class="bi bi-fuel-pump text-lg opacity-10" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-sm-6 mb-4">
                    <div class="card">
                        <div class="card-body p-3">
                            <div class="row">
                                <div class="col-8">
                                    <div class="numbers">
                                        <p class="text-sm mb-0 text-uppercase font-weight-bold">CO2 Emissions</p>
                                        <h5 class="font-weight-bolder mb-0">6,072 kg</h5>
                                    </div>
                                </div>
                                <div class="col-4 text-end">
                                    <div class="icon icon-shape bg-gradient-warning shadow text-center border-radius-md">
                                        <i class="bi bi-cloud text-lg opacity-10" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-sm-6 mb-4">
                    <div class="card">
                        <div class="card-body p-3">
                            <div class="row">
                                <div class="col-8">
                                    <div class="numbers">
                                        <p class="text-sm mb-0 text-uppercase font-weight-bold">Active Drivers</p>
                                        <h5 class="font-weight-bolder mb-0">8</h5>
                                    </div>
                                </div>
                                <div class="col-4 text-end">
                                    <div class="icon icon-shape bg-gradient-info shadow text-center border-radius-md">
                                        <i class="bi bi-person text-lg opacity-10" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-lg-7 mb-4">
                    <div class="card">
                        <div class="card-header pb-0">
                            <h6>Fuel Consumption Overview</h6>
                            <p class="text-sm mb-0">
                                <span class="font-weight-bold">Total Consumption:</span> 2,480L
                                <span class="ms-3 font-weight-bold">Avg. Daily:</span> 82.7L
                            </p>
                        </div>
                        <div class="card-body p-3">
                            <div class="chart" style="height: 300px; position: relative;">
                                <canvas id="fuel-consumption-chart" width="400" height="300"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-5 mb-4">
                    <div class="card">
                        <div class="card-header pb-0">
                            <h6>Recent Activities</h6>
                        </div>
                        <div class="card-body p-3">
                            <div class="timeline timeline-one-side">
                                <div class="timeline-block mb-3">
                                    <span class="timeline-step">
                                        <i class="bi bi-fuel-pump text-success"></i>
                                    </span>
                                    <div class="timeline-content">
                                        <h6 class="text-dark text-sm font-weight-bold mb-0">Vehicle XYZ123 Refueled</h6>
                                        <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">22 L Added</p>
                                    </div>
                                </div>
                                <div class="timeline-block mb-3">
                                    <span class="timeline-step">
                                        <i class="bi bi-truck text-danger"></i>
                                    </span>
                                    <div class="timeline-content">
                                        <h6 class="text-dark text-sm font-weight-bold mb-0">New Vehicle Added</h6>
                                        <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">Toyota Hilux</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
        <script>
            console.log('Script starting...');
            
            function initializeChart() {
                console.log('Initializing chart...');
                const canvas = document.getElementById('fuel-consumption-chart');
                console.log('Canvas element:', canvas);
                
                if (!canvas) {
                    console.error('Canvas element not found');
                    return;
                }

                console.log('Chart object:', typeof Chart);
                if (typeof Chart === 'undefined') {
                    console.error('Chart.js not loaded');
                    return;
                }

                try {
                    const ctx = canvas.getContext('2d');
                    console.log('Canvas context:', ctx);
                    
                    if (!ctx) {
                        console.error('Could not get 2d context');
                        return;
                    }

                    console.log('Creating new chart...');
                    const chart = new Chart(ctx, {
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
                    console.log('Chart created successfully:', chart);
                } catch (error) {
                    console.error('Error initializing chart:', error);
                }
            }

            // Try both immediate and DOMContentLoaded initialization
            console.log('Setting up initialization...');
            initializeChart();
            document.addEventListener('DOMContentLoaded', initializeChart);
        </script>
    `);
    res.json({ html: dashboardHtml });
});

// Messages page content
router.get('/messages', (req, res) => {
    const messagesHtml = wrapContent(`
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-12">
                    <div class="card mb-4">
                        <div class="card-header pb-0">
                            <h6>Messages</h6>
                        </div>
                        <div class="card-body">
                            <div class="messages-container">
                                <div class="message">
                                    <div class="message-header">
                                        <strong>System Alert</strong>
                                        <span class="text-muted">2 hours ago</span>
                                    </div>
                                    <div class="message-body">
                                        Tank level low at Site A - Tank 1
                                    </div>
                                </div>
                                <div class="message">
                                    <div class="message-header">
                                        <strong>Maintenance Update</strong>
                                        <span class="text-muted">5 hours ago</span>
                                    </div>
                                    <div class="message-body">
                                        Scheduled maintenance completed for Vehicle XYZ-123
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
    res.json({ html: messagesHtml });
});

// Profile page content
router.get('/profile', (req, res) => {
    const profileHtml = wrapContent(`
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-12">
                    <div class="card mb-4">
                        <div class="card-header pb-0">
                            <h6>Profile Settings</h6>
                        </div>
                        <div class="card-body">
                            <form id="profileForm">
                                <div class="mb-3">
                                    <label for="fullName" class="form-label">Full Name</label>
                                    <input type="text" class="form-control" id="fullName" value="John Doe">
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="email" value="john@example.com">
                                </div>
                                <div class="mb-3">
                                    <label for="phone" class="form-label">Phone</label>
                                    <input type="tel" class="form-control" id="phone" value="+1234567890">
                                </div>
                                <div class="mb-3">
                                    <label for="company" class="form-label">Company</label>
                                    <input type="text" class="form-control" id="company" value="ABC Corp">
                                </div>
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
    res.json({ html: profileHtml });
});

// Vehicles page content
router.get('/vehicles', (req, res) => {
    const vehiclesHtml = wrapContent(`
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-12">
                    <div class="card mb-4">
                        <div class="card-header pb-0 d-flex justify-content-between align-items-center">
                            <h6>Vehicles Management</h6>
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addVehicleModal">
                                <i class="bi bi-plus-circle"></i> Add Vehicle
                            </button>
                        </div>
                        <div class="card-body px-0 pt-0 pb-2">
                            <div class="table-responsive p-0">
                                <table class="table align-items-center mb-0">
                                    <thead>
                                        <tr>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Vehicle</th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Site</th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Status</th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Last Maintenance</th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Odometer</th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">L/100Km</th>
                                            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="vehiclesTableBody">
                                        <!-- Vehicle rows will be inserted here by JavaScript -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Vehicle Modal -->
        <div class="modal fade" id="addVehicleModal" tabindex="-1" aria-labelledby="addVehicleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addVehicleModalLabel">Add New Vehicle</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addVehicleForm">
                            <div class="mb-3">
                                <label for="vehicleName" class="form-label">Vehicle Name/ID</label>
                                <input type="text" class="form-control" id="vehicleName" required>
                            </div>
                            <div class="mb-3">
                                <label for="vehicleType" class="form-label">Vehicle Type</label>
                                <select class="form-select" id="vehicleType" required>
                                    <option value="">Select type...</option>
                                    <option value="truck">Truck</option>
                                    <option value="van">Van</option>
                                    <option value="car">Car</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="vehicleSite" class="form-label">Assigned Site</label>
                                <select class="form-select" id="vehicleSite">
                                    <option value="">Select site...</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="vehicleLicense" class="form-label">License Plate</label>
                                <input type="text" class="form-control" id="vehicleLicense" required>
                            </div>
                            <div class="mb-3">
                                <label for="vehicleOdometer" class="form-label">Current Odometer Reading</label>
                                <input type="number" class="form-control" id="vehicleOdometer" required>
                            </div>
                            <div class="mb-3">
                                <label for="vehicleFuelEfficiency" class="form-label">Fuel Efficiency (L/100km)</label>
                                <input type="number" step="0.1" class="form-control" id="vehicleFuelEfficiency">
                            </div>
                            <div class="mb-3">
                                <label for="vehicleLastMaintenance" class="form-label">Last Maintenance Date</label>
                                <input type="date" class="form-control" id="vehicleLastMaintenance">
                            </div>
                            <div class="mb-3">
                                <label for="vehicleNotes" class="form-label">Notes</label>
                                <textarea class="form-control" id="vehicleNotes" rows="3"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveVehicle">Save Vehicle</button>
                    </div>
                </div>
            </div>
        </div>

        <script>
            console.log('Vehicles page loaded');
            // Initialize tooltips
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl)
            });

            // Initialize vehicles manager
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOM loaded in vehicles page');
                if (document.getElementById('vehiclesTableBody')) {
                    console.log('Found vehicles table, initializing manager');
                    window.vehiclesManager = new VehiclesManager();
                } else {
                    console.error('Could not find vehicles table!');
                }
            });
        </script>
    `);
    res.json({ html: vehiclesHtml });
});

// Drivers page content
router.get('/drivers', (req, res) => {
    const driversHtml = wrapContent(`
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-12">
                    <div class="card mb-4">
                        <div class="card-header pb-0 d-flex justify-content-between align-items-center">
                            <h6>Drivers List</h6>
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addDriverModal">
                                <i class="bi bi-plus"></i> Add Driver
                            </button>
                        </div>
                        <div class="card-body px-0 pt-0 pb-2">
                            <div class="table-responsive p-0">
                                <table class="table align-items-center mb-0">
                                    <thead>
                                        <tr>
                                            <th>Driver ID</th>
                                            <th>Name</th>
                                            <th>License</th>
                                            <th>PDP Expiry</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>DR001</td>
                                            <td>John Doe</td>
                                            <td>ABC123456</td>
                                            <td>2024-06-30</td>
                                            <td><span class="badge bg-success">Active</span></td>
                                            <td>
                                                <button class="btn btn-primary btn-sm">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button class="btn btn-info btn-sm">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Driver Modal -->
        <div class="modal fade" id="addDriverModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Driver</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addDriverForm">
                            <div class="mb-3">
                                <label class="form-label" name="fullName">Full Name</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label" name="licenseNumber">License Number</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label" name="licenseExpiryDate">License Expiry Date</label>
                                <input type="date" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label" name="pdpNumber">PDP Number</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label" name="pdpExpiryDate">PDP Expiry Date</label>
                                <input type="date" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label" name="nextOfKin">Next of Kin</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label" name="nextOfKinContact">Next of Kin Contact</label>
                                <input type="tel" class="form-control" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Add Driver</button>
                    </div>
                </div>
            </div>
        </div>
    `);
    res.json({ html: driversHtml });
});

// Reports page content
router.get('/reports', (req, res) => {
    const reportsHtml = wrapContent(`
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-12 mb-4">
                    <div class="card">
                        <div class="card-header pb-0">
                            <h6>Generate Reports</h6>
                        </div>
                        <div class="card-body">
                            <form id="reportForm" class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label">Report Type</label>
                                    <select class="form-select" required>
                                        <option value="">Select Report Type</option>
                                        <option value="fuel">Fuel Consumption</option>
                                        <option value="emissions">Emissions Report</option>
                                        <option value="vehicle">Vehicle Usage</option>
                                        <option value="driver">Driver Performance</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Date Range</label>
                                    <select class="form-select" required>
                                        <option value="today">Today</option>
                                        <option value="week">This Week</option>
                                        <option value="month">This Month</option>
                                        <option value="custom">Custom Range</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Format</label>
                                    <select class="form-select" required>
                                        <option value="pdf">PDF</option>
                                        <option value="excel">Excel</option>
                                        <option value="csv">CSV</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <button type="submit" class="btn btn-primary">Generate Report</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="card-header pb-0">
                            <h6>Recent Reports</h6>
                        </div>
                        <div class="card-body px-0 pt-0 pb-2">
                            <div class="table-responsive p-0">
                                <table class="table align-items-center mb-0">
                                    <thead>
                                        <tr>
                                            <th>Report Name</th>
                                            <th>Generated Date</th>
                                            <th>Type</th>
                                            <th>Format</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Monthly Fuel Report</td>
                                            <td>2024-01-01</td>
                                            <td>Fuel Consumption</td>
                                            <td>PDF</td>
                                            <td>
                                                <button class="btn btn-info btn-sm">
                                                    <i class="bi bi-download"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
    res.json({ html: reportsHtml });
});

// Super Admin - Commission Management
router.get('/commissions', (req, res) => {
    const commissionsHtml = wrapContent(`
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-12">
                    <div class="card mb-4">
                        <div class="card-header pb-0 d-flex justify-content-between align-items-center">
                            <h6>Commission Management</h6>
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addCommissionModal">
                                <i class="bi bi-plus"></i> Set New Commission Rate
                            </button>
                        </div>
                        <div class="card-body px-0 pt-0 pb-2">
                            <div class="table-responsive p-0">
                                <table class="table align-items-center mb-0">
                                    <thead>
                                        <tr>
                                            <th>Package Name</th>
                                            <th>Base Rate (%)</th>
                                            <th>Reseller Split (%)</th>
                                            <th>Multi-Reseller Split</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Basic Package</td>
                                            <td>15%</td>
                                            <td>60/40</td>
                                            <td>Equal Split</td>
                                            <td>
                                                <button class="btn btn-primary btn-sm">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Premium Package</td>
                                            <td>20%</td>
                                            <td>70/30</td>
                                            <td>Lead/Support Split</td>
                                            <td>
                                                <button class="btn btn-primary btn-sm">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Commission Modal -->
            <div class="modal fade" id="addCommissionModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Set Commission Rate</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="commissionForm">
                                <div class="mb-3">
                                    <label class="form-label">Package Name</label>
                                    <select class="form-select" name="packageName" required>
                                        <option value="">Select Package</option>
                                        <option value="basic">Basic Package</option>
                                        <option value="premium">Premium Package</option>
                                        <option value="enterprise">Enterprise Package</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Base Commission Rate (%)</label>
                                    <input type="number" class="form-control" name="baseCommissionRate" min="0" max="100" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Reseller Split</label>
                                    <div class="input-group">
                                        <input type="number" class="form-control" name="primaryResellerSplit" placeholder="Primary %" min="0" max="100">
                                        <span class="input-group-text">/</span>
                                        <input type="number" class="form-control" name="secondaryResellerSplit" placeholder="Secondary %" min="0" max="100">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Multi-Reseller Split Type</label>
                                    <select class="form-select" name="multiResellerSplitType" required>
                                        <option value="equal">Equal Split</option>
                                        <option value="lead">Lead/Support Split</option>
                                        <option value="custom">Custom Split</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="submitCommissionForm()">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
    `);
    res.json({ html: commissionsHtml });
});

// Super Admin - Product Packages
router.get('/products', (req, res) => {
    const productsHtml = wrapContent(`
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-12">
                    <div class="card mb-4">
                        <div class="card-header pb-0 d-flex justify-content-between align-items-center">
                            <h6>Product Packages</h6>
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addProductModal">
                                <i class="bi bi-plus"></i> Add Package
                            </button>
                        </div>
                        <div class="card-body px-0 pt-0 pb-2">
                            <div class="table-responsive p-0">
                                <table class="table align-items-center mb-0">
                                    <thead>
                                        <tr>
                                            <th>Package Name</th>
                                            <th>Features</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Basic Package</td>
                                            <td>
                                                <ul class="list-unstyled mb-0">
                                                    <li>✓ Vehicle Management</li>
                                                    <li>✓ Basic Reports</li>
                                                    <li>✓ QR Code Generation</li>
                                                </ul>
                                            </td>
                                            <td>$99/month</td>
                                            <td><span class="badge bg-success">Active</span></td>
                                            <td>
                                                <button class="btn btn-primary btn-sm">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button class="btn btn-danger btn-sm">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Product Modal -->
        <div class="modal fade" id="addProductModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add Product Package</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="productForm">
                            <div class="mb-3">
                                <label class="form-label">Package Name</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Price ($/month)</label>
                                <input type="number" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Features</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="vehicle_management">
                                    <label class="form-check-label">Vehicle Management</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="qr_codes">
                                    <label class="form-check-label">QR Code Generation</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="basic_reports">
                                    <label class="form-check-label">Basic Reports</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="advanced_reports">
                                    <label class="form-check-label">Advanced Reports</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="api_access">
                                    <label class="form-check-label">API Access</label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Add Package</button>
                    </div>
                </div>
            </div>
        </div>
    `);
    res.json({ html: productsHtml });
});

// Reseller - Prospects Management
router.get('/prospects', (req, res) => {
    const prospectsHtml = wrapContent(`
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-12">
                    <div class="card mb-4">
                        <div class="card-header pb-0 d-flex justify-content-between align-items-center">
                            <h6>Prospective Clients</h6>
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addProspectModal">
                                <i class="bi bi-plus"></i> Add Prospect
                            </button>
                        </div>
                        <div class="card-body px-0 pt-0 pb-2">
                            <div class="table-responsive p-0">
                                <table class="table align-items-center mb-0">
                                    <thead>
                                        <tr>
                                            <th>Company Name</th>
                                            <th>Contact Person</th>
                                            <th>Status</th>
                                            <th>Last Contact</th>
                                            <th>Next Follow-up</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>ABC Transport</td>
                                            <td>John Smith</td>
                                            <td><span class="badge bg-warning">In Discussion</span></td>
                                            <td>2024-01-05</td>
                                            <td>2024-01-15</td>
                                            <td>
                                                <button class="btn btn-primary btn-sm" onclick="addFollowUp('ABC Transport')">
                                                    <i class="bi bi-calendar-plus"></i>
                                                </button>
                                                <button class="btn btn-success btn-sm">
                                                    <i class="bi bi-check-circle"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Prospect Modal -->
        <div class="modal fade" id="addProspectModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Prospect</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="prospectForm">
                            <div class="mb-3">
                                <label class="form-label">Company Name</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Contact Person</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Phone</label>
                                <input type="tel" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Notes</label>
                                <textarea class="form-control" rows="3"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Next Follow-up Date</label>
                                <input type="date" class="form-control" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Add Prospect</button>
                    </div>
                </div>
            </div>
        </div>
    `);
    res.json({ html: prospectsHtml });
});

// Reseller - Performance Dashboard
router.get('/performance', (req, res) => {
    const performanceHtml = wrapContent(`
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-xl-3 col-sm-6 mb-4">
                    <div class="card">
                        <div class="card-body p-3">
                            <div class="row">
                                <div class="col-8">
                                    <div class="numbers">
                                        <p class="text-sm mb-0 text-uppercase font-weight-bold">Total Clients</p>
                                        <h5 class="font-weight-bolder mb-0">25</h5>
                                    </div>
                                </div>
                                <div class="col-4 text-end">
                                    <div class="icon icon-shape bg-gradient-primary shadow text-center">
                                        <i class="bi bi-people text-lg opacity-10"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-sm-6 mb-4">
                    <div class="card">
                        <div class="card-body p-3">
                            <div class="row">
                                <div class="col-8">
                                    <div class="numbers">
                                        <p class="text-sm mb-0 text-uppercase font-weight-bold">Active Prospects</p>
                                        <h5 class="font-weight-bolder mb-0">8</h5>
                                    </div>
                                </div>
                                <div class="col-4 text-end">
                                    <div class="icon icon-shape bg-gradient-success shadow text-center">
                                        <i class="bi bi-person-plus text-lg opacity-10"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-sm-6 mb-4">
                    <div class="card">
                        <div class="card-body p-3">
                            <div class="row">
                                <div class="col-8">
                                    <div class="numbers">
                                        <p class="text-sm mb-0 text-uppercase font-weight-bold">Monthly Revenue</p>
                                        <h5 class="font-weight-bolder mb-0">$12,500</h5>
                                    </div>
                                </div>
                                <div class="col-4 text-end">
                                    <div class="icon icon-shape bg-gradient-warning shadow text-center">
                                        <i class="bi bi-currency-dollar text-lg opacity-10"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-sm-6 mb-4">
                    <div class="card">
                        <div class="card-body p-3">
                            <div class="row">
                                <div class="col-8">
                                    <div class="numbers">
                                        <p class="text-sm mb-0 text-uppercase font-weight-bold">Conversion Rate</p>
                                        <h5 class="font-weight-bolder mb-0">35%</h5>
                                    </div>
                                </div>
                                <div class="col-4 text-end">
                                    <div class="icon icon-shape bg-gradient-info shadow text-center">
                                        <i class="bi bi-graph-up text-lg opacity-10"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-lg-7 mb-4">
                    <div class="card">
                        <div class="card-header pb-0">
                            <h6>Sales Performance</h6>
                        </div>
                        <div class="card-body p-3">
                            <div class="chart" style="height: 300px;">
                                <canvas id="sales-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5 mb-4">
                    <div class="card">
                        <div class="card-header pb-0">
                            <h6>Recent Activities</h6>
                        </div>
                        <div class="card-body p-3">
                            <div class="timeline timeline-one-side">
                                <div class="timeline-block mb-3">
                                    <span class="timeline-step">
                                        <i class="bi bi-person-check text-success"></i>
                                    </span>
                                    <div class="timeline-content">
                                        <h6 class="text-dark text-sm font-weight-bold mb-0">New Client Signed</h6>
                                        <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">XYZ Logistics</p>
                                    </div>
                                </div>
                                <div class="timeline-block mb-3">
                                    <span class="timeline-step">
                                        <i class="bi bi-calendar text-primary"></i>
                                    </span>
                                    <div class="timeline-content">
                                        <h6 class="text-dark text-sm font-weight-bold mb-0">Meeting Scheduled</h6>
                                        <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">ABC Transport</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
        <script>
            // Wait for DOM to be ready
            document.addEventListener('DOMContentLoaded', function() {
                // Make sure the canvas element exists
                const canvas = document.getElementById('sales-chart');
                if (!canvas) {
                    console.error('Canvas element not found');
                    return;
                }

                // Make sure Chart.js is loaded
                if (typeof Chart === 'undefined') {
                    console.error('Chart.js not loaded');
                    return;
                }

                try {
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        console.error('Could not get 2d context');
                        return;
                    }

                    // Initialize the chart
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                            datasets: [{
                                label: 'Monthly Sales ($)',
                                data: [8500, 9200, 10500, 11000, 12000, 12500],
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });
                } catch (error) {
                    console.error('Error initializing chart:', error);
                }
            });
        </script>
    `);
    res.json({ html: performanceHtml });
});

// Reseller - Clients Management
router.get('/clients', (req, res) => {
    const clientsHtml = wrapContent(`
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-12">
                    <div class="card mb-4">
                        <div class="card-header pb-0 d-flex justify-content-between align-items-center">
                            <h6>Clients List</h6>
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addClientModal">
                                <i class="bi bi-plus"></i> Add Client
                            </button>
                        </div>
                        <div class="card-body px-0 pt-0 pb-2">
                            <div class="table-responsive p-0">
                                <table class="table align-items-center mb-0">
                                    <thead>
                                        <tr>
                                            <th>Client ID</th>
                                            <th>Company Name</th>
                                            <th>Contact Person</th>
                                            <th>Email</th>
                                            <th>Status</th>
                                            <th>Total Vehicles</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>CL001</td>
                                            <td>Logistics Pro Inc</td>
                                            <td>Michael Brown</td>
                                            <td>michael@logisticspro.com</td>
                                            <td><span class="badge bg-success">Active</span></td>
                                            <td>5</td>
                                            <td>
                                                <button class="btn btn-info btn-sm" onclick="editClient('CL001')">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button class="btn btn-warning btn-sm" onclick="viewClientStats('CL001')">
                                                    <i class="bi bi-graph-up"></i>
                                                </button>
                                                <button class="btn btn-primary btn-sm" onclick="viewClientVehicles('CL001')">
                                                    <i class="bi bi-truck"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>CL002</td>
                                            <td>Fast Delivery Co</td>
                                            <td>Emma Wilson</td>
                                            <td>emma@fastdelivery.com</td>
                                            <td><span class="badge bg-success">Active</span></td>
                                            <td>3</td>
                                            <td>
                                                <button class="btn btn-info btn-sm" onclick="editClient('CL002')">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button class="btn btn-warning btn-sm" onclick="viewClientStats('CL002')">
                                                    <i class="bi bi-graph-up"></i>
                                                </button>
                                                <button class="btn btn-primary btn-sm" onclick="viewClientVehicles('CL002')">
                                                    <i class="bi bi-truck"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Client Modal -->
        <div class="modal fade" id="addClientModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Client</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addClientForm">
                            <div class="mb-3">
                                <label class="form-label">Company Name</label>
                                <input type="text" class="form-control" name="companyName" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Contact Person</label>
                                <input type="text" class="form-control" name="contactPerson" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" name="email" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Phone</label>
                                <input type="tel" class="form-control" name="phone" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Address</label>
                                <textarea class="form-control" name="address" rows="3" required></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="addClient()">Add Client</button>
                    </div>
                </div>
            </div>
        </div>

        <script>
            function editClient(clientId) {
                console.log('Edit client:', clientId);
            }

            function viewClientStats(clientId) {
                console.log('View stats for client:', clientId);
            }

            function viewClientVehicles(clientId) {
                console.log('View vehicles for client:', clientId);
            }

            function addClient() {
                const form = document.getElementById('addClientForm');
                const formData = new FormData(form);
                
                console.log('Add client:', Object.fromEntries(formData));
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('addClientModal'));
                modal.hide();
            }
        </script>
    `);
    res.json({ html: clientsHtml });
});

// Super Admin - Resellers Management
router.get('/resellers', (req, res) => {
    const resellersHtml = wrapContent(`
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-12">
                    <div class="card mb-4">
                        <div class="card-header pb-0 d-flex justify-content-between align-items-center">
                            <h6>Resellers List</h6>
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addResellerModal">
                                <i class="bi bi-plus"></i> Add Reseller
                            </button>
                        </div>
                        <div class="card-body px-0 pt-0 pb-2">
                            <div class="table-responsive p-0">
                                <table class="table align-items-center mb-0">
                                    <thead>
                                        <tr>
                                            <th>Reseller ID</th>
                                            <th>Company Name</th>
                                            <th>Contact Person</th>
                                            <th>Email</th>
                                            <th>Status</th>
                                            <th>Commission Rate</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>RS001</td>
                                            <td>Fuel Solutions Ltd</td>
                                            <td>John Smith</td>
                                            <td>john@fuelsolutions.com</td>
                                            <td><span class="badge bg-success">Active</span></td>
                                            <td>15%</td>
                                            <td>
                                                <button class="btn btn-info btn-sm" onclick="editReseller('RS001')">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button class="btn btn-warning btn-sm" onclick="viewResellerStats('RS001')">
                                                    <i class="bi bi-graph-up"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>RS002</td>
                                            <td>EcoFuel Distributors</td>
                                            <td>Sarah Johnson</td>
                                            <td>sarah@ecofuel.com</td>
                                            <td><span class="badge bg-success">Active</span></td>
                                            <td>12%</td>
                                            <td>
                                                <button class="btn btn-info btn-sm" onclick="editReseller('RS002')">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button class="btn btn-warning btn-sm" onclick="viewResellerStats('RS002')">
                                                    <i class="bi bi-graph-up"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Reseller Modal -->
        <div class="modal fade" id="addResellerModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Reseller</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addResellerForm">
                            <div class="mb-3">
                                <label class="form-label">Company Name</label>
                                <input type="text" class="form-control" name="companyName" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Contact Person</label>
                                <input type="text" class="form-control" name="contactPerson" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" name="email" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Phone</label>
                                <input type="tel" class="form-control" name="phone" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Commission Rate (%)</label>
                                <input type="number" class="form-control" name="commissionRate" min="0" max="100" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="addReseller()">Add Reseller</button>
                    </div>
                </div>
            </div>
        </div>

        <script>
            function editReseller(resellerId) {
                console.log('Edit reseller:', resellerId);
            }

            function viewResellerStats(resellerId) {
                console.log('View stats for reseller:', resellerId);
            }

            function addReseller() {
                const form = document.getElementById('addResellerForm');
                const formData = new FormData(form);
                
                console.log('Add reseller:', Object.fromEntries(formData));
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('addResellerModal'));
                modal.hide();
            }
        </script>
    `);
    res.json({ html: resellersHtml });
});

// Super Admin - All Clients Management
router.get('/allclients', (req, res) => {
    const allClientsHtml = wrapContent(`
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-12">
                    <div class="card mb-4">
                        <div class="card-header pb-0 d-flex justify-content-between align-items-center">
                            <h6>All Clients</h6>
                            <div>
                                <button class="btn btn-primary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#addClientModal">
                                    <i class="bi bi-plus"></i> Add Client
                                </button>
                                <button class="btn btn-success btn-sm" onclick="exportClientsList()">
                                    <i class="bi bi-file-earmark-excel"></i> Export
                                </button>
                            </div>
                        </div>
                        <div class="card-body px-0 pt-0 pb-2">
                            <div class="table-responsive p-0">
                                <table class="table align-items-center mb-0">
                                    <thead>
                                        <tr>
                                            <th>Client ID</th>
                                            <th>Company Name</th>
                                            <th>Contact Person</th>
                                            <th>Email</th>
                                            <th>Assigned Reseller</th>
                                            <th>Status</th>
                                            <th>Total Vehicles</th>
                                            <th>Last Activity</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>CL001</td>
                                            <td>Logistics Pro Inc</td>
                                            <td>Michael Brown</td>
                                            <td>michael@logisticspro.com</td>
                                            <td>Fuel Solutions Ltd</td>
                                            <td><span class="badge bg-success">Active</span></td>
                                            <td>5</td>
                                            <td>2024-01-10 14:30</td>
                                            <td>
                                                <button class="btn btn-info btn-sm" onclick="editClient('CL001')">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button class="btn btn-warning btn-sm" onclick="viewClientStats('CL001')">
                                                    <i class="bi bi-graph-up"></i>
                                                </button>
                                                <button class="btn btn-primary btn-sm" onclick="viewClientVehicles('CL001')">
                                                    <i class="bi bi-truck"></i>
                                                </button>
                                                <button class="btn btn-secondary btn-sm" onclick="reassignClient('CL001')">
                                                    <i class="bi bi-arrow-left-right"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>CL002</td>
                                            <td>Fast Delivery Co</td>
                                            <td>Emma Wilson</td>
                                            <td>emma@fastdelivery.com</td>
                                            <td>EcoFuel Distributors</td>
                                            <td><span class="badge bg-success">Active</span></td>
                                            <td>3</td>
                                            <td>2024-01-09 16:45</td>
                                            <td>
                                                <button class="btn btn-info btn-sm" onclick="editClient('CL002')">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button class="btn btn-warning btn-sm" onclick="viewClientStats('CL002')">
                                                    <i class="bi bi-graph-up"></i>
                                                </button>
                                                <button class="btn btn-primary btn-sm" onclick="viewClientVehicles('CL002')">
                                                    <i class="bi bi-truck"></i>
                                                </button>
                                                <button class="btn btn-secondary btn-sm" onclick="reassignClient('CL002')">
                                                    <i class="bi bi-arrow-left-right"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Client Modal -->
        <div class="modal fade" id="addClientModal" tabindex="-1" aria-labelledby="addClientModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addClientModalLabel">Add New Client</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addClientForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Company Name</label>
                                    <input type="text" class="form-control" name="companyName" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Contact Person</label>
                                    <input type="text" class="form-control" name="contactPerson" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" name="email" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Phone</label>
                                    <input type="tel" class="form-control" name="phone" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Assigned Reseller</label>
                                    <select class="form-select" name="resellerId" required>
                                        <option value="">Select Reseller</option>
                                        <option value="RS001">Fuel Solutions Ltd</option>
                                        <option value="RS002">EcoFuel Distributors</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Status</label>
                                    <select class="form-select" name="status" required>
                                        <option value="active">Active</option>
                                        <option value="pending">Pending</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Address</label>
                                <textarea class="form-control" name="address" rows="3" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Notes</label>
                                <textarea class="form-control" name="notes" rows="2"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="addClient()">Add Client</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reassign Client Modal -->
        <div class="modal fade" id="reassignClientModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Reassign Client</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="reassignClientForm">
                            <input type="hidden" id="reassignClientId" name="clientId">
                            <div class="mb-3">
                                <label class="form-label">Select New Reseller</label>
                                <select class="form-select" name="newResellerId" required>
                                    <option value="">Select Reseller</option>
                                    <option value="RS001">Fuel Solutions Ltd</option>
                                    <option value="RS002">EcoFuel Distributors</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Reason for Reassignment</label>
                                <textarea class="form-control" name="reason" rows="3" required></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="submitReassignment()">Confirm Reassignment</button>
                    </div>
                </div>
            </div>
        </div>

        <script>
            function editClient(clientId) {
                console.log('Edit client:', clientId);
            }

            function viewClientStats(clientId) {
                console.log('View stats for client:', clientId);
            }

            function viewClientVehicles(clientId) {
                console.log('View vehicles for client:', clientId);
            }

            function reassignClient(clientId) {
                document.getElementById('reassignClientId').value = clientId;
                const modal = new bootstrap.Modal(document.getElementById('reassignClientModal'));
                modal.show();
            }

            function submitReassignment() {
                const form = document.getElementById('reassignClientForm');
                const formData = new FormData(form);
                console.log('Reassign client:', Object.fromEntries(formData));
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('reassignClientModal'));
                modal.hide();
            }

            function addClient() {
                const form = document.getElementById('addClientForm');
                const formData = new FormData(form);
                console.log('Add client:', Object.fromEntries(formData));
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('addClientModal'));
                modal.hide();
            }

            function exportClientsList() {
                console.log('Exporting clients list...');
                // Implement export functionality
            }
        </script>
    `);
    res.json({ html: allClientsHtml });
});

// Sites page content
router.get('/sites', (req, res) => {
    const sitesHtml = wrapContent(`
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-12">
                    <div class="card mb-4">
                        <div class="card-header pb-0 d-flex justify-content-between align-items-center">
                            <h6>Sites Management</h6>
                            <div>
                                <button class="btn btn-primary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#addSiteModal">
                                    <i class="bi bi-plus-circle"></i> Add Site
                                </button>
                                <button class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#addTankModal">
                                    <i class="bi bi-plus-circle"></i> Add Tank
                                </button>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div class="row">
                                <div class="col-md-8">
                                    <div id="sitesMap" style="height: 600px; width: 100%;"></div>
                                </div>
                                <div class="col-md-4">
                                    <div class="p-3">
                                        <h6 class="mb-3">Site Details</h6>
                                        <div id="siteDetails">
                                            <div class="text-center text-muted py-5">
                                                <i class="bi bi-geo-alt display-4"></i>
                                                <p>Select a site to view details</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Site Modal -->
        <div class="modal fade" id="addSiteModal" tabindex="-1" aria-labelledby="addSiteModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addSiteModalLabel">Add New Site</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <form id="addSiteForm">
                                    <div class="mb-3">
                                        <label for="siteName" class="form-label">Site Name</label>
                                        <input type="text" class="form-control" id="siteName" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="siteAddress" class="form-label">Address</label>
                                        <textarea class="form-control" id="siteAddress" rows="3" required></textarea>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="siteLat" class="form-label">Latitude</label>
                                                <input type="number" step="any" class="form-control" id="siteLat" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="siteLng" class="form-label">Longitude</label>
                                                <input type="number" step="any" class="form-control" id="siteLng" required>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="siteNotes" class="form-label">Notes</label>
                                        <textarea class="form-control" id="siteNotes" rows="2"></textarea>
                                    </div>
                                    <small class="text-muted">Click on the map to set site location</small>
                                </form>
                            </div>
                            <div class="col-md-6">
                                <div id="addSiteMap" style="height: 400px; border-radius: 4px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveSite">Save Site</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Tank Modal -->
        <div class="modal fade" id="addTankModal" tabindex="-1" aria-labelledby="addTankModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addTankModalLabel">Add New Tank</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <form id="addTankForm">
                                    <div class="mb-3">
                                        <label for="tankSite" class="form-label">Site</label>
                                        <select class="form-select" id="tankSite" required>
                                            <option value="">Select site...</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label for="tankName" class="form-label">Tank Name/ID</label>
                                        <input type="text" class="form-control" id="tankName" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="tankCapacity" class="form-label">Capacity (Liters)</label>
                                        <input type="number" class="form-control" id="tankCapacity" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="tankType" class="form-label">Fuel Type</label>
                                        <select class="form-select" id="tankType" required>
                                            <option value="diesel">Diesel</option>
                                            <option value="petrol">Petrol</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label for="pumpOdometer" class="form-label">Initial Pump Odometer Reading</label>
                                        <input type="number" class="form-control" id="pumpOdometer" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="lastInspection" class="form-label">Last Inspection Date</label>
                                        <input type="date" class="form-control" id="lastInspection" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="tankNotes" class="form-label">Notes</label>
                                        <textarea class="form-control" id="tankNotes" rows="2"></textarea>
                                    </div>
                                    <small class="text-muted">Click on the map to set tank position</small>
                                </form>
                            </div>
                            <div class="col-md-6">
                                <div id="addTankMap" style="height: 400px; border-radius: 4px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveTank">Save Tank</button>
                    </div>
                </div>
            </div>
        </div>
    `);
    res.json({ html: sitesHtml });
});

// Messages page content
router.get('/messages', (req, res) => {
    const messagesHtml = wrapContent(`
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header pb-0 d-flex justify-content-between align-items-center">
                            <h6>Messages</h6>
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#newMessageModal">
                                <i class="bi bi-plus"></i> New Message
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4 border-end">
                                    <div class="messages-sidebar">
                                        <div class="list-group list-group-flush" id="messages-list">
                                            <!-- Messages list will be loaded here -->
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <div id="message-content" class="p-3">
                                        <div class="text-center text-muted">
                                            <i class="bi bi-envelope-open display-4"></i>
                                            <p>Select a message to read</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
    res.json({ html: messagesHtml });
});

module.exports = router;
