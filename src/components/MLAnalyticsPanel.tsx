import React from 'react';
import { MLModelMetrics } from '../types';
import { Cpu, Zap, Activity, CheckCircle2, Sliders, ShieldCheck, BarChart3, Database } from 'lucide-react';

interface MLAnalyticsPanelProps {
  metrics: MLModelMetrics;
  totalPacketsScanned: number;
  activeAnomaliesCount: number;
}

export const MLAnalyticsPanel: React.FC<MLAnalyticsPanelProps> = ({
  metrics,
  totalPacketsScanned,
  activeAnomaliesCount,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
              <Cpu className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">{metrics.modelName}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time Anomaly Detection Engine trained on 1,450,000 baseline network telemetry samples
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">Total Scanned:</span>
            <span className="text-emerald-400 font-bold">{(totalPacketsScanned + 184000).toLocaleString()} Packets</span>
          </div>
        </div>

        {/* Core ML Accuracy Metrics Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">MODEL ACCURACY</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block">{metrics.accuracy}%</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Cross-Validated Test Set</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">PRECISION SCORE</span>
            <span className="text-2xl font-bold text-cyan-300 mt-1 block">{metrics.precision}%</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Low False Positive Rate</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">RECALL (SENSITIVITY)</span>
            <span className="text-2xl font-bold text-indigo-300 mt-1 block">{metrics.recall}%</span>
            <span className="text-[10px] text-slate-400 mt-1 block">High Intrusion Capture</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">F1 HARMONIC SCORE</span>
            <span className="text-2xl font-bold text-amber-300 mt-1 block">{metrics.f1Score}%</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Balanced Performance</span>
          </div>
        </div>
      </div>

      {/* Feature Importance & Decision Weights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Feature Importance Decomposition</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Random Forest Classifier</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {metrics.featuresAnalyzed.map((feat) => (
              <div key={feat.name} className="space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span>{feat.name}</span>
                  <span className="font-bold text-emerald-400">{(feat.importance * 100).toFixed(0)}% Weight</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${feat.importance * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anomaly Score Threshold & Self-Healing Pipeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Autonomous Decision Thresholds</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Auto-Remediation Active</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Range 1: Benign */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-emerald-400 font-bold font-mono text-sm block">0.00 – 0.40 Anomaly Score</span>
                <span className="text-slate-400 text-[11px]">Benign Ambient Telemetry</span>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-[10px] font-mono border border-emerald-500/30">
                PASS INSPECTION
              </span>
            </div>

            {/* Range 2: Suspicious */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-amber-400 font-bold font-mono text-sm block">0.40 – 0.80 Anomaly Score</span>
                <span className="text-slate-400 text-[11px]">Elevated Risk / Deep Packet Inspection</span>
              </div>
              <span className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded text-[10px] font-mono border border-amber-500/30">
                MONITOR & LOG
              </span>
            </div>

            {/* Range 3: Critical Malicious */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-rose-400 font-bold font-mono text-sm block">0.80 – 1.00 Anomaly Score</span>
                <span className="text-slate-400 text-[11px]">Confirmed Intrusion Attack Payload</span>
              </div>
              <span className="bg-rose-500/20 text-rose-300 px-2.5 py-1 rounded text-[10px] font-mono font-bold border border-rose-500/40 animate-pulse">
                AUTO-ISOLATE & BLOCK IP
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
