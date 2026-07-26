import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Shield, AlertTriangle, Radio } from 'lucide-react';
import './CommandCenterView.css';

// Fix leaflet default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function CommandCenterView() {
  const { t, i18n } = useTranslation();
  const isKn = i18n.language === 'kn';
  
  const blrCenter: [number, number] = [12.9716, 77.5946];

  // Mock live data
  const incidents = [
    { id: 1, pos: [12.9816, 77.5946], type: isKn ? 'ಹಲ್ಲೆ ಪ್ರಕರಣ' : 'Assault', status: 'Active', time: isKn ? '೨ ನಿಮಿಷದ ಹಿಂದೆ' : '2m ago' },
    { id: 2, pos: [12.9616, 77.6146], type: isKn ? 'ವಾಹನ ಕಳವು' : 'Vehicle Theft', status: 'Dispatched', time: isKn ? '೫ ನಿಮಿಷದ ಹಿಂದೆ' : '5m ago' },
  ];

  const units = [
    { id: 'H-102', pos: [12.9756, 77.6046], status: 'EnRoute' },
    { id: 'H-44', pos: [12.9656, 77.5846], status: 'Patrolling' },
  ];

  return (
    <div className="command-center-view animate-slide-in">
      <div className="command-header">
        <div className="command-title-area">
          <h2>{t('command.title')}</h2>
          <p className="subtitle">{t('command.subtitle')}</p>
        </div>
        <div className="live-status">
          <span className="status-dot animate-pulse-glow"></span>
          <span>{t('command.liveSync')}</span>
        </div>
      </div>

      <div className="command-layout">
        <div className="command-sidebar glass-panel">
          <h3><AlertTriangle size={16} className="icon-amber" /> {t('command.activeIncidents')}</h3>
          <div className="incident-list">
            {incidents.map(inc => (
              <div key={inc.id} className="incident-card">
                <div className="incident-header">
                  <strong>{inc.type}</strong>
                  <span className="text-muted text-sm">{inc.time}</span>
                </div>
                <div className="incident-footer">
                  <span className="badge-outline">{t(`command.status${inc.status}`)}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="mt-6"><Shield size={16} className="icon-cyan" /> {t('command.activeUnits')}</h3>
          <div className="incident-list">
            {units.map(u => (
              <div key={u.id} className="incident-card">
                <div className="incident-header">
                  <strong>{t('command.unit', { id: u.id })}</strong>
                </div>
                <div className="incident-footer">
                  <span className={`badge-outline ${u.status === 'EnRoute' ? 'text-amber' : 'text-emerald'}`}>{t(`command.status${u.status}`)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="command-map glass-panel">
          <MapContainer center={blrCenter} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '12px' }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            
            {incidents.map(inc => (
              <Marker key={`inc-${inc.id}`} position={inc.pos as [number, number]} icon={customIcon}>
                <Popup>
                  <strong>{inc.type}</strong><br/>
                  Status: {t(`command.status${inc.status}`)}
                </Popup>
              </Marker>
            ))}

            {units.map(u => (
              <CircleMarker 
                key={`unit-${u.id}`} 
                center={u.pos as [number, number]} 
                radius={8} 
                pathOptions={{ color: '#06b6d4', fillColor: '#06b6d4', fillOpacity: 0.8 }}
              >
                <Popup>
                  <strong>{t('command.unit', { id: u.id })}</strong><br/>
                  Status: {t(`command.status${u.status}`)}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
