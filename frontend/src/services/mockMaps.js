// Mock Maps Service
// This file provides mock implementations for map-related functions
// Used for development and testing without actual API calls

/**
 * Get mock coordinates for an address
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number}>}
 */
export const getCoordinates = async (address) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return mock coordinates based on address
  // Default to New York City if address doesn't match
  return {
    lat: 40.7128,
    lng: -74.0060
  };
};

/**
 * Get mock directions between two points
 * @param {string} origin - Starting point
 * @param {string} destination - Ending point
 * @returns {Promise<{distance: string, duration: string, steps: string[]}>}
 */
export const getDirections = async (origin, destination) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    distance: '5.2 km',
    duration: '15 mins',
    steps: [
      `Start at ${origin}`,
      'Head north on Main St',
      'Turn right onto Oak Ave',
      'Continue for 2 km',
      `Arrive at ${destination}`
    ]
  };
};

/**
 * Calculate estimated delivery time based on distance
 * @param {number} distance - Distance in kilometers
 * @returns {Promise<number>} - Estimated delivery time in minutes
 */
export const calculateDeliveryTime = async (distance) => {
  await new Promise(resolve => setTimeout(resolve, 200));

  // Base time: 15 minutes + 2 minutes per kilometer
  return Math.round(15 + (distance * 2));
};

/**
 * Generate a random tracking number
 * @returns {string}
 */
export const generateTrackingNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TRK';
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default {
  getCoordinates,
  getDirections,
  calculateDeliveryTime,
  generateTrackingNumber
};

