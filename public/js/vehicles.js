console.log('Loading vehicles.js');

class VehiclesManager {
    constructor() {
        console.log('VehiclesManager constructor called');
        this.vehicles = [];
        this.sites = [];
        this.setupEventListeners();
        this.loadSites();
        this.loadVehicles();
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        const saveButton = document.getElementById('saveVehicle');
        if (saveButton) {
            console.log('Found save button');
            saveButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Save button clicked');
                this.saveVehicle();
            });
        } else {
            console.error('Save button not found!');
        }

        const modal = document.getElementById('addVehicleModal');
        if (modal) {
            console.log('Found modal');
            modal.addEventListener('hidden.bs.modal', () => {
                document.getElementById('addVehicleForm').reset();
            });
        } else {
            console.error('Modal not found!');
        }
    }

    async loadSites() {
        try {
            console.log('Loading sites...');
            const response = await fetch('/api/sites');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            this.sites = await response.json();
            console.log('Sites loaded:', this.sites);
            this.updateSitesList();
        } catch (error) {
            console.error('Error loading sites:', error);
            showToast('error', 'Failed to load sites');
        }
    }

    async loadVehicles() {
        try {
            console.log('Loading vehicles...');
            const response = await fetch('/api/vehicles');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            this.vehicles = await response.json();
            console.log('Vehicles loaded:', this.vehicles);
            this.updateVehiclesList();
        } catch (error) {
            console.error('Error loading vehicles:', error);
            showToast('error', 'Failed to load vehicles');
        }
    }

    updateSitesList() {
        console.log('Updating sites list');
        const siteSelect = document.getElementById('vehicleSite');
        if (siteSelect) {
            siteSelect.innerHTML = `
                <option value="">Select site...</option>
                ${this.sites.map(site => `
                    <option value="${site.id}">${site.name}</option>
                `).join('')}
            `;
        }
    }

    updateVehiclesList() {
        console.log('Updating vehicles list');
        const tbody = document.getElementById('vehiclesTableBody');
        if (tbody) {
            tbody.innerHTML = this.vehicles.map(vehicle => {
                const site = this.sites.find(s => s.id === vehicle.siteId);
                const statusClass = vehicle.status === 'active' ? 'success' : 'warning';
                return `
                    <tr>
                        <td>
                            <div class="d-flex px-2 py-1">
                                <div class="d-flex flex-column justify-content-center">
                                    <h6 class="mb-0 text-sm">${vehicle.name}</h6>
                                    <p class="text-xs text-secondary mb-0">${vehicle.license} (${vehicle.type})</p>
                                </div>
                            </div>
                        </td>
                        <td>
                            <p class="text-xs font-weight-bold mb-0">${site ? site.name : 'Unassigned'}</p>
                        </td>
                        <td>
                            <span class="badge badge-sm bg-gradient-${statusClass}">${vehicle.status}</span>
                        </td>
                        <td>
                            <span class="text-secondary text-xs font-weight-bold">
                                ${new Date(vehicle.lastMaintenance).toLocaleDateString()}
                            </span>
                        </td>
                        <td>
                            <span class="text-secondary text-xs font-weight-bold">
                                ${vehicle.odometer.toLocaleString()} km
                            </span>
                        </td>
                        <td>
                            <span class="text-secondary text-xs font-weight-bold">
                                ${vehicle.fuelEfficiency ? vehicle.fuelEfficiency.toFixed(1) : '-'}
                            </span>
                        </td>
                        <td>
                            <div class="dropdown">
                                <button class="btn btn-link text-secondary mb-0" data-bs-toggle="dropdown">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a class="dropdown-item" href="#" onclick="vehiclesManager.editVehicle(${vehicle.id})">
                                            <i class="bi bi-pencil-square"></i> Edit
                                        </a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="#" onclick="vehiclesManager.assignSite(${vehicle.id})">
                                            <i class="bi bi-geo-alt"></i> Assign Site
                                        </a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="#" onclick="vehiclesManager.logMaintenance(${vehicle.id})">
                                            <i class="bi bi-tools"></i> Log Maintenance
                                        </a>
                                    </li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li>
                                        <a class="dropdown-item text-danger" href="#" onclick="vehiclesManager.toggleStatus(${vehicle.id})">
                                            <i class="bi bi-toggle-on"></i> Toggle Status
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    }

    async saveVehicle() {
        const form = document.getElementById('addVehicleForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        try {
            const vehicleData = {
                name: document.getElementById('vehicleName').value,
                type: document.getElementById('vehicleType').value,
                siteId: parseInt(document.getElementById('vehicleSite').value) || null,
                license: document.getElementById('vehicleLicense').value,
                odometer: parseInt(document.getElementById('vehicleOdometer').value),
                fuelEfficiency: parseFloat(document.getElementById('vehicleFuelEfficiency').value) || null,
                lastMaintenance: document.getElementById('vehicleLastMaintenance').value || new Date().toISOString().split('T')[0],
                notes: document.getElementById('vehicleNotes').value || ''
            };

            console.log('Saving vehicle:', vehicleData);
            const response = await fetch('/api/vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vehicleData)
            });

            if (!response.ok) throw new Error('Failed to save vehicle');

            const newVehicle = await response.json();
            console.log('Vehicle saved:', newVehicle);
            this.vehicles.push(newVehicle);
            this.updateVehiclesList();
            
            // Close modal and show success message
            const modal = bootstrap.Modal.getInstance(document.getElementById('addVehicleModal'));
            if (modal) {
                modal.hide();
                form.reset();
                showToast('success', 'Vehicle added successfully');
            } else {
                console.error('Modal instance not found!');
            }
        } catch (error) {
            console.error('Error saving vehicle:', error);
            showToast('error', 'Failed to save vehicle: ' + error.message);
        }
    }

    editVehicle(id) {
        console.log('Edit vehicle:', id);
        showToast('info', 'Edit vehicle functionality coming soon');
    }

    assignSite(id) {
        console.log('Assign site to vehicle:', id);
        showToast('info', 'Assign site functionality coming soon');
    }

    logMaintenance(id) {
        console.log('Log maintenance for vehicle:', id);
        showToast('info', 'Log maintenance functionality coming soon');
    }

    toggleStatus(id) {
        console.log('Toggle status for vehicle:', id);
        showToast('info', 'Toggle status functionality coming soon');
    }
}

// Initialize vehicles manager when the page loads
console.log('Setting up DOMContentLoaded listener');
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking for vehicles table');
    if (document.getElementById('vehiclesTableBody')) {
        console.log('Vehicles table found, initializing manager');
        window.vehiclesManager = new VehiclesManager();
    } else {
        console.error('Vehicles table not found!');
    }
});
