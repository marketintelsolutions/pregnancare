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


exports.generateId = () => {
    const currentDate = new Date().toISOString();
    const randomNum = Math.random().toString(36).substr(2, 9);
    return `${currentDate}-${randomNum}`;
}