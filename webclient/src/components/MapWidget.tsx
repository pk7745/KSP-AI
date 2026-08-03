import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapWidget.css';

// SVG Data URI for map markers (eliminates external CDN Tracking Prevention blocks)
const redMarkerSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 24 36"><path fill="%23ef4444" stroke="%23991b1b" stroke-width="1.5" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12zm0 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>`;

const customIcon = new L.Icon({
  iconUrl: redMarkerSvg,
  iconSize: [28, 40],
  iconAnchor: [14, 40],
  popupAnchor: [0, -36]
});

interface CasePoint {
  CaseMasterID?: string | number;
  latitude: number;
  longitude: number;
  CrimeMajorHead: string;
  DistrictName: string;
  CrimeNo: string;
  PoliceStationName?: string;
}

interface MapWidgetProps {
  cases: CasePoint[];
}

function MapRecenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function MapWidget({ cases }: MapWidgetProps) {
  const validCases = (cases || []).filter(c => c.latitude && c.longitude && !isNaN(c.latitude) && !isNaN(c.longitude));

  let center: [number, number] = [15.3173, 75.7139];
  let zoom = 6;

  if (validCases.length > 0) {
    const avgLat = validCases.reduce((sum, c) => sum + c.latitude, 0) / validCases.length;
    const avgLng = validCases.reduce((sum, c) => sum + c.longitude, 0) / validCases.length;
    center = [avgLat, avgLng];
    zoom = validCases.length < 10 ? 11 : 7;
  }

  return (
    <div className="map-widget wireframe-box registration-mark">
      <div className="map-header">
        <h3>Jurisdiction Incident Heatmap</h3>
        <span className="badge">{validCases.length} Authorized Incidents</span>
      </div>
      <div className="map-container-wrapper">
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="leaflet-map">
          <MapRecenter center={center} zoom={zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {validCases.map((c, idx) => (
            <Marker key={c.CaseMasterID || c.CrimeNo || idx} position={[c.latitude, c.longitude]} icon={customIcon}>
              <Popup className="dark-popup">
                <strong>{c.CrimeNo}</strong><br/>
                {c.CrimeMajorHead}<br/>
                <em>{c.DistrictName} {c.PoliceStationName ? `• ${c.PoliceStationName}` : ''}</em>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
