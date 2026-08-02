import React, { useEffect, useState } from 'react';
import { ShieldAlert, Users, FolderOpen, Activity, Bell, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MetricCard } from '../../components/MetricCard';
import { MapWidget } from '../../components/MapWidget';
import { ChartWidget } from '../../components/ChartWidget';
import { api } from '../../services/api';
import './DashboardView.css';

const districtMapKn: Record<string, string> = {
  'All': 'ಎಲ್ಲಾ ಕರ್ನಾಟಕ',
  'Bengaluru City': 'ಬೆಂಗಳೂರು ನಗರ',
  'Mysuru City': 'ಮೈಸೂರು ನಗರ',
  'Mangaluru City': 'ಮಂಗಳೂರು ನಗರ',
  'Hubballi-Dharwad': 'ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ',
  'Belagavi': 'ಬೆಳಗಾವಿ',
  'Kalaburagi': 'ಕಲಬುರಗಿ'
};

export function DashboardView() {
  const { t, i18n } = useTranslation();
  const isKn = i18n.language === 'kn';
  const [data, setData] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liveToast, setLiveToast] = useState<{ id: string, titleKey: string, district: string } | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  const districts = ['All', 'Bengaluru City', 'Mysuru City', 'Mangaluru City', 'Hubballi-Dharwad', 'Belagavi', 'Kalaburagi'];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [dashData, analyticsData] = await Promise.all([
        api.getDashboardData(),
        api.getAnalytics()
      ]);
      setData(dashData);
      setAnalytics(analyticsData);
      setLoading(false);
    }
    fetchData();

    // Live Alert Simulation
    const mockAlerts = [
      { titleKey: "mock1", district: "Whitefield" },
      { titleKey: "mock2", district: "Koramangala" },
      { titleKey: "mock3", district: "Jayanagar" },
      { titleKey: "mock4", district: "Electronic City" }
    ];
    
    let alertIndex = 0;
    const interval = setInterval(() => {
      setLiveToast({ id: Date.now().toString(), ...mockAlerts[alertIndex] });
      alertIndex = (alertIndex + 1) % mockAlerts.length;
      
      setTimeout(() => setLiveToast(null), 5000);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !data || !analytics) {
    return <div className="loading-state">{t('dashboard.loading')}</div>;
  }

  return (
    <div className="dashboard-view animate-slide-in">
      <div className="dashboard-header">
        <div className="dashboard-title-area">
          <h2>{t('dashboard.title')}</h2>
          <p className="subtitle">{t('dashboard.subtitle')}</p>
        </div>
        <div className="live-status-indicator">
          <div className="live-dot animate-pulse-glow"></div>
          <span>{t('dashboard.liveSync')}</span>
        </div>
      </div>

      {/* District Filter */}
      <div className="district-filter-row">
        <MapPin size={16} className="icon-cyan" />
        <span className="district-filter-label">{isKn ? 'ಜಿಲ್ಲಾ ಗುಪ್ತಚರ:' : 'DISTRICT INTELLIGENCE:'}</span>
        <div className="district-chips">
          {districts.map(d => (
            <button 
              key={d}
              className={`district-chip ${selectedDistrict === d ? 'active' : ''}`}
              onClick={() => setSelectedDistrict(d)}
            >
              {isKn ? (districtMapKn[d] || d) : (d === 'All' ? 'ALL KARNATAKA' : d.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard 
          title={t('dashboard.totalCases')} 
          value={selectedDistrict === 'All' ? data.summary.totalCases : Math.floor(data.summary.totalCases * (0.15 + Math.random() * 0.25))} 
          icon={FolderOpen} 
          color="cyan"
          trend={2.4} 
        />
        <MetricCard 
          title={t('dashboard.criticalAlerts')} 
          value={selectedDistrict === 'All' ? (data.alerts ? data.alerts.length : 0) : Math.floor(Math.random() * 5 + 1)} 
          icon={ShieldAlert} 
          color="crimson" 
          trend={15.2}
        />
        <MetricCard 
          title={t('dashboard.activeInvestigations')} 
          value={selectedDistrict === 'All' ? data.summary.activeInvestigations : Math.floor(data.summary.activeInvestigations * (0.1 + Math.random() * 0.3))} 
          icon={Users} 
          color="emerald" 
          trend={-5.1}
        />
        <MetricCard 
          title={t('dashboard.heinousCrimes')} 
          value={selectedDistrict === 'All' ? data.summary.heinousCrimes : Math.floor(data.summary.heinousCrimes * (0.1 + Math.random() * 0.3))} 
          icon={Activity} 
          color="indigo" 
          trend={8.7}
        />
      </div>

      <div className="dashboard-main-grid">
        <div className="main-col-large">
          <MapWidget cases={data.recentCases} />
        </div>
        <div className="main-col-small">
          <ChartWidget 
            data={analytics.monthlyTrends} 
            title={t('dashboard.chartTitle')} 
          />
        </div>
      </div>

      {/* Live Alert Toast Container */}
      <div className={`live-toast-container ${liveToast ? 'visible' : ''}`}>
        {liveToast && (
          <div className="live-toast glass-panel">
            <div className="toast-icon pulse-red">
              <Bell size={16} />
            </div>
            <div className="toast-content">
              <strong>{t(`dashboardAlerts.${liveToast.titleKey}`)}</strong>
              <span>{t('dashboard.station')}: {liveToast.district}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
