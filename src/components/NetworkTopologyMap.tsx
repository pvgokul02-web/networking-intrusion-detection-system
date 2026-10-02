import React, { useState, useEffect } from 'react';
import { NetworkNode, NetworkPacket } from '../types';
import {
  Server,
  Database,
  Shield,
  Laptop,
  Radio,
  Globe,
  Lock,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Wifi,
  HardDrive,
  Zap,
} from 'lucide-react';

interface NetworkTopologyMapProps {
  nodes: NetworkNode[];
  packets: NetworkPacket[];
  onSelectNode: (node: NetworkNode) => void;
  onIsolateNode: (nodeId: string) => void;
  onHealNode: (nodeId: string) => void;
}

export const NetworkTopologyMap: React.FC<NetworkTopologyMapProps> = ({
  nodes,
  packets,
  onSelectNode,
  onIsolateNode,
  onHealNode,
}) => {
  const [selectedSubnet, setSelectedSubnet] = useState<string>('ALL');

  // Helper to render node icons according to node type
  const getNodeIcon = (type: string, status: string) => {
    const isIsolated = status === 'ISOLATED';
    const isInfected = status === 'INFECTED';

    if (isIsolated) return <Lock className="w-5 h-5 text-amber-400 animate-bounce" />;
    if (isInfected) return <AlertTriangle className="w-5 h-5 text-rose-400 animate-ping" />;

    switch (type) {
      case 'FIREWALL':
        return <Shield className="w-5 h-5 text-indigo-400" />;
      case 'ROUTER':
        return <Globe className="w-5 h-5 text-cyan-400" />;
      case 'WEB_SERVER':
        return <Server className="w-5 h-5 text-emerald-400" />;
      case 'DATABASE':
        return <Database className="w-5 h-5 text-purple-400" />;
      case 'API_GATEWAY':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'AUTH_SERVER':
        return <Lock className="w-5 h-5 text-blue-400" />;
      case 'WORKSTATION':
        return <Laptop className="w-5 h-5 text-teal-400" />;
      case 'IOT_DEVICE':
        return <Radio className="w-5 h-5 text-fuchsia-400" />;
      default:
        return <HardDrive className="w-5 h-5 text-slate-400" />;
    }
  };

  // Status color styles
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>HEALTHY</span>
          </span>
        );
      case 'SUSPICIOUS':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>SUSPICIOUS</span>
          </span>
        );
      case 'INFECTED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>INFECTED</span>
          </span>
        );
      case 'ISOLATED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-600/60 shadow-sm">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>QUARANTINED</span>
          </span>
        );
      case 'HEALED':
      case 'RECOVERING':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <RotateCcw className="w-3 h-3 text-cyan-400 animate-spin" />
            <span>SELF-HEALING</span>
          </span>
        );
      default:
        return null;
    }
  };

  const filteredNodes = selectedSubnet === 'ALL' ? nodes : nodes.filter((n) => n.subnet === selectedSubnet);

  const subnets = Array.from(new Set(nodes.map((n) => n.subnet)));

  return (
    <div className="space-y-6">
      {/* Top Topology Controls & Stats Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center space-x-2">
            <Wifi className="w-5 h-5 text-emerald-400" />
            <span>Live Network Infrastructure & Isolation Topology</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time node telemetry, active packets, and autonomous quarantine status. Click any node to inspect or remediate.
          </p>
        </div>

        {/* Subnet Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-mono">Filter Subnet:</span>
          <select
            value={selectedSubnet}
            onChange={(e) => setSelectedSubnet(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-mono"
          >
            <option value="ALL">All Subnets ({nodes.length} Nodes)</option>
            {subnets.map((subnet) => (
              <option key={subnet} value={subnet}>
                Subnet {subnet}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Network Topology Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNodes.map((node) => {
          const isIsolated = node.status === 'ISOLATED';
          const isInfected = node.status === 'INFECTED';
          const isHealed = node.status === 'HEALED' || node.status === 'RECOVERING';

          let borderStyle = 'border-slate-800 hover:border-slate-700 bg-slate-900/90';
          if (isInfected) borderStyle = 'border-rose-500/80 bg-rose-950/20 shadow-lg shadow-rose-950/50 animate-pulse';
          if (isIsolated) borderStyle = 'border-amber-500/80 bg-amber-950/20 shadow-lg shadow-amber-950/30';
          if (isHealed) borderStyle = 'border-cyan-500/80 bg-cyan-950/20';

          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node)}
              className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer relative overflow-hidden group ${borderStyle}`}
            >
              {/* Top Accent Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isInfected
                    ? 'bg-rose-500'
                    : isIsolated
                    ? 'bg-amber-500'
                    : isHealed
                    ? 'bg-cyan-400'
                    : 'bg-emerald-500/50 group-hover:bg-emerald-400'
                }`}
              />

              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isInfected
                        ? 'bg-rose-500/20 border-rose-500/40'
                        : isIsolated
                        ? 'bg-amber-500/20 border-amber-500/40'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  >
                    {getNodeIcon(node.type, node.status)}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
                      {node.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-400">{node.ip}</p>
                  </div>
                </div>

                {getStatusBadge(node.status)}
              </div>

              {/* Node Telemetry Snapshot */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <div>
                  <span className="text-slate-500 block text-[10px]">CPU Usage:</span>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <Cpu className="w-3 h-3 text-slate-400" />
                    <span className={node.cpuUsage > 80 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                      {node.cpuUsage}%
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Threat Score:</span>
                  <span
                    className={`font-bold ${
                      node.threatScore > 70
                        ? 'text-rose-400'
                        : node.threatScore > 30
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {node.threatScore}/100
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">In / Out Traffic:</span>
                  <span className="text-slate-300 text-[11px]">
                    {node.trafficInMbps.toFixed(1)} / {node.trafficOutMbps.toFixed(1)} Mbps
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px]">Subnet VLAN:</span>
                  <span className="text-slate-300 text-[11px]">
                    {isIsolated ? 'VLAN 999 (Isolated)' : `VLAN ${node.vlan}`}
                  </span>
                </div>
              </div>

              {/* Isolation Banner if Quarantined */}
              {isIsolated && (
                <div className="mt-3 p-2 bg-amber-950/80 border border-amber-700/60 rounded-lg text-amber-200 text-xs flex items-center justify-between">
                  <span className="text-[11px] truncate mr-2">🔒 Isolated at {node.isolatedAt}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onHealNode(node.id);
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold px-2 py-1 rounded transition-colors whitespace-nowrap"
                  >
                    Trigger Healing
                  </button>
                </div>
              )}

              {/* Action Buttons if Infected */}
              {isInfected && (
                <div className="mt-3 p-2 bg-rose-950/80 border border-rose-700/60 rounded-lg text-rose-200 text-xs flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-rose-300 animate-pulse">
                    ⚠️ Attack Payload Detected
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onIsolateNode(node.id);
                    }}
                    className="bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold px-2 py-1 rounded transition-colors whitespace-nowrap shadow-md"
                  >
                    Isolate Node Now
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Packet Monitor Stream Footer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Real-time Ingress/Egress Packet Stream</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Showing last {packets.slice(0, 5).length} packets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="pb-2">Time</th>
                <th className="pb-2">Source IP</th>
                <th className="pb-2">Target IP</th>
                <th className="pb-2">Port</th>
                <th className="pb-2">Entropy</th>
                <th className="pb-2">ML Anomaly Score</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {packets.slice(0, 5).map((pkt) => (
                <tr key={pkt.id} className="hover:bg-slate-800/40">
                  <td className="py-2 text-slate-400">{pkt.timestamp}</td>
                  <td className="py-2 text-slate-200 font-semibold">{pkt.sourceIp}</td>
                  <td className="py-2 text-slate-300">{pkt.destIp}</td>
                  <td className="py-2 text-cyan-300">:{pkt.destPort}</td>
                  <td className="py-2 text-slate-300">
                    <span className={pkt.entropy > 6.0 ? 'text-amber-400 font-bold' : ''}>
                      {pkt.entropy}
                    </span>
                  </td>
                  <td className="py-2">
                    <span
                      className={`font-bold ${
                        pkt.anomalyScore > 0.8
                          ? 'text-rose-400'
                          : pkt.anomalyScore > 0.4
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {(pkt.anomalyScore * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-2">
                    {pkt.anomalyScore > 0.8 ? (
                      <span className="text-rose-400 bg-rose-500/10 border border-rose-500/30 px-1.5 py-0.5 rounded text-[10px]">
                        BLOCKED / DROPPED
                      </span>
                    ) : (
                      <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[10px]">
                        INSPECTED (PASS)
                      </span>
                    )}
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
