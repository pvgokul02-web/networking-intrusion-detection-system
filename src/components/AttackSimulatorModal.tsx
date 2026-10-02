import React, { useState } from 'react';
import { NetworkNode, AttackType } from '../types';
import { ATTACK_METADATA } from '../utils/mlEngine';
import { Play, ShieldAlert, X, Zap, Cpu, Server, Terminal } from 'lucide-react';

interface AttackSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: NetworkNode[];
  onTriggerAttack: (config: {
    attackType: AttackType;
    targetNodeId: string;
    sourceIp: string;
    intensity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    durationSec: number;
  }) => void;
}

export const AttackSimulatorModal: React.FC<AttackSimulatorModalProps> = ({
  isOpen,
  onClose,
  nodes,
  onTriggerAttack,
}) => {
  const [selectedAttack, setSelectedAttack] = useState<AttackType>('DDOS');
  const [targetNodeId, setTargetNodeId] = useState<string>(nodes[2]?.id || nodes[0]?.id || '');
  const [sourceIp, setSourceIp] = useState<string>('185.220.101.5');
  const [intensity, setIntensity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');

  if (!isOpen) return null;

  const attackList: AttackType[] = ['DDOS', 'BRUTE_FORCE', 'RANSOMWARE', 'SQLI', 'ZERO_DAY', 'C2_BEACON'];

  const handleLaunch = () => {
    onTriggerAttack({
      attackType: selectedAttack,
      targetNodeId: targetNodeId || nodes[0]?.id || '',
      sourceIp: sourceIp || '185.220.101.5',
      intensity,
      durationSec: 15,
    });
    onClose();
  };

  const generateRandomAttackerIp = () => {
    const octet1 = [185, 198, 45, 103, 193][Math.floor(Math.random() * 5)];
    const octet2 = Math.floor(Math.random() * 255);
    const octet3 = Math.floor(Math.random() * 255);
    const octet4 = Math.floor(Math.random() * 250) + 1;
    setSourceIp(`${octet1}.${octet2}.${octet3}.${octet4}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Cyber Attack Injection Range</h3>
              <p className="text-xs text-slate-400">Simulate malicious intrusions to verify real-time self-healing response</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Attack Vector Selection */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
              Select Attack Vector Type:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {attackList.map((type) => {
                const meta = ATTACK_METADATA[type];
                const isSelected = selectedAttack === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedAttack(type)}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-rose-500 bg-rose-950/30 text-rose-200 ring-1 ring-rose-500'
                        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span>{meta.name}</span>
                      <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                        Port {meta.defaultPort}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{meta.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Node & Attacker IP Config */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Node */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1 flex items-center space-x-1">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                <span>Target Victim Node:</span>
              </label>
              <select
                value={targetNodeId}
                onChange={(e) => setTargetNodeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-rose-500"
              >
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name} ({node.ip}) - Status: {node.status}
                  </option>
                ))}
              </select>
            </div>

            {/* Attacker Source IP */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1 flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Terminal className="w-3.5 h-3.5 text-rose-400" />
                  <span>Attacker Source IP:</span>
                </span>
                <button
                  type="button"
                  onClick={generateRandomAttackerIp}
                  className="text-[10px] text-rose-400 hover:underline"
                >
                  Generate IP
                </button>
              </label>
              <input
                type="text"
                value={sourceIp}
                onChange={(e) => setSourceIp(e.target.value)}
                placeholder="e.g. 185.220.101.5"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Intensity Selection */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-2 flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Attack Traffic Burst Rate:</span>
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs font-mono">
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setIntensity(lvl)}
                  className={`py-2 rounded-lg border text-center font-bold transition-colors ${
                    intensity === lvl
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLaunch}
            className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-rose-950 transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Simulated Attack</span>
          </button>
        </div>
      </div>
    </div>
  );
};
