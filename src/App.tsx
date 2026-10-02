import React, { useState } from 'react';
import { NIDSAlert, AttackType } from './types';
import { RealtimeNIDSDashboard } from './components/RealtimeNIDSDashboard';

export default function App() {
  const [alerts, setAlerts] = useState<NIDSAlert[]>([
    {
      id: 'alert-initial-01',
      timestamp: new Date().toLocaleTimeString(),
      severity: 'CRITICAL',
      title: 'DDoS SYN Flood Mitigated',
      description: 'High-volume connection flood auto-blocked by Anomaly Detection engine.',
      attackerIp: '185.220.101.5',
      attackType: 'DDOS',
      nodeId: 'node-web-01',
      nodeName: 'Web Server Alpha',
      mlConfidence: 98,
      actionTaken: 'ISOLATED_NODE',
      autoResolved: true,
    },
  ]);

  const handleTriggerAttack = (type: AttackType) => {
    const newAlert: NIDSAlert = {
      id: `alert-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      severity: 'CRITICAL',
      title: `Intrusion Alert: ${type}`,
      description: `Dispatched external attack simulation for ${type}.`,
      attackerIp: '185.220.101.5',
      attackType: type,
      nodeId: 'node-web-01',
      nodeName: 'Web Server Alpha',
      mlConfidence: 99,
      actionTaken: 'ISOLATED_NODE',
      autoResolved: true,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleResetSystem = () => {
    setAlerts([]);
  };

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <RealtimeNIDSDashboard
          alerts={alerts}
          onTriggerAttack={handleTriggerAttack}
          onHealAll={handleResetSystem}
        />
      </div>
    </div>
  );
}
