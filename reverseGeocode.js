const reverseGeocode = async (longitude, latitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      // const city = data.address.city || data.address.town || data.address.village;
      const country = data.address.country;
      const village = data.address.village
      const county = data.address.county
      const state = data.address.state
      const displayName = data.address.displayName
      return { state, county, country, village, displayName };
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
};

export default reverseGeocode
  
  // Example usage with latitude and longitude values
  