import React, { useEffect, useState } from 'react';
import { kspApi } from '../../services/api/kspApi';
import { Zap, RefreshCw } from 'lucide-react';

export const PredictiveAlerts: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictive = async () => {
      try {
        setLoading(true);
        const res = await kspApi.getPredictiveWarnings();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPredictive();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px] text-xs text-[var(--text-muted)]">
        <RefreshCw className="w-4 h-4 animate-spin text-blue-600 mr-2" />
        Running Early Warning Predictive Spatial Models...
      </div>
    );
  }

  const { earlyWarnings, meta } = data;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h2 className="text-base font-medium text-[var(--text-primary)]">Predictive Analytics & Early Warning Cards</h2>
          <p className="text-xs text-[var(--text-muted)]">Proactive risk projection and actionable police prevention intelligence</p>
        </div>

        <span className="px-2.5 py-1 text-xs rounded border bg-[var(--bg-primary)] font-mono text-[var(--text-muted)]" style={{ borderColor: 'var(--border)' }}>
          Model: {meta.algorithm}
        </span>
      </div>

      {/* Warning Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {earlyWarnings.map((w: any) => (
          <div
            key={w.id}
            className="p-6 rounded-xl border bg-[var(--surface)] shadow-sm space-y-4 flex flex-col justify-between"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 text-[10px] rounded-full font-medium ${
                  w.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-amber-100 text-amber-800'
                }`}>
                  {w.riskLevel} Risk Project ({w.probabilityScore})
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">{w.id}</span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[var(--text-primary)]">{w.crimeCategory}</h3>
                <p className="text-xs text-blue-600 font-medium">{w.district}</p>
              </div>

              <div className="p-3 rounded-lg border bg-[var(--bg-primary)] space-y-1 text-xs" style={{ borderColor: 'var(--border)' }}>
                <div className="text-[10px] text-[var(--text-muted)] uppercase">Spatial Rationale & Pattern</div>
                <p className="text-[var(--text-secondary)] leading-relaxed">{w.rationale}</p>
              </div>
            </div>

            <div className="pt-3 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
              <div className="text-[10px] uppercase font-medium text-emerald-600 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Recommended Police Action:
              </div>
              <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed">
                {w.recommendedAction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
