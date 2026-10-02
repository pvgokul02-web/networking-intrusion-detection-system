import { NetworkPacket, NetworkNode, FirewallRule, NIDSAlert, AttackType } from '../types';

export const ATTACK_METADATA: Record<AttackType, { name: string; description: string; avgEntropy: number; defaultPort: number }> = {
  DDOS: {
    name: 'DDoS / SYN Flood Attack',
    description: 'High-volume asymmetric packet flood designed to exhaust connection state tables.',
    avgEntropy: 2.1,
    defaultPort: 80,
  },
  BRUTE_FORCE: {
    name: 'SSH / Auth Brute Force',
    description: 'Rapid credential spraying targeting authentication sockets.',
    avgEntropy: 4.5,
    defaultPort: 22,
  },
  RANSOMWARE: {
    name: 'Ransomware Worm Lateral Movement',
    description: 'SMB/RPC exploitation attempting encrypted file propagation across internal VLANs.',
    avgEntropy: 7.92, // Extremely high entropy due to payload encryption
    defaultPort: 445,
  },
  SQLI: {
    name: 'SQL Injection & Exfiltration',
    description: 'Malicious SQL payload attempting database schema dump via web parameters.',
    avgEntropy: 5.8,
    defaultPort: 5432,
  },
  ZERO_DAY: {
    name: 'Zero-Day RCE Memory Exploit',
    description: 'Buffer overflow exploit sending obfuscated shellcode to process stack.',
    avgEntropy: 7.45,
    defaultPort: 8080,
  },
  C2_BEACON: {
    name: 'Command & Control (C2) Beaconing',
    description: 'Periodic encrypted handshake with external adversary infrastructure.',
    avgEntropy: 6.8,
    defaultPort: 443,
  },
  PORTSCAN: {
    name: 'Port Scan Probe',
    description: 'TCP SYN sweep probing system ports across network addresses.',
    avgEntropy: 7.85,
    defaultPort: 80,
  },
  BOT: {
    name: 'Botnet Malware Infection',
    description: 'Malicious bot traffic attempting command and control node execution.',
    avgEntropy: 6.95,
    defaultPort: 8080,
  },
};

// Simple pseudo-random helper
function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function generatePacket(
  nodes: NetworkNode[],
  activeAttack: { attackType: AttackType; targetNodeId: string; sourceIp: string } | null
): NetworkPacket {
  const targetNode = activeAttack
    ? nodes.find((n) => n.id === activeAttack.targetNodeId) || nodes[0]
    : nodes[Math.floor(Math.random() * nodes.length)];

  const isAttack = !!activeAttack;
  const attackMeta = activeAttack ? ATTACK_METADATA[activeAttack.attackType] : null;

  const sourceIp = isAttack
    ? activeAttack!.sourceIp
    : `10.0.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 200 + 2)}`;

  const destIp = targetNode.ip;
  const destPort = isAttack ? attackMeta!.defaultPort : targetNode.openPorts[Math.floor(Math.random() * targetNode.openPorts.length)] || 80;
  const protocol = destPort === 22 ? 'SSH' : destPort === 443 ? 'HTTPS' : destPort === 53 ? 'DNS' : 'TCP';

  const payloadSize = isAttack
    ? activeAttack?.attackType === 'DDOS'
      ? Math.floor(randomRange(64, 128))
      : Math.floor(randomRange(2048, 8192))
    : Math.floor(randomRange(256, 1500));

  const entropy = isAttack
    ? parseFloat(randomRange(attackMeta!.avgEntropy - 0.4, attackMeta!.avgEntropy + 0.4).toFixed(2))
    : parseFloat(randomRange(1.8, 3.8).toFixed(2));

  // Compute anomaly score using ML heuristic logic
  let anomalyScore = 0.05;

  if (isAttack) {
    anomalyScore = randomRange(0.85, 0.99);
  } else {
    // Occasional tiny jitter or false positive candidate
    if (entropy > 4.5 || destPort === 22) {
      anomalyScore = randomRange(0.2, 0.45);
    } else {
      anomalyScore = randomRange(0.01, 0.15);
    }
  }

  return {
    id: `pkt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toLocaleTimeString(),
    sourceIp,
    destIp,
    destPort,
    protocol,
    payloadSize,
    entropy,
    flags: isAttack ? ['SYN', 'ECE', 'URG'] : ['ACK', 'PSH'],
    anomalyScore: parseFloat(anomalyScore.toFixed(2)),
    detectedAttack: isAttack ? attackMeta!.name : undefined,
    isBlocked: false,
  };
}

// Generate an auto-created Firewall rule based on threat telemetry
export function createAutoFirewallRule(
  attackerIp: string,
  attackType: AttackType,
  destPort: number
): FirewallRule {
  const ruleId = `fw-auto-${Date.now().toString().slice(-4)}`;
  return {
    id: ruleId,
    ruleName: `Auto-Block ${attackType} (${attackerIp})`,
    action: 'BLOCK',
    sourceIp: `${attackerIp}/32`,
    destPort: `${destPort}`,
    protocol: 'ALL',
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    reason: `ML Engine Anomaly Threshold Exceeded (Confidence > 92%). Blocked attacker IP.`,
    autoCreated: true,
    status: 'ACTIVE',
    hitCount: 1,
  };
}

// Process self-healing remediation workflow
export function executeRemediationWorkflow(
  nodes: NetworkNode[],
  firewallRules: FirewallRule[],
  alert: NIDSAlert,
  autoPilot: boolean
): { updatedNodes: NetworkNode[]; updatedRules: FirewallRule[]; updatedAlert: NIDSAlert } {
  let updatedNodes = [...nodes];
  let updatedRules = [...firewallRules];
  let updatedAlert = { ...alert };

  if (autoPilot) {
    // 1. Isolate the compromised node
    updatedNodes = updatedNodes.map((node) => {
      if (node.id === alert.nodeId) {
        return {
          ...node,
          status: 'ISOLATED' as const,
          threatScore: 95,
          isolatedAt: new Date().toLocaleTimeString(),
          quarantineReason: `Isolated by Self-Healing NIDS following ${alert.title}`,
        };
      }
      return node;
    });

    // 2. Check if IP is already blocked, if not add Firewall rule
    const existingRule = updatedRules.find((r) => r.sourceIp.includes(alert.attackerIp));
    if (!existingRule) {
      const newRule = createAutoFirewallRule(alert.attackerIp, alert.attackType, 80);
      updatedRules.unshift(newRule);
    } else {
      existingRule.hitCount += 1;
    }

    updatedAlert.actionTaken = 'ISOLATED_NODE';
    updatedAlert.autoResolved = true;
  } else {
    updatedAlert.actionTaken = 'PENDING_APPROVAL';
    updatedAlert.autoResolved = false;
  }

  return { updatedNodes, updatedRules, updatedAlert };
}
