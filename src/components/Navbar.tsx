import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
  Radio,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Layers,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';

export type TabType = 'nids' | 'topology' | 'alerts' | 'firewall' | 'csv' | 'architecture' | 'ml' | 'simulation';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  autoPilot: boolean;
  setAutoPilot: (val: boolean) => void;
  onOpenSimulator: () => void;
  onResetSystem: () => void;
  threatCount: number;
  isolatedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  autoPilot,
  setAutoPilot,
  onOpenSimulator,
  onResetSystem,
  threatCount,
  isolatedCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  AegisNIDS
                </span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  ML Self-Healing
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Autonomous Network Intrusion Detection & Remediation Engine
              </p>
            </div>
          </div>

          {/* System Status Indicators */}
          <div className="hidden lg:flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-slate-400">ML Engine:</span>
              <span className="text-emerald-400 font-semibold">Active (99.4% Acc)</span>
            </div>

            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Radio className="w-4 h-4 text-cyan-400 animate-ping" />
              <span className="text-slate-400">Packet Rate:</span>
              <span className="text-cyan-300 font-semibold">1,240 pkt/s</span>
            </div>

            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">Threats Mitigated:</span>
              <span className="text-amber-300 font-bold">{threatCount}</span>
            </div>

            {isolatedCount > 0 && (
              <div className="flex items-center space-x-2 bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-800 text-rose-300 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Isolated Nodes: {isolatedCount}</span>
              </div>
            )}
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-3">
            {/* Auto-Pilot Toggle */}
            <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <Zap className={`w-4 h-4 ${autoPilot ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
              <span className="text-xs font-medium text-slate-300 hidden md:inline">Auto-Healing:</span>
              <button
                onClick={() => setAutoPilot(!autoPilot)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoPilot ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    autoPilot ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Launch Attack Simulation Button */}
            <button
              onClick={onOpenSimulator}
              className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium px-3 py-2 rounded-lg transition-all shadow-md shadow-rose-950 hover:scale-105 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Inject Attack</span>
            </button>

            {/* Reset State Button */}
            <button
              onClick={onResetSystem}
              title="Reset topology to baseline"
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <div className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none">
          <button
            onClick={() => setActiveTab('nids')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'nids'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Real-Time NIDS (Outputs)</span>
          </button>

          <button
            onClick={() => setActiveTab('topology')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'topology'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Network Topology</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap relative ${
              activeTab === 'alerts'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Remediation & Alerts</span>
            {threatCount > 0 && (
              <span className="ml-1 bg-amber-500/20 text-amber-400 px-1.5 py-0.2 text-[10px] rounded-full border border-amber-500/30">
                {threatCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('firewall')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'firewall'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Firewall Rules (Slide 10)</span>
          </button>

          <button
            onClick={() => setActiveTab('csv')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'csv'
                ? 'bg-slate-800 text-amber-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
            <span>Backend CSV Storage (/backend)</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-slate-800 text-purple-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>System Architecture (Slides 1-6)</span>
          </button>

          <button
            onClick={() => setActiveTab('ml')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'ml'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>ML Analytics</span>
          </button>
        </div>
      </div>
    </header>
  );
};
