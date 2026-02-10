import logging
from typing import Dict, Tuple, Optional
import os
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MapsService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_MAPS_API_KEY")
        
        # Try to import googlemaps only if we have a valid key
        self.gmaps = None
        if self.api_key and self.api_key != "YOUR_GOOGLE_MAPS_API_KEY_HERE":
            try:
                import googlemaps
                self.gmaps = googlemaps.Client(key=self.api_key)
                logger.info("Google Maps client initialized successfully")
            except ImportError:
                logger.warning("googlemaps package not installed")
            except Exception as e:
                logger.warning(f"Failed to initialize Google Maps client: {e}")
        else:
            logger.warning("GOOGLE_MAPS_API_KEY not set or is placeholder. Using mock data.")
    
    def calculate_distance_matrix(self, origin: Tuple[float, float], 
                                 destination: Tuple[float, float]) -> Optional[Dict]:
        """Calculate distance and duration between two points"""
        if self.gmaps:
            try:
                result = self.gmaps.distance_matrix(
                    origins=[origin],
                    destinations=[destination],
                    mode="driving",
                    units="metric"
                )
                
                if result['status'] == 'OK':
                    element = result['rows'][0]['elements'][0]
                    if element['status'] == 'OK':
                        return element
            except Exception as e:
                logger.error(f"Error calculating distance matrix: {e}")
        
        # Return mock data for development
        lat_diff = abs(destination[0] - origin[0])
        lng_diff = abs(destination[1] - origin[1])
        distance_value = int((lat_diff + lng_diff) * 111000)  # Approximate km to meters
        duration_value = int(distance_value / 1000 * 1.5 * 60)  # 1.5 minutes per km
        
        return {
            'distance': {'text': f'{distance_value/1000:.1f} km', 'value': distance_value},
            'duration': {'text': f'{duration_value//60}h {duration_value%60}m', 'value': duration_value},
            'status': 'OK'
        }
    
    def get_route_polyline(self, origin: Tuple[float, float], 
                          destination: Tuple[float, float]) -> Optional[str]:
        """Get route polyline for map display"""
        if not self.gmaps:
            return None
        
        try:
            import googlemaps
            directions = self.gmaps.directions(
                origin=origin,
                destination=destination,
                mode="driving"
            )
            
            if directions:
                return directions[0]['overview_polyline']['points']
        except Exception as e:
            logger.error(f"Error getting directions: {e}")
        
        return None
    
    def calculate_quote(self, weight_category: str, distance_km: float) -> float:
        """Calculate delivery quote based on weight and distance"""
        base_prices = {
            'small': 5.0,
            'medium': 10.0,
            'large': 15.0
        }
        
        base_price = base_prices.get(weight_category, 10.0)
        distance_rate = 0.5  # $ per km
        
        return round(base_price + (distance_km * distance_rate), 2)

maps_service = MapsService()
