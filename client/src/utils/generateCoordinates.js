export function generateCoordinates(index) {

  const coordinates = [
    [-122.4194, 37.7749], // San Francisco
    [-74.0060, 40.7128],  // New York
    [2.3522, 48.8566],    // Paris
    [77.2090, 28.6139],   // Delhi
    [139.6917, 35.6895],  // Tokyo
    [151.2093, -33.8688], // Sydney
    [36.8219, -1.2921],   // Nairobi
    [-58.3816, -34.6037], // Buenos Aires
    [18.4241, -33.9249],  // Cape Town
    [31.2357, 30.0444],   // Cairo
  ];

  return coordinates[index % coordinates.length];
}