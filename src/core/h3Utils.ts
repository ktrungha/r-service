import {
  cellArea,
  getHexagonAreaAvg,
  gridDisk,
  latLngToCell,
  UNITS,
} from 'h3-js';

export function kRingIndexesArea(
  lat: number,
  lng: number,
  searchRadiusKm: number,
) {
  const searchArea = Math.PI * searchRadiusKm * searchRadiusKm;

  let res = 15;
  let factor = searchArea / getHexagonAreaAvg(res, UNITS.km2);
  while (factor > 80 && res > 0) {
    res -= 1;
    factor = searchArea / getHexagonAreaAvg(res, UNITS.km2);
  }

  const origin = latLngToCell(lat, lng, res);
  const originArea = cellArea(origin, UNITS.km2);

  let radius = 0;
  let diskArea = originArea;

  while (diskArea < searchArea) {
    radius++;
    const cellCount = 3 * radius * (radius + 1) + 1;
    diskArea = cellCount * originArea;
  }

  return { hexIds: gridDisk(origin, radius), res };
}
