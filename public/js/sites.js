class SitesManager {
    constructor() {
        this.map = null;
        this.addSiteMap = null;
        this.addTankMap = null;
        this.sites = [];
        this.tanks = [];
        this.selectedSite = null;
        this.tankMarkers = [];
        this.addingTank = false;
        this.tempMarker = null;
        this.addSiteMarker = null;
        this.addTankMarker = null;
        this.setupMaps();
        this.setupEventListeners();
        this.loadSites();
    }

    setupMaps() {
        // Initialize main map
        const mapElement = document.getElementById('sitesMap');
        if (mapElement) {
            this.map = L.map('sitesMap', {
                center: [-26.2041, 28.0473], // Centered on Johannesburg
                zoom: 10,
                zoomControl: true,
                scrollWheelZoom: true
            });

            // Add the OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: ' OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(this.map);

            // Create custom tank icon
            this.tankIcon = L.divIcon({
                className: 'custom-tank-icon',
                html: '<i class="bi bi-fuel-pump" style="font-size: 24px; color: #0d6efd;"></i>',
                iconSize: [24, 24],
                iconAnchor: [12, 24],
                popupAnchor: [0, -24]
            });

            // Map click handler for adding tanks
            this.map.on('click', (e) => {
                if (this.addingTank) {
                    const lat = e.latlng.lat.toFixed(6);
                    const lng = e.latlng.lng.toFixed(6);
                    document.getElementById('tankLat').value = lat;
                    document.getElementById('tankLng').value = lng;
                    
                    // Show temporary marker
                    if (this.tempMarker) {
                        this.map.removeLayer(this.tempMarker);
                    }
                    this.tempMarker = L.marker([lat, lng], { icon: this.tankIcon })
                        .addTo(this.map)
                        .bindPopup('New tank position')
                        .openPopup();
                }
            });
        }

        // Initialize Add Site map
        document.getElementById('addSiteModal')?.addEventListener('shown.bs.modal', () => {
            if (!this.addSiteMap) {
                const addSiteMapElement = document.getElementById('addSiteMap');
                if (addSiteMapElement) {
                    this.addSiteMap = L.map('addSiteMap', {
                        center: [-26.2041, 28.0473],
                        zoom: 10,
                        zoomControl: true,
                        scrollWheelZoom: true
                    });

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: ' OpenStreetMap contributors',
                        maxZoom: 19
                    }).addTo(this.addSiteMap);

                    // Click handler for setting site location
                    this.addSiteMap.on('click', (e) => {
                        const lat = e.latlng.lat.toFixed(6);
                        const lng = e.latlng.lng.toFixed(6);
                        document.getElementById('siteLat').value = lat;
                        document.getElementById('siteLng').value = lng;

                        // Update or add marker
                        if (this.addSiteMarker) {
                            this.addSiteMarker.setLatLng([lat, lng]);
                        } else {
                            this.addSiteMarker = L.marker([lat, lng])
                                .addTo(this.addSiteMap)
                                .bindPopup('New site location')
                                .openPopup();
                        }
                    });
                }
            }
            // Invalidate size after modal animation
            setTimeout(() => {
                this.addSiteMap?.invalidateSize();
            }, 100);
        });

        // Initialize Add Tank map
        document.getElementById('addTankModal')?.addEventListener('shown.bs.modal', () => {
            if (!this.addTankMap) {
                const addTankMapElement = document.getElementById('addTankMap');
                if (addTankMapElement) {
                    this.addTankMap = L.map('addTankMap', {
                        center: [-26.2041, 28.0473],
                        zoom: 10,
                        zoomControl: true,
                        scrollWheelZoom: true
                    });

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: ' OpenStreetMap contributors',
                        maxZoom: 19
                    }).addTo(this.addTankMap);

                    // Click handler for setting tank location
                    this.addTankMap.on('click', (e) => {
                        const lat = e.latlng.lat.toFixed(6);
                        const lng = e.latlng.lng.toFixed(6);

                        // Update or add marker
                        if (this.addTankMarker) {
                            this.addTankMarker.setLatLng([lat, lng]);
                        } else {
                            this.addTankMarker = L.marker([lat, lng], { icon: this.tankIcon })
                                .addTo(this.addTankMap)
                                .bindPopup('New tank position')
                                .openPopup();
                        }
                    });
                }
            }
            // Update map view based on selected site
            const siteSelect = document.getElementById('tankSite');
            const selectedSite = this.sites.find(site => site.id === parseInt(siteSelect.value));
            if (selectedSite) {
                this.addTankMap.setView([selectedSite.latitude, selectedSite.longitude], 15);
            }
            
            // Invalidate size after modal animation
            setTimeout(() => {
                this.addTankMap?.invalidateSize();
            }, 100);
        });

        // Cleanup Add Site map when modal is hidden
        document.getElementById('addSiteModal')?.addEventListener('hidden.bs.modal', () => {
            if (this.addSiteMarker) {
                this.addSiteMap.removeLayer(this.addSiteMarker);
                this.addSiteMarker = null;
            }
            document.getElementById('addSiteForm').reset();
        });

        // Cleanup Add Tank map when modal is hidden
        document.getElementById('addTankModal')?.addEventListener('hidden.bs.modal', () => {
            if (this.addTankMarker) {
                this.addTankMap.removeLayer(this.addTankMarker);
                this.addTankMarker = null;
            }
            document.getElementById('addTankForm').reset();
        });

        // Invalidate map size after initialization
        setTimeout(() => {
            this.map?.invalidateSize();
        }, 100);
    }

    setupEventListeners() {
        // Site form handlers
        document.getElementById('saveSite')?.addEventListener('click', () => this.saveSite());
        document.getElementById('addSiteModal')?.addEventListener('hidden.bs.modal', () => {
            document.getElementById('addSiteForm').reset();
        });

        // Tank form handlers
        document.getElementById('saveTank')?.addEventListener('click', () => this.saveTank());
        document.getElementById('tankSite')?.addEventListener('change', (e) => {
            const selectedSite = this.sites.find(site => site.id === parseInt(e.target.value));
            if (selectedSite && this.addTankMap) {
                this.addTankMap.setView([selectedSite.latitude, selectedSite.longitude], 15);
            }
        });
        document.getElementById('addTankModal')?.addEventListener('shown.bs.modal', () => {
            this.addingTank = true;
        });
        document.getElementById('addTankModal')?.addEventListener('hidden.bs.modal', () => {
            this.addingTank = false;
            if (this.tempMarker) {
                this.map.removeLayer(this.tempMarker);
                this.tempMarker = null;
            }
            document.getElementById('addTankForm').reset();
        });
        
        // Edit tank form handlers
        document.getElementById('updateTank')?.addEventListener('click', () => this.updateTank());
    }

    async loadSites() {
        try {
            const response = await fetch('/api/sites');
            this.sites = await response.json();
            this.updateSitesList();
            this.displaySitesOnMap();
            await this.loadTanks();
        } catch (error) {
            console.error('Error loading sites:', error);
            showToast('error', 'Failed to load sites');
        }
    }

    async loadTanks() {
        try {
            const response = await fetch('/api/tanks');
            this.tanks = await response.json();
            this.displayTanksOnMap();
        } catch (error) {
            console.error('Error loading tanks:', error);
            showToast('error', 'Failed to load tanks');
        }
    }

    displaySitesOnMap() {
        if (!this.map) return;

        this.sites.forEach(site => {
            const marker = L.marker([site.latitude, site.longitude])
                .addTo(this.map)
                .bindPopup(`
                    <div class="site-popup">
                        <h6>${site.name}</h6>
                        <p class="text-muted mb-2">${site.address}</p>
                        <button class="btn btn-sm btn-primary view-site" data-site-id="${site.id}">
                            View Details
                        </button>
                    </div>
                `);

            marker.on('popupopen', () => {
                document.querySelector('.view-site')?.addEventListener('click', (e) => {
                    const siteId = parseInt(e.target.dataset.siteId);
                    this.showSiteDetails(siteId);
                });
            });
        });

        // Fit map to show all sites
        if (this.sites.length > 0) {
            const bounds = this.sites.map(site => [site.latitude, site.longitude]);
            this.map.fitBounds(bounds, { padding: [50, 50] });
        }
    }

    displayTanksOnMap() {
        if (!this.map) return;

        // Clear existing tank markers
        this.tankMarkers.forEach(marker => marker.remove());
        this.tankMarkers = [];

        this.tanks.forEach(tank => {
            const marker = L.marker([tank.latitude, tank.longitude], { icon: this.tankIcon })
                .addTo(this.map)
                .bindPopup(this.getTankPopupContent(tank));

            marker.on('popupopen', () => {
                this.setupTankPopupListeners(tank.id);
            });

            this.tankMarkers.push(marker);
        });
    }

    getTankPopupContent(tank) {
        const lastReading = tank.readings?.[0] || { level: 0, timestamp: new Date() };
        const capacityPercentage = (lastReading.level / tank.capacity) * 100;
        
        return `
            <div class="tank-popup">
                <h6>${tank.name}</h6>
                <div class="progress mb-2">
                    <div class="progress-bar ${this.getFillLevelClass(capacityPercentage)}" 
                         role="progressbar" 
                         style="width: ${capacityPercentage}%">
                        ${capacityPercentage.toFixed(1)}%
                    </div>
                </div>
                <table class="table table-sm">
                    <tr>
                        <td>Capacity:</td>
                        <td>${tank.capacity.toLocaleString()} L</td>
                    </tr>
                    <tr>
                        <td>Current Level:</td>
                        <td>${lastReading.level.toLocaleString()} L</td>
                    </tr>
                    <tr>
                        <td>Fuel Type:</td>
                        <td>${tank.fuelType}</td>
                    </tr>
                    <tr>
                        <td>Last Inspection:</td>
                        <td>${new Date(tank.lastInspection).toLocaleDateString()}</td>
                    </tr>
                </table>
                <div class="btn-group w-100">
                    <button class="btn btn-sm btn-primary view-tank" data-tank-id="${tank.id}">
                        View Details
                    </button>
                    <button class="btn btn-sm btn-secondary edit-tank" data-tank-id="${tank.id}">
                        Edit
                    </button>
                </div>
            </div>
        `;
    }

    getFillLevelClass(percentage) {
        if (percentage <= 20) return 'bg-danger';
        if (percentage <= 40) return 'bg-warning';
        return 'bg-success';
    }

    setupTankPopupListeners(tankId) {
        document.querySelector(`.view-tank[data-tank-id="${tankId}"]`)?.addEventListener('click', () => {
            this.showTankDetails(tankId);
        });

        document.querySelector(`.edit-tank[data-tank-id="${tankId}"]`)?.addEventListener('click', () => {
            this.showEditTankModal(tankId);
        });
    }

    updateSitesList() {
        const sitesList = document.getElementById('sitesList');
        if (sitesList) {
            sitesList.innerHTML = this.sites.map(site => `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${site.name}</h5>
                            <p class="card-text text-muted">${site.address}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <button class="btn btn-primary btn-sm view-site-details" data-site-id="${site.id}">
                                    View Details
                                </button>
                                <span class="badge bg-primary">${site.tanks ? site.tanks.length : 0} Tanks</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add click handlers for view details buttons
            document.querySelectorAll('.view-site-details').forEach(button => {
                button.addEventListener('click', (e) => {
                    const siteId = parseInt(e.target.dataset.siteId);
                    this.showSiteDetails(siteId);
                });
            });
        }
    }

    async saveSite() {
        const form = document.getElementById('addSiteForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const siteData = {
            name: document.getElementById('siteName').value,
            address: document.getElementById('siteAddress').value,
            latitude: parseFloat(document.getElementById('siteLat').value),
            longitude: parseFloat(document.getElementById('siteLng').value),
            notes: document.getElementById('siteNotes').value
        };

        try {
            const response = await fetch('/api/sites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(siteData)
            });

            if (!response.ok) throw new Error('Failed to save site');

            bootstrap.Modal.getInstance(document.getElementById('addSiteModal')).hide();
            form.reset();
            await this.loadSites();
            showToast('success', 'Site added successfully');
        } catch (error) {
            console.error('Error saving site:', error);
            showToast('error', 'Failed to save site');
        }
    }

    async saveTank() {
        const form = document.getElementById('addTankForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const tankData = {
            siteId: document.getElementById('tankSite').value,
            name: document.getElementById('tankName').value,
            capacity: parseFloat(document.getElementById('tankCapacity').value),
            fuelType: document.getElementById('tankType').value,
            latitude: parseFloat(document.getElementById('tankLat').value),
            longitude: parseFloat(document.getElementById('tankLng').value),
            pumpOdometer: parseFloat(document.getElementById('pumpOdometer').value),
            lastInspection: document.getElementById('lastInspection').value,
            notes: document.getElementById('tankNotes').value
        };

        try {
            const response = await fetch('/api/tanks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tankData)
            });

            if (!response.ok) throw new Error('Failed to save tank');

            bootstrap.Modal.getInstance(document.getElementById('addTankModal')).hide();
            form.reset();
            await this.loadTanks();
            showToast('success', 'Tank added successfully');
        } catch (error) {
            console.error('Error saving tank:', error);
            showToast('error', 'Failed to save tank');
        }
    }

    showSiteDetails(siteId) {
        const site = this.sites.find(s => s.id === siteId);
        if (!site) return;

        const siteTanks = this.tanks.filter(t => t.siteId === siteId);
        const siteDetailsHtml = `
            <div class="site-details">
                <h5>${site.name}</h5>
                <p class="text-muted">${site.address}</p>
                
                <h6 class="mt-4">Tanks at this Site</h6>
                <div class="list-group">
                    ${siteTanks.map(tank => `
                        <div class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="mb-1">${tank.name}</h6>
                                <span class="badge bg-primary">${tank.fuelType}</span>
                            </div>
                            <div class="progress mt-2" style="height: 15px;">
                                <div class="progress-bar ${this.getFillLevelClass(tank.fillLevel)}" 
                                     role="progressbar" 
                                     style="width: ${tank.fillLevel}%">
                                    ${tank.fillLevel}%
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.getElementById('siteDetails').innerHTML = siteDetailsHtml;
    }

    async showTankDetails(tankId) {
        try {
            const response = await fetch(`/api/tanks/${tankId}/details`);
            const tank = await response.json();

            // Create and show modal with tank details and graphs
            const modalHtml = `
                <div class="modal fade" id="tankDetailsModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Tank Details: ${tank.name}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="card">
                                            <div class="card-body">
                                                <h6>Current Status</h6>
                                                <div class="progress mb-3" style="height: 25px;">
                                                    <div class="progress-bar ${this.getFillLevelClass(tank.fillLevel)}" 
                                                         role="progressbar" 
                                                         style="width: ${tank.fillLevel}%">
                                                        ${tank.fillLevel}% (${tank.currentLevel}L)
                                                    </div>
                                                </div>
                                                <table class="table table-sm">
                                                    <tr>
                                                        <td>Capacity:</td>
                                                        <td>${tank.capacity}L</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Fuel Type:</td>
                                                        <td>${tank.fuelType}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Pump Odometer:</td>
                                                        <td>${tank.pumpOdometer}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Last Inspection:</td>
                                                        <td>${new Date(tank.lastInspection).toLocaleDateString()}</td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card">
                                            <div class="card-body">
                                                <h6>Level History</h6>
                                                <canvas id="tankLevelChart"></canvas>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-12">
                                        <div class="card">
                                            <div class="card-body">
                                                <h6>Recent Readings</h6>
                                                <div class="table-responsive">
                                                    <table class="table table-sm">
                                                        <thead>
                                                            <tr>
                                                                <th>Date</th>
                                                                <th>Level</th>
                                                                <th>Change</th>
                                                                <th>Temperature</th>
                                                                <th>Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            ${tank.readings.map(reading => `
                                                                <tr>
                                                                    <td>${new Date(reading.timestamp).toLocaleString()}</td>
                                                                    <td>${reading.level}L</td>
                                                                    <td class="${reading.change > 0 ? 'text-success' : 'text-danger'}">
                                                                        ${reading.change > 0 ? '+' : ''}${reading.change}L
                                                                    </td>
                                                                    <td>${reading.temperature}°C</td>
                                                                    <td>
                                                                        <span class="badge bg-${reading.status === 'normal' ? 'success' : 'warning'}">
                                                                            ${reading.status}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            `).join('')}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Add modal to document
            const modalElement = document.createElement('div');
            modalElement.innerHTML = modalHtml;
            document.body.appendChild(modalElement);

            // Initialize and show modal
            const modal = new bootstrap.Modal(document.getElementById('tankDetailsModal'));
            modal.show();

            // Initialize chart
            this.initializeTankChart(tank.readings);

            // Clean up modal when hidden
            document.getElementById('tankDetailsModal').addEventListener('hidden.bs.modal', function () {
                this.remove();
            });
        } catch (error) {
            console.error('Error loading tank details:', error);
            showToast('error', 'Failed to load tank details');
        }
    }

    initializeTankChart(readings) {
        const ctx = document.getElementById('tankLevelChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: readings.map(r => new Date(r.timestamp).toLocaleDateString()),
                datasets: [{
                    label: 'Tank Level (L)',
                    data: readings.map(r => r.level),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Initialize the sites manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('sitesMap')) {
        window.sitesManager = new SitesManager();
    }
});
