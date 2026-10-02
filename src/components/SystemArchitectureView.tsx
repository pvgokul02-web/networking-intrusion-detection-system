import React from 'react';
import {
  Network,
  Cpu,
  ShieldCheck,
  Database,
  ArrowRight,
  Terminal,
  Activity,
  Zap,
  Lock,
  Layers,
  FileSpreadsheet,
  Monitor,
  CheckCircle2,
} from 'lucide-react';

export const SystemArchitectureView: React.FC = () => {
  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
              <Layers className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">System Architecture & Technical Specifications</h2>
              <p className="text-xs text-slate-400 mt-1">
                Full-stack network packet sniffing, XGBoost classification, and self-healing response workflow
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs font-mono">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Dataset:</span>
            <span className="text-purple-300 font-bold">CICIDS 2017 (55,423 Rows)</span>
          </div>
        </div>
      </div>

      {/* Slide 1: System Architecture Diagram Flowchart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <span>System Architecture Workflow Diagram</span>
          </h3>
          <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-md border border-purple-800">
            Slide 1 Reference
          </span>
        </div>

        {/* Interactive Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Box 1 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2 relative group hover:border-cyan-500 transition-all">
            <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-200">Network Traffic</h4>
            <p className="text-[11px] font-mono text-slate-400">(Packets)</p>
          </div>

          {/* Box 2 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2 relative group hover:border-cyan-500 transition-all">
            <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Terminal className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-200">Traffic Capture</h4>
            <p className="text-[11px] font-mono text-slate-400">(Packet Sniffer - Scapy)</p>
          </div>

          {/* Box 3 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2 relative group hover:border-cyan-500 transition-all">
            <div className="w-10 h-10 mx-auto rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-200">Feature Extraction</h4>
            <p className="text-[11px] font-mono text-slate-400">(Protocol, PORT, Flow Duration)</p>
          </div>

          {/* Box 4 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2 relative group hover:border-cyan-500 transition-all">
            <div className="w-10 h-10 mx-auto rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-200">Intrusion Detection</h4>
            <p className="text-[11px] font-mono text-slate-400">(DoS, DDoS, Port Scan, Bot)</p>
          </div>
        </div>

        {/* Branching Engine & Self Healing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* ML Engine */}
          <div className="bg-slate-950 p-5 rounded-2xl border-2 border-purple-500/40 space-y-3 shadow-lg">
            <div className="flex items-center space-x-2 text-purple-300 font-bold text-sm">
              <Cpu className="w-5 h-5 text-purple-400" />
              <span>Machine Learning Engine</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono list-disc list-inside">
              <li>XGBoost Classifier with Gradient Boosting</li>
              <li>Real-time Anomaly Detection Probability</li>
              <li>Multi-class Attack Classification</li>
            </ul>
          </div>

          {/* Self Healing Response */}
          <div className="bg-slate-950 p-5 rounded-2xl border-2 border-emerald-500/40 space-y-3 shadow-lg">
            <div className="flex items-center space-x-2 text-emerald-300 font-bold text-sm">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>Self Healing Response</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono list-disc list-inside">
              <li>Block Malicious Source IPs in Firewall</li>
              <li>Dynamic Rate Limiting & Traffic Drops</li>
              <li>System Recovery & Golden Baseline Snapshots</li>
            </ul>
          </div>
        </div>

        {/* Logging & Monitoring Box */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center font-mono text-xs text-slate-300">
          <span className="font-bold text-cyan-300 block mb-1">Network Monitoring & Logging</span>
          <span>Real-time Console Alerts • CSV Attack Log Data Storage • Live Dashboard Integration</span>
        </div>
      </div>

      {/* Slide 2: Technology Stack Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <span>Technology Stack Specifications</span>
          </h3>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-800">
            Slide 2 Reference
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block">NETWORK TRAFFIC CAPTURE</span>
            <span className="text-emerald-400 font-bold text-sm block">Scapy (Python) / Npcap</span>
            <p className="text-slate-400 text-[11px] font-sans">Live interface packet sniffing on Ethernet, Wi-Fi, USB</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block">ATTACK SIMULATION & TESTING</span>
            <span className="text-rose-400 font-bold text-sm block">Nmap & Scapy Packet Crafter</span>
            <p className="text-slate-400 text-[11px] font-sans">PortScan, DDoS SYN floods, Botnet traffic generation</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block">BACKEND & PROCESSING</span>
            <span className="text-indigo-300 font-bold text-sm block">Python Runtime / Node.js</span>
            <p className="text-slate-400 text-[11px] font-sans">High-performance packet window buffering</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block">AI / ML MODULE</span>
            <span className="text-purple-400 font-bold text-sm block">XGBoost & TensorFlow</span>
            <p className="text-slate-400 text-[11px] font-sans">Gradient boosted decision trees for anomaly detection</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block">DATA STORAGE & LOGGING</span>
            <span className="text-cyan-300 font-bold text-sm block">CSV Files & Log Stream</span>
            <p className="text-slate-400 text-[11px] font-sans">Structured attack logs & traffic statistics persistence</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] block">VISUALIZATION & MONITORING</span>
            <span className="text-amber-300 font-bold text-sm block">React Dashboard & Console</span>
            <p className="text-slate-400 text-[11px] font-sans">Real-time alerts, firewall rule management UI</p>
          </div>
        </div>
      </div>

      {/* Slide 3, 4, 5, 6: Modules Details & Dataset Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Dataset Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-purple-400" />
              <span>CICIDS 2017 Dataset Split</span>
            </h3>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
              Slide 3
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Benchmark intrusion detection dataset created by the Canadian Institute for Cybersecurity (UNB).
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Total Dataset Size:</span>
              <span className="font-bold text-purple-300 text-sm">55,423 Records</span>
            </div>

            <div className="space-y-2 pt-1">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Training Set (70%)</span>
                  <span className="text-emerald-400 font-bold">38,796 samples</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[70%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Testing Set (15%)</span>
                  <span className="text-cyan-400 font-bold">8,313 samples</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full w-[15%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Validation Set (15%)</span>
                  <span className="text-amber-400 font-bold">8,314 samples</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[15%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Intrusion & Self Healing Rules */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Self-Healing Policy Matrix</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              Slide 6
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-rose-400 font-bold text-xs block">DoS Attack</span>
              <p className="text-slate-300 text-[11px] font-sans">
                Instantly blocks the malicious source IP and drops TCP window packets.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold text-xs block">DDoS Attack</span>
              <p className="text-slate-300 text-[11px] font-sans">
                Mitigates multi-node connection flooding by blacklisting multiple attacker IPs.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold text-xs block">Probe / PortScan Attack</span>
              <p className="text-slate-300 text-[11px] font-sans">
                Triggers Warning Alerts before full attack escalates and blocks port scanning sockets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
