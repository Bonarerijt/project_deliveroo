// Mock Google Maps service for development

export class MockMapsService {
  static calculateRoute(pickup, destination) {
    const distanceKm = this.calculateDistance(pickup, destination);
    const durationHours = distanceKm / 75;
    
    return {
      distance: `${distanceKm.toFixed(1)} km`,
      duration: `${Math.floor(durationHours)}h ${Math.floor((durationHours % 1) * 60)}m`,
      polyline: this.generatePolyline(pickup, destination)
    };
  }
  
  static calculateDistance(point1, point2) {
    const latDiff = Math.abs(point1.lat - point2.lat);
    const lngDiff = Math.abs(point1.lng - point2.lng);
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;
  }
  
  static generatePolyline(start, end) {
    const points = [start];
    
    for (let i = 1; i < 4; i++) {
      const fraction = i / 5;
      points.push({
        lat: start.lat + (end.lat - start.lat) * fraction,
        lng: start.lng + (end.lng - start.lng) * fraction
      });
    }
    
    points.push(end);
    return points;
  }
  
  static getNairobiLocation() {
    return { lat: -1.286389, lng: 36.817223 };
  }
  
  static getMombasaLocation() {
    return { lat: -4.0435, lng: 39.6682 };
  }
}