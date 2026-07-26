import React, { useEffect, useState } from 'react';
import { kspApi } from '../../services/api/kspApi';
import { RefreshCw } from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        setLoading(true);
        const res = await kspApi.getAuditTrail();
        setAuditLogs(res.auditLogs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudit();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px] text-xs text-[var(--text-muted)]">
        <RefreshCw className="w-4 h-4 animate-spin text-blue-600 mr-2" />
        Retrieving SCRB Audit Logs & Explainability Trails...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h2 className="text-base font-medium text-[var(--text-primary)]">Explainable AI & Immutable Audit Logs</h2>
          <p className="text-xs text-[var(--text-muted)]">Complete transparency into natural language query conversion, tables accessed, and RBAC roles</p>
        </div>
      </div>

      <div className="p-6 rounded-xl border bg-[var(--surface)] shadow-sm space-y-4" style={{ borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b text-[var(--text-muted)] font-medium" style={{ borderColor: 'var(--border)' }}>
                <th className="pb-3 pr-4">Log ID</th>
                <th className="pb-3 px-4">Timestamp</th>
                <th className="pb-3 px-4">User Role</th>
                <th className="pb-3 px-4">Natural Language Query</th>
                <th className="pb-3 px-4">Tables Accessed</th>
                <th className="pb-3 px-4">Execution Time</th>
                <th className="pb-3 pl-4 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {auditLogs.map((log: any) => (
                <tr key={log.LogID} className="hover:bg-[var(--surface-hover)] transition-colors">
                  <td className="py-3 pr-4 font-mono font-medium text-blue-600">{log.LogID}</td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">{log.Timestamp}</td>
                  <td className="py-3 px-4 text-[var(--text-primary)] font-medium">{log.UserRole}</td>
                  <td className="py-3 px-4 text-[var(--text-primary)]">{log.Query}</td>
                  <td className="py-3 px-4 text-xs">
                    <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                      {log.TablesQueried}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[var(--text-muted)]">{log.ExecutionTimeMs} ms</td>
                  <td className="py-3 pl-4 text-right">
                    <span className="px-2 py-0.5 rounded font-medium bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {Math.round(log.Confidence * 100)}%
                    </span>
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
