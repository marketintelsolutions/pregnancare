exports.haversineDistance = (coords1, coords2) => {
    function toRad(value) {
        return value * Math.PI / 180;
    }

    const R = 6371; // Radius of Earth in km
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lng - coords1.lng);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

exports.getClosestHospital = ({ lat, lon, dest_lat, dest_lon }) => {
    const earthRadius = 6371000; // Earth's radius in meters

    // Convert latitude and longitude from degrees to radians
    const lat1 = lat * (Math.PI / 180);
    const lon1 = lon * (Math.PI / 180);
    const lat2 = dest_lat * (Math.PI / 180);
    const lon2 = dest_lon * (Math.PI / 180);

    // Haversine formula
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate the distance
    const distance = earthRadius * c;

    return distance;
}

exports.generateId = () => {
    const currentDate = new Date().toISOString();
    const randomNum = Math.random().toString(36).substr(2, 9);
    return `${currentDate}-${randomNum}`;
}