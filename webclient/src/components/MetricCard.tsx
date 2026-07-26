import React from 'react';
import type { LucideIcon } from 'lucide-react';
import './MetricCard.css';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number; // Positive is up, negative is down
  icon: LucideIcon;
  color?: 'cyan' | 'crimson' | 'emerald' | 'amber' | 'indigo';
}

export function MetricCard({ title, value, subtitle, trend, icon: Icon, color = 'cyan' }: MetricCardProps) {
  return (
    <div className={`metric-card wireframe-box registration-mark theme-${color}`}>
      <div className="metric-header">
        <div className="metric-icon-wrapper">
          <Icon size={24} className="metric-icon" />
        </div>
        {trend !== undefined && (
          <div className={`metric-trend ${trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-neutral'}`}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '-'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div className="metric-content">
        <h3>{value}</h3>
        <p className="metric-title">{title}</p>
        {subtitle && <p className="metric-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
