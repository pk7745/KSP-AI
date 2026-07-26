import React, { useEffect, useState } from 'react';
import { kspApi } from '../../services/api/kspApi';
import { MapPin, TrendingUp, RefreshCw } from 'lucide-react';
import L from 'leaflet';

export const AnalyticsTrends: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await kspApi.getAnalytics();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Initialize Leaflet Map safely in React
  useEffect(() => {
    if (!data?.hotspots || data.hotspots.length === 0) return;

    const container = document.getElementById('ksp-leaflet-map');
    if (!container) return;

    // Reset container if previously initialized
    (container as any)._leaflet_id = null;

    const map = L.map('ksp-leaflet-map').setView([12.9716, 77.5946], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | KSP SCRB Data Store'
    }).addTo(map);

    // Add Hotspot Pins
    data.hotspots.forEach((h: any) => {
      if (h.lat && h.lng) {
        const markerColor = h.gravity === 'Heinous' ? '#EF4444' : '#3B82F6';
        const markerHtml = `<div style="background-color: ${markerColor}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-leaflet-marker',
          iconSize: [14, 14]
        });

        const popupContent = `
          <div style="font-family: sans-serif; font-size: 11px; padding: 4px;">
            <strong style="color: #1E40AF;">${h.crimeNo}</strong><br/>
            <b>${h.title}</b><br/>
            <span>Station: ${h.station} (${h.district})</span><br/>
            <span style="color: ${h.gravity === 'Heinous' ? 'red' : 'blue'}; font-weight: bold;">Gravity: ${h.gravity}</span>
          </div>
        `;

        L.marker([h.lat, h.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(popupContent);
      }
    });

    return () => {
      map.remove();
    };
  }, [data]);

  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px] text-xs text-[var(--text-muted)]">
        <RefreshCw className="w-4 h-4 animate-spin text-blue-600 mr-2" />
        Processing Spatial Crime Hotspots & Monthly Trends...
      </div>
    );
  }

  const { monthlyTrends } = data;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h2 className="text-base font-medium text-[var(--text-primary)]">Crime Trends & Spatial Hotspot Detection</h2>
          <p className="text-xs text-[var(--text-muted)]">Monthly aggregated crime patterns across Karnataka districts</p>
        </div>
      </div>

      {/* Top Map + Hotspot Summary Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Map Box */}
        <div className="lg:col-span-2 p-6 rounded-xl border bg-[var(--surface)] shadow-sm space-y-3" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Karnataka Spatial Crime Hotspot Map (Leaflet)
            </h3>
            <span className="text-[10px] text-[var(--text-muted)]">Red = Heinous Offence</span>
          </div>
          <div id="ksp-leaflet-map" className="h-[380px] w-full rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }} />
        </div>

        {/* Hotspot List */}
        <div className="p-6 rounded-xl border bg-[var(--surface)] shadow-sm space-y-4" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
            High Density Hotspots
          </h3>
          <div className="space-y-3">
            {data.hotspots.map((h: any) => (
              <div key={h.id} className="p-3 rounded-lg border bg-[var(--bg-primary)] text-xs space-y-1" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between font-mono font-medium">
                  <span className="text-blue-600">{h.crimeNo}</span>
                  <span className={`px-1.5 py-0.5 text-[9px] rounded font-medium ${h.gravity === 'Heinous' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {h.gravity}
                  </span>
                </div>
                <div className="font-medium text-[var(--text-primary)]">{h.title}</div>
                <div className="text-[10px] text-[var(--text-muted)]">{h.station}, {h.district}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends Table / Visual Bars */}
      <div className="p-6 rounded-xl border bg-[var(--surface)] shadow-sm space-y-4" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Monthly Trend Progression (2026 YTD)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b text-[var(--text-muted)] font-medium" style={{ borderColor: 'var(--border)' }}>
                <th className="pb-3 pr-4">Month</th>
                <th className="pb-3 px-4">Property Crime</th>
                <th className="pb-3 px-4">Violent Crime</th>
                <th className="pb-3 px-4">Cybercrime</th>
                <th className="pb-3 px-4">Narcotics / NDPS</th>
                <th className="pb-3 pl-4 text-right">Total Cases</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {monthlyTrends.map((m: any, i: number) => (
                <tr key={i} className="hover:bg-[var(--surface-hover)] transition-colors">
                  <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">{m.month}</td>
                  <td className="py-3 px-4 text-blue-600 font-medium">{m.Property}</td>
                  <td className="py-3 px-4 text-red-600 font-medium">{m.Violent}</td>
                  <td className="py-3 px-4 text-amber-600 font-medium">{m.Cyber}</td>
                  <td className="py-3 px-4 text-emerald-600 font-medium">{m.NDPS}</td>
                  <td className="py-3 pl-4 text-right font-medium text-[var(--text-primary)]">
                    {m.Property + m.Violent + m.Cyber + m.NDPS}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
