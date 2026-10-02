export type NodeStatus = 'HEALTHY' | 'SUSPICIOUS' | 'INFECTED' | 'ISOLATED' | 'HEALED' | 'RECOVERING';

export type NodeType = 'ROUTER' | 'FIREWALL' | 'WEB_SERVER' | 'DATABASE' | 'API_GATEWAY' | 'AUTH_SERVER' | 'WORKSTATION' | 'IOT_DEVICE';

export interface NetworkNode {
  id: string;
  name: string;
  type: NodeType;
  ip: string;
  mac: string;
  subnet: string;
  vlan: number;
  status: NodeStatus;
  threatScore: number; // 0 to 100
  cpuUsage: number;    // %
  memUsage: number;    // %
  trafficInMbps: number;
  trafficOutMbps: number;
  activeConnections: number;
  openPorts: number[];
  isolatedAt?: string;
  healedAt?: string;
  lastSnapshotId?: string;
  quarantineReason?: string;
}

export type ProtocolType = 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'SSH' | 'DNS';

export interface NetworkPacket {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  destPort: number;
  protocol: ProtocolType;
  payloadSize: number; // bytes
  entropy: number;    // 0.0 - 8.0 (measure of randomness/encryption/obfuscation)
  flags: string[];     // e.g. ['SYN', 'ACK']
  anomalyScore: number; // 0.0 - 1.0 ML confidence
  detectedAttack?: string;
  isBlocked: boolean;
}

export interface FirewallRule {
  id: string;
  ruleName: string;
  action: 'BLOCK' | 'ALLOW' | 'QUARANTINE' | 'INSPECT';
  sourceIp: string;
  destIp?: string;
  destPort: string;
  protocol: string;
  createdAt: string;
  reason: string;
  autoCreated: boolean;
  status: 'ACTIVE' | 'DISABLED';
  hitCount: number;
}

export type AttackType = 'DDOS' | 'BRUTE_FORCE' | 'RANSOMWARE' | 'SQLI' | 'ZERO_DAY' | 'C2_BEACON' | 'PORTSCAN' | 'BOT';

export interface AttackSimulationConfig {
  attackType: AttackType;
  targetNodeId: string;
  sourceIp: string;
  intensity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  durationSec: number;
}

export interface NIDSAlert {
  id: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  nodeId?: string;
  nodeName?: string;
  attackerIp: string;
  attackType: AttackType;
  mlConfidence: number; // %
  actionTaken: 'ISOLATED_NODE' | 'BLOCKED_IP' | 'RULE_CREATED' | 'NODE_HEALED' | 'PENDING_APPROVAL';
  autoResolved: boolean;
  aiAnalysis?: ThreatAIAnalysis;
}

export interface ThreatAIAnalysis {
  threatLevel: string;
  attackVector: string;
  cveEquivalent?: string;
  rootCause: string;
  blastRadius: string;
  recommendedPlaybook: string[];
  suggestedFirewallRule: string;
}

export interface MLModelMetrics {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  featuresAnalyzed: { name: string; importance: number }[];
  trainingSamplesCount: number;
  anomaliesDetectedTotal: number;
  autoMitigationsExecuted: number;
}
