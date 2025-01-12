const vehicles = [
    {
        id: 1,
        name: "Toyota Hilux",
        type: "truck",
        license: "FH 54 GP",
        siteId: 1,
        odometer: 125430,
        fuelEfficiency: 9.8,
        lastMaintenance: "2024-12-15",
        notes: "Primary delivery vehicle for northern routes",
        status: "active"
    },
    {
        id: 2,
        name: "Ford Transit",
        type: "van",
        license: "FH 67 GP",
        siteId: 1,
        odometer: 85240,
        fuelEfficiency: 8.5,
        lastMaintenance: "2024-12-28",
        notes: "Local deliveries and maintenance",
        status: "active"
    },
    {
        id: 3,
        name: "Isuzu NPR400",
        type: "truck",
        license: "FH 89 GP",
        siteId: 2,
        odometer: 98760,
        fuelEfficiency: 12.3,
        lastMaintenance: "2024-11-30",
        notes: "Heavy duty delivery truck",
        status: "active"
    },
    {
        id: 4,
        name: "VW Caddy",
        type: "van",
        license: "FH 23 GP",
        siteId: 3,
        odometer: 45890,
        fuelEfficiency: 7.2,
        lastMaintenance: "2025-01-05",
        notes: "Technical support vehicle",
        status: "active"
    }
];

module.exports = vehicles;
