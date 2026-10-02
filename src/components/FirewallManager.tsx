import React, { useState } from 'react';
import { FirewallRule } from '../types';
import {
  SlidersHorizontal,
  Plus,
  Trash2,
  Lock,
  CheckCircle,
  Download,
  Terminal,
  Sparkles,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';

interface FirewallManagerProps {
  rules: FirewallRule[];
  onAddRule: (rule: Omit<FirewallRule, 'id' | 'createdAt' | 'hitCount'>) => void;
  onToggleRuleStatus: (ruleId: string) => void;
  onDeleteRule: (ruleId: string) => void;
}

export const FirewallManager: React.FC<FirewallManagerProps> = ({
  rules,
  onAddRule,
  onToggleRuleStatus,
  onDeleteRule,
}) => {
  const [viewMode, setViewMode] = useState<'slide10' | 'advanced'>('slide10');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [explainedRule, setExplainedRule] = useState<FirewallRule | null>(null);
  const [ruleExplanation, setRuleExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // New rule form state
  const [newRuleName, setNewRuleName] = useState('');
  const [newIp, setNewIp] = useState('');
  const [newPort, setNewPort] = useState('*');
  const [newAction, setNewAction] = useState<'BLOCK' | 'ALLOW' | 'QUARANTINE'>('BLOCK');
  const [newReason, setNewReason] = useState('Manual administrative security policy rule');

  const filteredRules = rules.filter(
    (r) =>
      r.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sourceIp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp) return;

    onAddRule({
      ruleName: newRuleName || `Block ${newIp}`,
      action: newAction,
      sourceIp: newIp.includes('/') ? newIp : `${newIp}/32`,
      destPort: newPort,
      protocol: 'ALL',
      reason: newReason,
      autoCreated: false,
      status: 'ACTIVE',
    });

    setShowAddModal(false);
    setNewRuleName('');
    setNewIp('');
  };

  const handleExplainRule = async (rule: FirewallRule) => {
    setExplainedRule(rule);
    setIsExplaining(true);
    setRuleExplanation(null);

    try {
      const res = await fetch('/api/gemini/explain-rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rule }),
      });
      const data = await res.json();
      if (data.success) {
        setRuleExplanation(data.explanation);
      } else {
        setRuleExplanation('Failed to explain rule.');
      }
    } catch {
      setRuleExplanation('Error querying Gemini API.');
    } finally {
      setIsExplaining(false);
    }
  };

  const exportIptables = () => {
    const lines = rules.map((r) => {
      if (r.action === 'BLOCK') {
        return `iptables -A INPUT -s ${r.sourceIp} -p ${r.protocol.toLowerCase()} --dport ${r.destPort} -j DROP -m comment --comment "${r.ruleName}"`;
      }
      return `iptables -A INPUT -s ${r.sourceIp} -j ACCEPT`;
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nids_firewall_rules.sh';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
            <span>Dynamic Firewall & IP Blocklist Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-generated security policies derived from ML threat detection and live network traffic drops.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportIptables}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export iptables</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Firewall Rule</span>
          </button>
        </div>
      </div>

      {/* View Mode Toggle Bar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('slide10')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              viewMode === 'slide10'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            System Firewall Rules (Slide 10 View)
          </button>
          <button
            onClick={() => setViewMode('advanced')}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              viewMode === 'advanced'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500 font-bold'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            ML Policy Manager
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          {viewMode === 'slide10' ? 'Exact Windows Defender / NIDS Firewall output table' : 'Advanced IP block list & Gemini analysis'}
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400 ml-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by rule name, IP address, or block reason..."
          className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full font-mono"
        />
      </div>

      {/* Slide 10 Exact Windows Defender View */}
      {viewMode === 'slide10' ? (
        <div className="bg-white text-slate-900 rounded-xl overflow-hidden shadow-2xl font-sans border border-slate-300">
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-300 flex items-center justify-between text-xs text-slate-700 font-semibold">
            <span>Dynamic Firewall Rule Enforcement</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono border border-emerald-300">
              Active Monitoring
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
                  <th className="py-2.5 px-4">Name</th>
                  <th className="py-2.5 px-4">Profile</th>
                  <th className="py-2.5 px-4">Enabled</th>
                  <th className="py-2.5 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-4 flex items-center space-x-2 font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>Microsoft Office Outlook</span>
                  </td>
                  <td className="py-2 px-4 text-slate-600">Public</td>
                  <td className="py-2 px-4 text-slate-600">Yes</td>
                  <td className="py-2 px-4 text-emerald-700 font-semibold">Allow</td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-4 flex items-center space-x-2 font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>mysqld</span>
                  </td>
                  <td className="py-2 px-4 text-slate-600">Public</td>
                  <td className="py-2 px-4 text-slate-600">Yes</td>
                  <td className="py-2 px-4 text-emerald-700 font-semibold">Allow</td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-4 flex items-center space-x-2 font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>mysqld</span>
                  </td>
                  <td className="py-2 px-4 text-slate-600">Public</td>
                  <td className="py-2 px-4 text-slate-600">Yes</td>
                  <td className="py-2 px-4 text-emerald-700 font-semibold">Allow</td>
                </tr>

                {/* SLIDE 10 FEATURED BLOCK RULE */}
                <tr className="bg-[#0284c7] text-white font-bold animate-pulse">
                  <td className="py-2.5 px-4 flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold">🚫</span>
                    <span>NIDS_Block_10.17.132.78</span>
                  </td>
                  <td className="py-2.5 px-4 text-sky-100">All</td>
                  <td className="py-2.5 px-4 text-sky-100">Yes</td>
                  <td className="py-2.5 px-4 text-white bg-rose-700 px-2 rounded text-center">Block</td>
                </tr>

                {/* Additional Block Rules from Active NIDS */}
                {rules.filter(r => r.action === 'BLOCK').map((r) => (
                  <tr key={r.id} className="bg-rose-50 border-l-4 border-rose-500">
                    <td className="py-2 px-4 flex items-center space-x-2 font-bold text-rose-900">
                      <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold">🚫</span>
                      <span>NIDS_Block_{r.sourceIp.replace('/32', '')}</span>
                    </td>
                    <td className="py-2 px-4 text-slate-700">All</td>
                    <td className="py-2 px-4 text-slate-700">Yes</td>
                    <td className="py-2 px-4 text-rose-700 font-bold">Block</td>
                  </tr>
                ))}

                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-4 flex items-center space-x-2 font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>Node.js JavaScript Runtime</span>
                  </td>
                  <td className="py-2 px-4 text-slate-600">Public</td>
                  <td className="py-2 px-4 text-slate-600">Yes</td>
                  <td className="py-2 px-4 text-emerald-700 font-semibold">Allow</td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-4 flex items-center space-x-2 font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>Node.js JavaScript Runtime</span>
                  </td>
                  <td className="py-2 px-4 text-slate-600">Public</td>
                  <td className="py-2 px-4 text-slate-600">Yes</td>
                  <td className="py-2 px-4 text-emerald-700 font-semibold">Allow</td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-4 flex items-center space-x-2 font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span>mysqld</span>
                  </td>
                  <td className="py-2 px-4 text-slate-600">Public</td>
                  <td className="py-2 px-4 text-slate-600">Yes</td>
                  <td className="py-2 px-4 text-emerald-700 font-semibold">Allow</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Advanced ML Rules Table */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono">
                <th className="py-3 px-4">Rule Name</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Source IP / CIDR</th>
                <th className="py-3 px-4">Dest Port</th>
                <th className="py-3 px-4">Hits</th>
                <th className="py-3 px-4">Origin</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{rule.ruleName}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-xs font-sans mt-0.5">
                      {rule.reason}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {rule.action === 'BLOCK' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        BLOCK
                      </span>
                    ) : rule.action === 'QUARANTINE' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        QUARANTINE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        ALLOW
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-bold text-rose-300">{rule.sourceIp}</td>
                  <td className="py-3 px-4 text-cyan-300">:{rule.destPort}</td>

                  <td className="py-3 px-4 text-slate-300 font-bold">{rule.hitCount.toLocaleString()}</td>

                  <td className="py-3 px-4">
                    {rule.autoCreated ? (
                      <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                        <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                        <span>ML Auto-Generated</span>
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                        Manual Admin
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleExplainRule(rule)}
                      title="Explain rule with Gemini AI"
                      className="p-1.5 text-indigo-400 hover:text-indigo-200 hover:bg-slate-800 rounded transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteRule(rule.id)}
                      title="Remove rule"
                      className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-slate-800 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Create Security Policy Rule</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 mb-1">Rule Name:</label>
                <input
                  type="text"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="e.g. Block Malicious Scanner"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Source IP Address / CIDR:</label>
                <input
                  type="text"
                  required
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  placeholder="e.g. 198.51.100.42"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Target Port:</label>
                <input
                  type="text"
                  value={newPort}
                  onChange={(e) => setNewPort(e.target.value)}
                  placeholder="e.g. 80, 443, or *"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Policy Action:</label>
                <select
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="BLOCK">BLOCK (Drop Packet)</option>
                  <option value="QUARANTINE">QUARANTINE (Isolate Subnet)</option>
                  <option value="ALLOW">ALLOW (Bypass Inspection)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Reason / Context:</label>
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-md"
                >
                  Save Policy Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Explanation Drawer Modal */}
      {explainedRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-100">
                  Gemini AI Rule Analysis
                </h3>
              </div>
              <button onClick={() => setExplainedRule(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 text-rose-300">
              Rule: {explainedRule.ruleName} ({explainedRule.sourceIp})
            </div>

            <div className="text-xs text-slate-300 leading-relaxed">
              {isExplaining ? (
                <div className="py-8 text-center text-slate-400 font-mono">
                  Analyzing security impact via Gemini AI...
                </div>
              ) : (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 whitespace-pre-wrap">
                  {ruleExplanation}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setExplainedRule(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
