// Website Analysis Types
export interface WebsiteAnalysisRequest {
  url: string;
}

export interface WebsiteAnalysisResponse {
  url: string;
  isReachable: boolean;
  hasSSL: boolean;
  sslGrade: string;
  securityHeaders: Record<string, string>;
  redirectChain: string[];
  suspiciousIndicators: string[];
  riskLevel: 'safe' | 'moderate' | 'suspicious' | 'dangerous';
  recommendations: string[];
}

// Breach Check Types
export interface BreachCheckRequest {
  email?: string;
  username?: string;
}

export interface BreachCheckResponse {
  found: boolean;
  plainLanguageWarning: string;
  breaches: Breach[];
}

export interface Breach {
  name: string;
  breachDate: string;
  addedDate: string;
  description: string;
  count: number;
}

// Email Validation Types
export interface EmailValidationRequest {
  senderEmail: string;
}

export interface EmailValidationResponse {
  email: string;
  isValid: boolean;
  domain: string;
  hasMXRecords: boolean;
  hasSpfRecord: boolean;
  hasDmarcRecord: boolean;
  suspicionLevel: 'safe' | 'suspicious' | 'dangerous';
  reasons: string[];
  suggestions: string[];
}

// Threat Intelligence Types
export interface ThreatIntelligenceResponse {
  lastUpdated: string;
  summaryForNonTechUsers: string;
  criticalAlerts: ThreatAlert[];
  thisWeekVulnerabilities: ThreatAlert[];
  exploitedNow: ThreatAlert[];
}

export interface ThreatAlert {
  title: string;
  plainLanguage: string;
  urgency: 'Act Now' | 'This Week' | 'Soon' | 'Monitor';
  impactScore: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
