import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapWidget.css';

// Fix for default Leaflet marker icons in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom dark mode icon
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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

// Component to dynamically re-center map on officer's jurisdiction
function MapRecenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function MapWidget({ cases }: MapWidgetProps) {
  const validCases = (cases || []).filter(c => c.latitude && c.longitude && !isNaN(c.latitude) && !isNaN(c.longitude));

  // Determine Map Center & Zoom based on jurisdiction
  let center: [number, number] = [15.3173, 75.7139]; // Default Karnataka State
  let zoom = 6;

  if (validCases.length > 0) {
    const avgLat = validCases.reduce((sum, c) => sum + c.latitude, 0) / validCases.length;
    const avgLng = validCases.reduce((sum, c) => sum + c.longitude, 0) / validCases.length;
    center = [avgLat, avgLng];
    // Zoom in closer if cases are localized to a station or district
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
