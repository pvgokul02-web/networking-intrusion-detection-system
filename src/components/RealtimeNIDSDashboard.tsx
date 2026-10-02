import React, { useState, useEffect } from 'react';
import { Shield, Play, Square, AlertTriangle, CheckCircle, RefreshCw, Cpu, Activity, Zap, Layers, ArrowRight, Radio, Send, Database, Lock, Wifi, Network } from 'lucide-react';
import { NIDSAlert, AttackType } from '../types';

interface RealtimeNIDSDashboardProps {
  alerts?: NIDSAlert[];
  onTriggerAttack?: (type: AttackType) => void;
  onHealAll?: () => void;
}

export type PipelineStep = 1 | 2 | 3 | 0; // 1: Scanned Ports, 2: Detected Attacks, 3: Self Healing, 0: Normal

export const RealtimeNIDSDashboard: React.FC<RealtimeNIDSDashboardProps> = ({
  alerts = [],
  onTriggerAttack,
  onHealAll,
}) => {
  const [isDetecting, setIsDetecting] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<PipelineStep>(1); // Default to Step 1 Port Scan on load
  const [isAutoPipelineRunning, setIsAutoPipelineRunning] = useState<boolean>(false);
  const [packetsAnalyzed, setPacketsAnalyzed] = useState<number>(15432);
  const [selectedAttackType, setSelectedAttackType] = useState<AttackType>('PORTSCAN');
  const [customIp, setCustomIp] = useState<string>('185.220.101.5');
  const [activeInterface, setActiveInterface] = useState<'Ethernet (eth0)' | 'Wi-Fi (wlan0)'>('Ethernet (eth0)');
  const [lastInjectedMsg, setLastInjectedMsg] = useState<string | null>(null);

  // Real-time CICIDS 2017 Feature State (Matching Slides 7, 8, 9)
  const [features, setFeatures] = useState({
    flowDuration: 27.0,
    totalFwdPackets: 1.0,
    totalBwdPackets: 1.0,
    totalFwdLen: 0.0,
    totalBwdLen: 0.0,
    fwdLenMax: 6.0,
    fwdLenMin: 6.0,
    fwdLenMean: 6.0,
    fwdLenStd: 0.0,
    bwdLenMax: 6.0,
    bwdLenMin: 6.0,
    bwdLenMean: 6.0,
  });

  // Ticker for real-time feature monitoring
  useEffect(() => {
    if (!isDetecting) return;

    const interval = setInterval(() => {
      setPacketsAnalyzed((prev) => prev + Math.floor(Math.random() * 5) + 1);

      if (currentStep === 1) {
        // Step 1: System Ports are Scanned
        setFeatures((prev) => ({
          ...prev,
          flowDuration: Number((25.0 + Math.random() * 5).toFixed(2)),
          totalFwdPackets: Math.floor(Math.random() * 3) + 1,
          totalBwdPackets: 1.0,
          totalFwdLen: 0.0,
          totalBwdLen: 0.0,
          fwdLenMax: 6.0,
          fwdLenMin: 6.0,
          fwdLenMean: 6.0,
          fwdLenStd: 0.0,
        }));
      } else if (currentStep === 2) {
        // Step 2: Attack Detected
        setFeatures((prev) => ({
          ...prev,
          flowDuration: Number((120.0 + Math.random() * 20).toFixed(2)),
          totalFwdPackets: Math.floor(Math.random() * 50) + 20,
          totalBwdPackets: Math.floor(Math.random() * 40) + 15,
          totalFwdLen: Number((1024 + Math.random() * 500).toFixed(2)),
          totalBwdLen: Number((2048 + Math.random() * 800).toFixed(2)),
          fwdLenMax: 512.0,
          fwdLenMin: 64.0,
          fwdLenMean: 256.0,
        }));
      } else if (currentStep === 3) {
        // Step 3: Self Healing Action
        setFeatures((prev) => ({
          ...prev,
          flowDuration: Number((5.0 + Math.random() * 2).toFixed(2)),
          totalFwdPackets: 1.0,
          totalBwdPackets: 1.0,
          totalFwdLen: 0.0,
          totalBwdLen: 0.0,
          fwdLenMax: 0.0,
          fwdLenMin: 0.0,
          fwdLenMean: 0.0,
        }));
      } else {
        // Step 0: Normal Baseline
        setFeatures({
          flowDuration: Number((15.0 + Math.random() * 3).toFixed(2)),
          totalFwdPackets: 1.0,
          totalBwdPackets: 1.0,
          totalFwdLen: 0.0,
          totalBwdLen: 0.0,
          fwdLenMax: 6.0,
          fwdLenMin: 6.0,
          fwdLenMean: 6.0,
          fwdLenStd: 0.0,
          bwdLenMax: 6.0,
          bwdLenMin: 6.0,
          bwdLenMean: 6.0,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isDetecting, currentStep]);

  // Automated Step-by-Step Live Pipeline Loop
  useEffect(() => {
    if (!isAutoPipelineRunning) return;

    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    let timer3: NodeJS.Timeout;

    // Step 1: Scan Ports
    setCurrentStep(1);

    // Step 2: Detect Attack after 3.5s
    timer1 = setTimeout(() => {
      setCurrentStep(2);
    }, 3500);

    // Step 3: Self Healing Action after 7s
    timer2 = setTimeout(() => {
      setCurrentStep(3);
    }, 7000);

    // End Auto Pipeline after 10.5s
    timer3 = setTimeout(() => {
      setIsAutoPipelineRunning(false);
    }, 10500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isAutoPipelineRunning]);

  const handleRunFullPipeline = () => {
    setIsAutoPipelineRunning(true);
  };

  const handleSendSeparateAttack = async (type: AttackType) => {
    if (onTriggerAttack) {
      onTriggerAttack(type);
    }

    // Append attack event to backend CSV log storage
    try {
      await fetch('/api/logs/csv/append', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          severity: 'CRITICAL',
          attackType: type,
          netInterface: activeInterface,
          sourceIp: customIp,
          targetNode: 'Web Server Alpha',
          port: type === 'PORTSCAN' ? 80 : 443,
          anomalyScore: 0.985,
          actionTaken: 'PIPELINE_INITIATED',
        }),
      });
    } catch (err) {
      console.error('Failed to append attack to backend CSV storage:', err);
    }

    setLastInjectedMsg(`⚡ Attack '${type}' dispatched via ${activeInterface} (IP: ${customIp})! Live 3-step pipeline activated.`);
    setTimeout(() => setLastInjectedMsg(null), 4500);

    // Kickoff live 3-step pipeline automatically upon receiving attack payload
    setIsAutoPipelineRunning(true);
  };

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Top Banner - 3-Step Live Pipeline Progress Control */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>Live Sequential Step-by-Step Security Pipeline</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight mt-0.5">
              Automated Detection & Self-Healing Workflow
            </h2>
          </div>

          {/* Auto Run Full Pipeline Action Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRunFullPipeline}
              disabled={isAutoPipelineRunning}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg font-mono ${
                isAutoPipelineRunning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 cursor-wait'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20 active:scale-95'
              }`}
            >
              <Play className={`w-4 h-4 fill-current ${isAutoPipelineRunning ? 'animate-spin' : ''}`} />
              <span>
                {isAutoPipelineRunning ? 'Running Live Pipeline (Step 1 → 2 → 3)...' : '▶ Execute Live Step Pipeline'}
              </span>
            </button>
          </div>
        </div>

        {/* Step Progression Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          {/* Step 1 Pill */}
          <button
            onClick={() => {
              setIsAutoPipelineRunning(false);
              setCurrentStep(1);
            }}
            className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
              currentStep === 1
                ? 'bg-amber-500/15 border-amber-500 text-amber-200 shadow-md shadow-amber-950/50 ring-2 ring-amber-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] uppercase tracking-wider text-amber-400">
                1st: Scan Ports
              </span>
              {currentStep === 1 && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
            </div>
            <p className="text-xs font-semibold mt-1">System Ports are Scanned</p>
            <span className="text-[10px] text-slate-500 font-sans block mt-0.5">Scapy / Nmap TCP Port Probe</span>
          </button>

          {/* Step 2 Pill */}
          <button
            onClick={() => {
              setIsAutoPipelineRunning(false);
              setCurrentStep(2);
            }}
            className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
              currentStep === 2
                ? 'bg-rose-500/15 border-rose-500 text-rose-200 shadow-md shadow-rose-950/50 ring-2 ring-rose-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] uppercase tracking-wider text-rose-400">
                2nd: Detect Attacks
              </span>
              {currentStep === 2 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
            </div>
            <p className="text-xs font-semibold mt-1">Attack Detected (Bot / DDoS)</p>
            <span className="text-[10px] text-slate-500 font-sans block mt-0.5">XGBoost AI Anomaly Classifier</span>
          </button>

          {/* Step 3 Pill */}
          <button
            onClick={() => {
              setIsAutoPipelineRunning(false);
              setCurrentStep(3);
            }}
            className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
              currentStep === 3
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/50 ring-2 ring-emerald-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] uppercase tracking-wider text-emerald-400">
                3rd: Self Healing
              </span>
              {currentStep === 3 && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
            </div>
            <p className="text-xs font-semibold mt-1">SelfHealing Action Activated</p>
            <span className="text-[10px] text-slate-500 font-sans block mt-0.5">Automated Firewall IP Rules</span>
          </button>
        </div>
      </div>

      {/* Separate Attack Sender Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Separate External Attack Sender</span>
          </div>

          {/* Ethernet vs Wi-Fi Network Interface Selector */}
          <div className="flex items-center space-x-2 font-mono text-xs bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold px-2">Sniff Interface:</span>
            <button
              onClick={() => setActiveInterface('Ethernet (eth0)')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeInterface === 'Ethernet (eth0)'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Ethernet (eth0)</span>
            </button>

            <button
              onClick={() => setActiveInterface('Wi-Fi (wlan0)')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeInterface === 'Wi-Fi (wlan0)'
                  ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-950/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>Wi-Fi (wlan0)</span>
            </button>
          </div>
        </div>

        {lastInjectedMsg && (
          <div className="bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs px-4 py-2 rounded-xl font-mono animate-fade-in flex items-center justify-between">
            <span>{lastInjectedMsg}</span>
            <span className="text-[10px] text-rose-400">Logged to /backend/storage/attack_logs.csv</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          <button
            onClick={() => handleSendSeparateAttack('PORTSCAN')}
            className="flex items-center justify-center space-x-2 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-700/80 px-4 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send PortScan Attack</span>
          </button>

          <button
            onClick={() => handleSendSeparateAttack('BOT')}
            className="flex items-center justify-center space-x-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-700/80 px-4 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Botnet C2 Attack</span>
          </button>

          <button
            onClick={() => handleSendSeparateAttack('DDOS')}
            className="flex items-center justify-center space-x-2 bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-700/80 px-4 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send SYN DDoS Flood</span>
          </button>

          <button
            onClick={() => {
              setCurrentStep(0);
              if (onHealAll) onHealAll();
            }}
            className="flex items-center justify-center space-x-2 bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-700 px-4 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Reset to Baseline Normal</span>
          </button>
        </div>
      </div>

      {/* Main NIDS Presentation View (Exact Visual Match to Slide Outputs 7, 8, 9) */}
      <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Header Title Block */}
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800/80">
          <div className="p-3 bg-cyan-600 rounded-2xl text-white shadow-lg shadow-cyan-900/50">
            <Shield className="w-8 h-8 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              Real-Time Intrusion Detection System
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center space-x-2">
              <span>XGBoost-Powered Network Threat Analyzer</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-bold flex items-center space-x-1">
                {activeInterface.includes('Ethernet') ? <Network className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                <span>Captured Interface: {activeInterface}</span>
              </span>
            </p>
          </div>
        </div>

        {/* Control Panel Section */}
        <div className="bg-[#131d31] border border-slate-800 rounded-xl p-5 shadow-inner">
          <div className="text-xs font-bold text-slate-300 flex items-center space-x-2 mb-4 uppercase tracking-wider">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Control Panel</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono">
            {/* Start / Stop Detection Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsDetecting(true)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                  isDetecting
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20 ring-2 ring-emerald-400'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Detection</span>
              </button>

              <button
                onClick={() => setIsDetecting(false)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all border ${
                  !isDetecting
                    ? 'bg-slate-800 text-rose-400 border-rose-500/50'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Detection</span>
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs w-full lg:w-auto">
              <div className="bg-[#0a1120] px-4 py-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-sans">System Status</span>
                <span className={`font-bold mt-1 block ${isDetecting ? 'text-slate-200' : 'text-slate-500'}`}>
                  {isDetecting ? '● Running' : '● Stopped'}
                </span>
              </div>

              <div className="bg-[#0a1120] px-4 py-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Traffic Status</span>
                <span
                  className={`font-bold mt-1 block ${
                    currentStep === 1 || currentStep === 2 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {currentStep === 1 || currentStep === 2 ? 'O Under Attack' : 'O Normal'}
                </span>
              </div>

              <div className="bg-[#0a1120] px-4 py-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Model Confidence</span>
                <span className="text-slate-100 font-bold mt-1 block">
                  {currentStep === 2 ? '100.00%' : '96.5%'}
                </span>
              </div>

              <div className="bg-[#0a1120] px-4 py-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Packets Analyzed</span>
                <span className="text-slate-100 font-bold mt-1 block">
                  {packetsAnalyzed.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Alert Banner Output - Exact replicas of Slide 7, 8, 9 */}
        {/* Step 1 Output Banner: System Ports are Scanned */}
        {currentStep === 1 && (
          <div className="bg-[#78350f]/80 border-2 border-[#f59e0b] rounded-2xl p-5 shadow-xl text-amber-100 animate-fade-in">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 border border-amber-400/40 shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1 text-xs font-mono w-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-amber-200 font-sans tracking-tight">
                    System Ports are Scanned
                  </h3>
                  <span className="bg-amber-950/80 px-2.5 py-0.5 rounded text-[10px] border border-amber-600/50 flex items-center space-x-1 font-bold">
                    {activeInterface.includes('Ethernet') ? <Network className="w-3 h-3 text-cyan-400" /> : <Wifi className="w-3 h-3 text-purple-400" />}
                    <span>Captured on {activeInterface}</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1.5 pt-1 text-amber-200/90">
                  <p><span className="text-amber-400/80">Attack Type:</span> <strong className="text-rose-300">Port Scan</strong></p>
                  <p><span className="text-amber-400/80">Detection Time:</span> 3/22/2026, 10:06:58 PM</p>
                  <p><span className="text-amber-400/80">Network Interface:</span> <strong className="text-amber-300">{activeInterface}</strong></p>
                  <p><span className="text-amber-400/80">Scanned IP's:</span> <span className="font-bold text-amber-300">10.17.132.56, 10.98.250.78, 53.62.111.23</span></p>
                  <p className="md:col-span-2 flex items-center space-x-1">
                    <span className="text-amber-400/80">Action Taken:</span>
                    <span className="text-emerald-400 font-bold ml-1">Monitoring</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 Output Banner: Attack Detected (Bot) */}
        {currentStep === 2 && (
          <div className="bg-[#7f1d1d]/90 border-2 border-[#ef4444] rounded-2xl p-5 shadow-xl text-rose-100 animate-fade-in">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-rose-500/20 rounded-xl text-rose-400 border border-rose-400/40 shrink-0">
                <AlertTriangle className="w-6 h-6 animate-ping" />
              </div>
              <div className="space-y-1 text-xs font-mono w-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-rose-100 font-sans tracking-tight uppercase">
                    ATTACK DETECTED
                  </h3>
                  <span className="bg-rose-950/80 px-2.5 py-0.5 rounded text-[10px] border border-rose-600/50 font-bold text-rose-300 flex items-center space-x-1">
                    {activeInterface.includes('Ethernet') ? <Network className="w-3 h-3 text-cyan-400" /> : <Wifi className="w-3 h-3 text-purple-400" />}
                    <span>Captured on {activeInterface}</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1.5 pt-1 text-rose-200/90">
                  <p><span className="text-rose-400/80">Attack Type:</span> <strong className="text-white">Bot</strong></p>
                  <p><span className="text-rose-400/80">Detection Time:</span> 3/22/2026, 10:06:58 PM</p>
                  <p><span className="text-rose-400/80">Network Interface:</span> <strong className="text-rose-300">{activeInterface}</strong></p>
                  <p><span className="text-rose-400/80">Confidence:</span> <strong className="text-emerald-400">100.00%</strong></p>
                  <p className="md:col-span-2 flex items-center space-x-1">
                    <span className="text-rose-400/80">Action Taken:</span>
                    <span className="text-emerald-400 font-bold ml-1">Monitoring</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 Output Banner: SelfHealing Action is Activated */}
        {currentStep === 3 && (
          <div className="bg-[#064e3b]/90 border-2 border-[#10b981] rounded-2xl p-5 shadow-xl text-emerald-100 animate-fade-in">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-rose-500/20 rounded-xl text-rose-400 border border-rose-400/40 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-xs font-mono w-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-emerald-200 font-sans tracking-tight">
                    SelfHealing Action is Activated
                  </h3>
                  <span className="bg-emerald-950/80 px-2.5 py-0.5 rounded text-[10px] border border-emerald-500/50 text-emerald-300 font-bold flex items-center space-x-1">
                    {activeInterface.includes('Ethernet') ? <Network className="w-3 h-3 text-cyan-400" /> : <Wifi className="w-3 h-3 text-purple-400" />}
                    <span>Interface Isolated: {activeInterface}</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1.5 pt-1 text-emerald-200/90">
                  <p><span className="text-emerald-400/80">Attack Type:</span> <strong className="text-rose-300">DDoS</strong></p>
                  <p><span className="text-emerald-400/80">Action Taken Time:</span> 3/22/2026, 10:06:58 PM</p>
                  <p><span className="text-emerald-400/80">Network Interface:</span> <strong className="text-emerald-300">{activeInterface}</strong></p>
                  <p><span className="text-emerald-400/80">Blocked IP's:</span> <span className="font-bold text-rose-300">10.17.132.56, 10.98.250.78, 53.62.111.23</span></p>
                  <p className="md:col-span-2 flex items-center space-x-1">
                    <span className="text-emerald-400/80">Action Taken:</span>
                    <span className="text-emerald-400 font-bold ml-1">Firewall Rules Added & {activeInterface} Rate-Limited</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Normal Baseline Banner */}
        {currentStep === 0 && (
          <div className="bg-[#062030] border-2 border-[#0284c7] rounded-2xl p-5 shadow-xl text-cyan-100 animate-fade-in">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-400/40 shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-xs font-mono w-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-cyan-200 font-sans tracking-tight">
                    System Traffic Normal & Secure
                  </h3>
                  <span className="bg-cyan-950/80 px-2.5 py-0.5 rounded text-[10px] border border-cyan-500/50 text-cyan-300 font-bold">
                    Baseline Active
                  </span>
                </div>
                <p className="text-slate-300 font-sans text-xs mt-1">
                  XGBoost model continuous telemetry scanning online. Zero active intrusions detected in current window.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Real-Time Feature Monitoring Grid (Exact 12 Cards from Slide 7, 8, 9) */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-300 flex items-center space-x-2 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Real-Time Feature Monitoring</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono text-xs">
            {/* 1 */}
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 shadow-sm">
              <span className="text-slate-500 block text-[10px] truncate">Flow Duration</span>
              <span className="text-emerald-400 font-bold text-sm block mt-1">{features.flowDuration.toFixed(2)}</span>
            </div>

            {/* 2 */}
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 shadow-sm">
              <span className="text-slate-500 block text-[10px] truncate">Total Fwd Packets</span>
              <span className="text-cyan-300 font-bold text-sm block mt-1">{features.totalFwdPackets.toFixed(2)}</span>
            </div>

            {/* 3 */}
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 shadow-sm">
              <span className="text-slate-500 block text-[10px] truncate">Total Backward Packets</span>
              <span className="text-cyan-300 font-bold text-sm block mt-1">{features.totalBwdPackets.toFixed(2)}</span>
            </div>

            {/* 4 */}
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 shadow-sm">
              <span className="text-slate-500 block text-[10px] truncate">Total Length of Fwd Packets</span>
              <span className="text-emerald-400 font-bold text-sm block mt-1">{features.totalFwdLen.toFixed(2)}</span>
            </div>

            {/* 5 */}
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 shadow-sm">
              <span className="text-slate-500 block text-[10px] truncate">Total Length of Bwd Packets</span>
              <span className="text-emerald-400 font-bold text-sm block mt-1">{features.totalBwdLen.toFixed(2)}</span>
            </div>

            {/* 6 */}
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 shadow-sm">
              <span className="text-slate-500 block text-[10px] truncate">Fwd Packet Length Max</span>
              <span className="text-cyan-300 font-bold text-sm block mt-1">{features.fwdLenMax.toFixed(2)}</span>
            </div>

            {/* 7 */}
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 shadow-sm">
              <span className="text-slate-500 block text-[10px] truncate">Fwd Packet Length Min</span>
              <span className="text-emerald-400 font-bold text-sm block mt-1">{features.fwdLenMin.toFixed(2)}</span>
            </div>

            {/* 8 */}
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 shadow-sm">
              <span className="text-slate-500 block text-[10px] truncate">Fwd Packet Length Mean</span>
              <span className="text-emerald-400 font-bold text-sm block mt-1">{features.fwdLenMean.toFixed(2)}</span>
            </div>

            {/* 9 */}
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 shadow-sm">
              <span className="text-slate-500 block text-[10px] truncate">Fwd Packet Length Std</span>
              <span className="text-cyan-300 font-bold text-sm block mt-1">{features.fwdLenStd.toFixed(2)}</span>
            </div>

            {/* 10 */}
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 shadow-sm">
              <span className="text-slate-500 block text-[10px] truncate">Bwd Packet Length Max</span>
              <span className="text-cyan-300 font-bold text-sm block mt-1">{features.bwdLenMax.toFixed(2)}</span>
            </div>

            {/* 11 */}
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 shadow-sm">
              <span className="text-slate-500 block text-[10px] truncate">Bwd Packet Length Min</span>
              <span className="text-emerald-400 font-bold text-sm block mt-1">{features.bwdLenMin.toFixed(2)}</span>
            </div>

            {/* 12 */}
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800 shadow-sm">
              <span className="text-slate-500 block text-[10px] truncate">Bwd Packet Length Mean</span>
              <span className="text-emerald-400 font-bold text-sm block mt-1">{features.bwdLenMean.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
