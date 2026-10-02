import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, RefreshCw, Terminal, Cpu, Database, Check, ShieldAlert, Layers } from 'lucide-react';

interface CSVLogViewerProps {}

export const CSVLogViewer: React.FC<CSVLogViewerProps> = () => {
  const [activeCsv, setActiveCsv] = useState<'attack_logs' | 'traffic_stats'>('attack_logs');
  const [csvContent, setCsvContent] = useState<string>('');
  const [scapyStatus, setScapyStatus] = useState<any>(null);
  const [techStack, setTechStack] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchCsvData = async () => {
    setLoading(true);
    try {
      const endpoint = activeCsv === 'attack_logs' ? '/api/logs/csv' : '/api/traffic/csv';
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success) {
        setCsvContent(data.content);
      }
    } catch (err) {
      console.error('Error fetching CSV from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackendMetadata = async () => {
    try {
      const scapyRes = await fetch('/api/scapy/status');
      const scapyData = await scapyRes.json();
      setScapyStatus(scapyData);

      const stackRes = await fetch('/api/tech-stack');
      const stackData = await stackRes.json();
      setTechStack(stackData);
    } catch (err) {
      console.error('Error fetching backend metadata:', err);
    }
  };

  useEffect(() => {
    fetchCsvData();
    fetchBackendMetadata();
  }, [activeCsv]);

  const handleDownloadCsv = () => {
    const filename = activeCsv === 'attack_logs' ? 'attack_logs.csv' : 'traffic_statistics.csv';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseCsvLines = (raw: string) => {
    return raw.trim().split('\n').map((line) => line.split(','));
  };

  const parsed = parseCsvLines(csvContent);
  const headers = parsed[0] || [];
  const rows = parsed.slice(1);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Technology Stack Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                Backend Storage & Technology Stack Logs
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Direct integration with <code className="text-cyan-300 font-mono">/backend/storage/*.csv</code> files and Python runtime scripts
              </p>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Sniffer:</span>
              <span className="text-emerald-300 font-bold">Scapy & Npcap</span>
            </div>

            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-400">ML Engine:</span>
              <span className="text-purple-300 font-bold">XGBoost (Python)</span>
            </div>

            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Storage:</span>
              <span className="text-amber-300 font-bold">CSV File Storage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Tech Stack Mapping Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1 shadow-md">
          <span className="text-slate-500 text-[10px] uppercase font-sans">Network Traffic Capture</span>
          <span className="text-emerald-400 font-bold text-sm block">Scapy (Python), Npcap (Windows)</span>
          <p className="text-slate-400 text-[11px] font-sans">Live ethernet socket sniffing script: <code className="text-emerald-300">/backend/scapy_sniffer.py</code></p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1 shadow-md">
          <span className="text-slate-500 text-[10px] uppercase font-sans">Attack Simulation & Testing</span>
          <span className="text-rose-400 font-bold text-sm block">Nmap, Scapy</span>
          <p className="text-slate-400 text-[11px] font-sans">Synthetic attack packet crafter script: <code className="text-rose-300">/backend/attack_simulator.py</code></p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1 shadow-md">
          <span className="text-slate-500 text-[10px] uppercase font-sans">Backend & Processing</span>
          <span className="text-indigo-300 font-bold text-sm block">Python & Node.js Express</span>
          <p className="text-slate-400 text-[11px] font-sans">API endpoint service: <code className="text-indigo-300">/backend/api.ts</code></p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1 shadow-md">
          <span className="text-slate-500 text-[10px] uppercase font-sans">AI / ML Module</span>
          <span className="text-purple-400 font-bold text-sm block">Python with XGBoost (TensorFlow)</span>
          <p className="text-slate-400 text-[11px] font-sans">Gradient boosted tree script: <code className="text-purple-300">/backend/xgboost_model.py</code></p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1 shadow-md">
          <span className="text-slate-500 text-[10px] uppercase font-sans">Data Storage & Logging</span>
          <span className="text-amber-300 font-bold text-sm block">CSV files (attack logs & traffic)</span>
          <p className="text-slate-400 text-[11px] font-sans">Persistent storage folder: <code className="text-amber-300">/backend/storage/*.csv</code></p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1 shadow-md">
          <span className="text-slate-500 text-[10px] uppercase font-sans">Visualization & Monitoring</span>
          <span className="text-cyan-300 font-bold text-sm block">Console alerts with dashboard</span>
          <p className="text-slate-400 text-[11px] font-sans">Real-time React UI with automated self-healing</p>
        </div>
      </div>

      {/* CSV File Selection & Table Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={() => setActiveCsv('attack_logs')}
              className={`px-3.5 py-2 rounded-xl border font-bold transition-all ${
                activeCsv === 'attack_logs'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-md shadow-rose-950/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              📄 /backend/storage/attack_logs.csv
            </button>

            <button
              onClick={() => setActiveCsv('traffic_stats')}
              className={`px-3.5 py-2 rounded-xl border font-bold transition-all ${
                activeCsv === 'traffic_stats'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-950/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              📄 /backend/storage/traffic_statistics.csv
            </button>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={fetchCsvData}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh CSV</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-2 rounded-xl transition-all shadow-md shadow-emerald-950/50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV File</span>
            </button>
          </div>
        </div>

        {/* Live CSV Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold text-[11px]">
                {headers.map((h, i) => (
                  <th key={i} className="py-3 px-4 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={headers.length || 1} className="py-8 text-center text-slate-500">
                    No records found in CSV file.
                  </td>
                </tr>
              ) : (
                rows.map((row, rIndex) => (
                  <tr key={rIndex} className="hover:bg-slate-900/60 transition-colors">
                    {row.map((cell, cIndex) => (
                      <td key={cIndex} className="py-2.5 px-4 whitespace-nowrap">
                        {cell === 'CRITICAL' ? (
                          <span className="bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            CRITICAL
                          </span>
                        ) : cell === 'WARNING' ? (
                          <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            WARNING
                          </span>
                        ) : cell === 'BENIGN' ? (
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px]">
                            BENIGN
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Raw CSV Code Block */}
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
            Raw CSV File View ({activeCsv === 'attack_logs' ? 'attack_logs.csv' : 'traffic_statistics.csv'}):
          </span>
          <pre className="text-xs font-mono text-emerald-400/90 overflow-x-auto whitespace-pre p-2 bg-black/40 rounded-lg border border-slate-900">
            {csvContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
