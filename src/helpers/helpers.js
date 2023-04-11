import _ from "lodash";
import * as geolib from "geolib";

const decodePolyline = (str, precision) => {
  var index = 0,
    lat = 0,
    lng = 0,
    coordinates = [],
    shift = 0,
    result = 0,
    byte = null,
    latitude_change,
    longitude_change,
    factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);

  while (index < str.length) {
    byte = null;
    shift = 0;
    result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    latitude_change = result & 1 ? ~(result >> 1) : result >> 1;

    shift = result = 0;
    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    longitude_change = result & 1 ? ~(result >> 1) : result >> 1;

    lat += latitude_change;
    lng += longitude_change;
    coordinates.push({ lat: lat / factor, lng: lng / factor });
  }
  return coordinates;
};

const processData = dataString => {
  const dataStringLines = dataString.split(/\r\n|\n/);
  const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

  const list = [];
  for (let i = 1; i < dataStringLines.length; i++) {
    const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    if (headers && row.length === headers.length) {
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        let d = row[j];
        if (d.length > 0) {
          if (d[0] === '"')
            d = d.substring(1, d.length - 1);
          if (d[d.length - 1] === '"')
            d = d.substring(d.length - 2, 1);
        }
        if (headers[j]) {
          obj[headers[j]] = d;
        }
      } 
      // remove the blank rows
      if (Object.values(obj).filter(x => x).length > 0) {
        list.push(obj);
      }
    }
  }
  return list;
}

export default function files(name, type) {
  switch (type) {
    case "image":
      return `${process.env.REACT_APP_BASE_URL}/uploads/images/${name}`;
      
    case "attachments":
      return `${process.env.REACT_APP_BASE_URL}/uploads/attachments/${name}`;

    case "file":
      return `${process.env.REACT_APP_BASE_URL}/uploads/files/${name}`;

    case "audio":
      return `${process.env.REACT_APP_BASE_URL}/uploads/audio/${name}`;

    case "video":
      return `${process.env.REACT_APP_BASE_URL}/uploads/video/${name}`;

    case "xlsx":
      return `${process.env.REACT_APP_BASE_URL}/uploads/sampleFile/${name}`;

    default:
      return `${process.env.REACT_APP_BASE_URL}/uploads/images/${name}`;
  }
}

const getDistanceInKm = (lat1, lng1, lat2, lng2) => {
  let origins = {};
  let destinations = {};
  if (lat1 && lng1) origins = { latitude: lat1, longitude: lng1 };

  if (lat2 && lng2) destinations = { latitude: lat2, longitude: lng2 };

  if (origins && destinations) {
    const distance = geolib.getDistance(origins, destinations);
    const distanceKm = geolib.convertDistance(distance, "km");
    const result = parseFloat(parseFloat(distanceKm).toFixed(2));
    return result;
  }

  return false;
};
export {
  processData,
  decodePolyline,
  files,
  getDistanceInKm
};
