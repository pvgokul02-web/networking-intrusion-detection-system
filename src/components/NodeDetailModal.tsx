import React from 'react';
import { NetworkNode } from '../types';
import {
  Server,
  X,
  Lock,
  RotateCcw,
  Cpu,
  HardDrive,
  Activity,
  Shield,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Terminal,
} from 'lucide-react';

interface NodeDetailModalProps {
  node: NetworkNode | null;
  onClose: () => void;
  onIsolateNode: (nodeId: string) => void;
  onHealNode: (nodeId: string) => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  onClose,
  onIsolateNode,
  onHealNode,
}) => {
  if (!node) return null;

  const isIsolated = node.status === 'ISOLATED';
  const isInfected = node.status === 'INFECTED';
  const isHealed = node.status === 'HEALED' || node.status === 'RECOVERING';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2.5 rounded-xl border ${
                isInfected
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : isIsolated
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}
            >
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">{node.name}</h3>
              <p className="text-xs font-mono text-slate-400">{node.ip} • MAC {node.mac}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs font-mono">
          {/* Status Banner */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              isInfected
                ? 'bg-rose-950/50 border-rose-800 text-rose-200'
                : isIsolated
                ? 'bg-amber-950/50 border-amber-800 text-amber-200'
                : 'bg-emerald-950/30 border-emerald-800 text-emerald-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              {isInfected ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-ping" />
              ) : isIsolated ? (
                <Lock className="w-4 h-4 text-amber-400" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              )}
              <span className="font-bold">STATUS: {node.status}</span>
            </div>
            {node.quarantineReason && (
              <span className="text-[10px] text-slate-300 truncate max-w-xs">{node.quarantineReason}</span>
            )}
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px]">SUBNET & VLAN</span>
              <span className="text-slate-200 font-bold text-sm block mt-0.5">{node.subnet}</span>
              <span className="text-slate-400 text-[10px]">{isIsolated ? 'Quarantined VLAN 999' : `VLAN ${node.vlan}`}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px]">THREAT SCORE</span>
              <span
                className={`font-bold text-sm block mt-0.5 ${
                  node.threatScore > 70
                    ? 'text-rose-400'
                    : node.threatScore > 30
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {node.threatScore} / 100
              </span>
              <span className="text-slate-400 text-[10px]">ML Anomaly Risk</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px]">CPU / MEMORY UTILIZATION</span>
              <span className="text-slate-200 font-bold text-sm block mt-0.5">
                {node.cpuUsage}% CPU / {node.memUsage}% RAM
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px]">TRAFFIC IN/OUT</span>
              <span className="text-slate-200 font-bold text-sm block mt-0.5">
                {node.trafficInMbps.toFixed(1)} / {node.trafficOutMbps.toFixed(1)} Mbps
              </span>
            </div>
          </div>

          {/* Open Ports & Services */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] mb-2 uppercase">Listening Network Sockets / Ports:</span>
            <div className="flex flex-wrap gap-2">
              {node.openPorts.map((port) => (
                <span key={port} className="bg-slate-900 border border-slate-700 text-cyan-300 px-2 py-1 rounded text-xs">
                  Port {port}
                </span>
              ))}
            </div>
          </div>

          {/* Golden Snapshot ID */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-500 block text-[10px]">GOLDEN RECOVERY SNAPSHOT</span>
              <span className="text-emerald-400 font-bold text-xs">{node.lastSnapshotId || 'snap-golden-baseline-v1'}</span>
            </div>
            <span className="text-[10px] text-slate-400">Read-Only Backup</span>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-200">
            Close
          </button>

          <div className="flex items-center space-x-2">
            {isIsolated ? (
              <button
                onClick={() => {
                  onHealNode(node.id);
                  onClose();
                }}
                className="flex items-center space-x-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Trigger Self-Healing Snapshot Rollback</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onIsolateNode(node.id);
                  onClose();
                }}
                className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg"
              >
                <Lock className="w-4 h-4" />
                <span>Isolate & Quarantine Node</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
