import React, { useState } from 'react';
import { NIDSAlert, ThreatAIAnalysis } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Lock,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Server,
  Terminal,
  ChevronRight,
  RefreshCw,
  X,
  FileCode,
} from 'lucide-react';

interface SelfHealingLogProps {
  alerts: NIDSAlert[];
  onIsolateNode: (nodeId: string) => void;
  onHealNode: (nodeId: string) => void;
  onUnblockIp: (ip: string) => void;
}

export const SelfHealingLog: React.FC<SelfHealingLogProps> = ({
  alerts,
  onIsolateNode,
  onHealNode,
}) => {
  const [selectedAlert, setSelectedAlert] = useState<NIDSAlert | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<ThreatAIAnalysis | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const fetchGeminiAnalysis = async (alert: NIDSAlert) => {
    setSelectedAlert(alert);
    setIsLoadingAi(true);
    setAiError(null);
    setAiAnalysis(null);

    try {
      const response = await fetch('/api/gemini/analyze-threat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attackerIp: alert.attackerIp,
          targetNodeName: alert.nodeName || 'Target Server',
          targetNodeIp: '10.0.1.10',
          attackType: alert.attackType,
          anomalyScore: (alert.mlConfidence / 100).toFixed(2),
          payloadEntropy: 7.85,
          packetRate: 38000,
          recentLogs: [
            `Detected suspicious burst from ${alert.attackerIp}`,
            `Anomaly score exceeded threshold: ${alert.mlConfidence}%`,
            `Auto-healing rule generated for ${alert.nodeName}`,
          ],
        }),
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAiAnalysis(data.analysis);
      } else {
        setAiError(data.error || 'Failed to generate AI analysis');
      }
    } catch (err: any) {
      setAiError(err?.message || 'Error connecting to Gemini API endpoint');
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Remediation & Self-Healing Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Autonomous threat detection logs, node isolation status, and server-side Gemini AI root-cause analysis.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          Total Alerts Recorded: <span className="text-emerald-400 font-bold">{alerts.length}</span>
        </div>
      </div>

      {/* Alerts Stream List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-sm font-semibold text-slate-200">No Intrusions Detected</h3>
            <p className="text-xs text-slate-500 mt-1">
              Network baseline is clean. Inject an attack from the top menu to trigger detection and auto-healing.
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Left Info Block */}
              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-100">{alert.title}</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                      {alert.severity}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{alert.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1">{alert.description}</p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-slate-400">
                    <span className="flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      <Terminal className="w-3 h-3 text-rose-400" />
                      <span>Attacker IP: <strong className="text-rose-300">{alert.attackerIp}</strong></span>
                    </span>

                    {alert.nodeName && (
                      <span className="flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        <Server className="w-3 h-3 text-emerald-400" />
                        <span>Target Node: <strong className="text-slate-200">{alert.nodeName}</strong></span>
                      </span>
                    )}

                    <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                      ML Confidence: {alert.mlConfidence}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Right */}
              <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                {/* Gemini AI Root Cause Analysis Trigger */}
                <button
                  onClick={() => fetchGeminiAnalysis(alert)}
                  className="flex items-center space-x-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Gemini AI Triage</span>
                </button>

                {/* Node Controls */}
                {alert.nodeId && (
                  <button
                    onClick={() => onHealNode(alert.nodeId!)}
                    className="flex items-center space-x-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Heal & Restore</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Gemini AI Triage Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                <h3 className="font-bold text-sm text-slate-100">
                  Gemini AI Root Cause & Playbook Triage
                </h3>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1 text-slate-400 hover:text-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto font-sans text-xs">
              {isLoadingAi ? (
                <div className="py-12 text-center text-slate-400 space-y-3">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                  <p className="font-mono text-xs">Consulting Gemini 3.6 Flash for incident analysis...</p>
                </div>
              ) : aiError ? (
                <div className="p-4 bg-rose-950/50 border border-rose-800 rounded-xl text-rose-300">
                  <p className="font-semibold">AI Analysis Unavailable</p>
                  <p className="mt-1 text-[11px] text-rose-400">{aiError}</p>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-4 text-slate-200">
                  {/* Metadata Header */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">THREAT SEVERITY</span>
                      <span className="text-rose-400 font-bold">{aiAnalysis.threatLevel}</span>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">CVE / ATT&CK ID</span>
                      <span className="text-cyan-300 font-bold">{aiAnalysis.cveEquivalent || 'ATT&CK T1498'}</span>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                      <span className="text-slate-500 block text-[10px]">ATTACK VECTOR</span>
                      <span className="text-amber-300 font-semibold truncate block">{aiAnalysis.attackVector}</span>
                    </div>
                  </div>

                  {/* Root Cause Analysis */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                    <h4 className="font-bold text-indigo-300 mb-1 flex items-center space-x-1.5">
                      <span>Technical Root Cause</span>
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{aiAnalysis.rootCause}</p>
                  </div>

                  {/* Blast Radius */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                    <h4 className="font-bold text-amber-300 mb-1">Blast Radius & Service Impact</h4>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{aiAnalysis.blastRadius}</p>
                  </div>

                  {/* Recommended Mitigation Playbook */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                    <h4 className="font-bold text-emerald-400 mb-2">Automated Self-Healing Playbook</h4>
                    <ul className="space-y-1.5 font-mono text-[11px]">
                      {aiAnalysis.recommendedPlaybook?.map((step, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Generated Firewall Rule Code */}
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono">
                    <div className="flex items-center justify-between text-slate-400 mb-1 text-[10px]">
                      <span className="flex items-center space-x-1">
                        <FileCode className="w-3 h-3 text-cyan-400" />
                        <span>Generated Security Group Rule</span>
                      </span>
                    </div>
                    <code className="text-emerald-300 bg-slate-900 p-2 rounded block text-[11px] overflow-x-auto">
                      {aiAnalysis.suggestedFirewallRule}
                    </code>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-colors"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
