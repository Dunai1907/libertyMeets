export function calculationPossibleRangeForCoordinates(
  radius: number,
  lat: number,
  lng: number
) {
  if (radius < 0) {
    return { latDiff: NaN, lngDiff: NaN };
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return { latDiff: NaN, lngDiff: NaN };
  }

  const latDiff = radius / 69;
  const lngDiff = radius / (69 * Math.cos(lat * (Math.PI / 180)));

  return {
    lat: [Number(lat) - latDiff, Number(lat) + latDiff],
    lng: [Number(lng) - lngDiff, Number(lng) + lngDiff],
  };
}
