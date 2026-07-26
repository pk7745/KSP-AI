import React, { useState, useEffect } from 'react';
import { kspApi } from '../../services/api/kspApi';
import { Search, Eye, RefreshCw } from 'lucide-react';
import { CaseDetailModal } from './CaseDetailModal';

interface CasesExplorerProps {
  selectedCaseObj?: any | null;
}

export const CasesExplorer: React.FC<CasesExplorerProps> = ({ selectedCaseObj }) => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGravity, setSelectedGravity] = useState<string>('ALL');
  const [inspectCase, setInspectCase] = useState<any | null>(selectedCaseObj || null);

  useEffect(() => {
    if (selectedCaseObj) setInspectCase(selectedCaseObj);
  }, [selectedCaseObj]);

  const loadCases = async () => {
    try {
      setLoading(true);
      const res = await kspApi.getCases();
      setCases(res.cases || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      (c.CrimeNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.BriefFacts || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.DistrictName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.CrimeMajorHead || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGravity = selectedGravity === 'ALL' || c.GravityOffence === selectedGravity;

    return matchesSearch && matchesGravity;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h2 className="text-base font-medium text-[var(--text-primary)]">Cases & FIR Repository</h2>
          <p className="text-xs text-[var(--text-muted)]">Search 1100+ police stations across Karnataka</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Filter CrimeNo, District, IPC section..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs rounded-md border w-64 focus:outline-none"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="flex items-center border rounded-md p-0.5 text-xs bg-[var(--bg-primary)]" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => setSelectedGravity('ALL')}
              className={`px-3 py-1 rounded transition-colors ${selectedGravity === 'ALL' ? 'bg-blue-600 text-white font-medium' : 'text-[var(--text-secondary)]'}`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedGravity('Heinous')}
              className={`px-3 py-1 rounded transition-colors ${selectedGravity === 'Heinous' ? 'bg-red-600 text-white font-medium' : 'text-[var(--text-secondary)]'}`}
            >
              Heinous
            </button>
            <button
              onClick={() => setSelectedGravity('Non-Heinous')}
              className={`px-3 py-1 rounded transition-colors ${selectedGravity === 'Non-Heinous' ? 'bg-blue-600 text-white font-medium' : 'text-[var(--text-secondary)]'}`}
            >
              Non-Heinous
            </button>
          </div>

          <button
            onClick={loadCases}
            className="p-2 border rounded hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] text-xs"
            style={{ borderColor: 'var(--border)' }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cases Table */}
      {loading ? (
        <div className="p-8 flex items-center justify-center min-h-[300px] text-xs text-[var(--text-muted)]">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600 mr-2" />
          Loading case records...
        </div>
      ) : (
        <div className="p-6 rounded-xl border bg-[var(--surface)] shadow-sm space-y-4" style={{ borderColor: 'var(--border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b text-[var(--text-muted)] font-medium" style={{ borderColor: 'var(--border)' }}>
                  <th className="pb-3 pr-4">CrimeNo (FIR)</th>
                  <th className="pb-3 px-4">Date Registered</th>
                  <th className="pb-3 px-4">Police Station & District</th>
                  <th className="pb-3 px-4">Major Head / Minor Head</th>
                  <th className="pb-3 px-4">Gravity</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {filteredCases.map(c => (
                  <tr key={c.CaseMasterID} className="hover:bg-[var(--surface-hover)] transition-colors">
                    <td className="py-3 pr-4 font-mono font-medium text-[var(--text-primary)]">
                      {c.CrimeNo}
                    </td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">
                      {c.CrimeRegisteredDate}
                    </td>
                    <td className="py-3 px-4 text-[var(--text-primary)]">
                      <div className="font-medium">{c.PoliceStationName}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{c.DistrictName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-[var(--text-primary)]">{c.CrimeMajorHead}</div>
                      <div className="text-[10px] text-blue-600">{c.CrimeMinorHead}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                        c.GravityOffence === 'Heinous'
                          ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {c.GravityOffence}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[10px] rounded-full font-medium bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        {c.CaseStatus}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <button
                        onClick={() => setInspectCase(c)}
                        className="px-2.5 py-1 text-[11px] rounded border hover:bg-[var(--surface-hover)] transition-colors text-blue-600 font-medium flex items-center gap-1 ml-auto"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-over Detail Modal */}
      <CaseDetailModal caseObj={inspectCase} onClose={() => setInspectCase(null)} />
    </div>
  );
};
