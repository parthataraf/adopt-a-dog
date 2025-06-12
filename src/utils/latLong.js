export function getLatitudeDifference(miles) {
  const milesPerDegreeLat = 69.0;
  return miles / milesPerDegreeLat;
}

export function getLongitudeDifference(latitude, miles) {
  const milesPerDegreeLat = 69.0;
  const milesPerDegreeLong = milesPerDegreeLat * Math.cos(latitude * Math.PI / 180);
  return miles / milesPerDegreeLong;
}

export function getBoundingBox(centerLat, centerLong, radiusMiles) {
  const latDiff = getLatitudeDifference(radiusMiles);
  const longDiff = getLongitudeDifference(centerLat, radiusMiles);

  return {
    top: centerLat + latDiff,
    bottom: centerLat - latDiff,
    left: centerLong - longDiff,
    right: centerLong + longDiff,
  };
}