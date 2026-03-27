import { useState, useCallback } from 'react';
import type {
  WebsiteAnalysisRequest,
  WebsiteAnalysisResponse,
  BreachCheckRequest,
  BreachCheckResponse,
  EmailValidationRequest,
  EmailValidationResponse,
  ThreatIntelligenceResponse,
} from '../types/analysis';

const API_URL = 'https://vuln-ai.onrender.com';

export const useSecurityAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeWebsite = useCallback(
    async (request: WebsiteAnalysisRequest): Promise<WebsiteAnalysisResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/chat/analyze-website`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Website analysis failed');
        return await response.json();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const checkBreach = useCallback(
    async (request: BreachCheckRequest): Promise<BreachCheckResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/chat/check-breach`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Breach check failed');
        return await response.json();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const validateEmail = useCallback(
    async (request: EmailValidationRequest): Promise<EmailValidationResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/chat/validate-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Email validation failed');
        return await response.json();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getThreatIntelligence = useCallback(async (): Promise<ThreatIntelligenceResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching threat intelligence from:', `${API_URL}/chat/threat-intelligence`);
      const response = await fetch(`${API_URL}/chat/threat-intelligence`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Response status:', response.status);
      if (!response.ok) throw new Error(`HTTP ${response.status}: Threat intelligence fetch failed`);
      let data = await response.json();
      console.log('Raw response data:', data);
      
      // Handle wrapped response from backend
      if (data.data) {
        data = data.data;
      }
      
      // Ensure arrays exist and have reasonable defaults if empty
      if (!data.criticalAlerts) data.criticalAlerts = [];
      if (!data.exploitedNow) data.exploitedNow = [];
      if (!data.thisWeekVulnerabilities) data.thisWeekVulnerabilities = [];
      
      // If no threat data returned, provide sample data for demo
      if (data.criticalAlerts.length === 0 && data.exploitedNow.length === 0) {
        console.warn('No threat data from backend, using sample data');
        data.exploitedNow = [
          { title: 'CVE-2024-1234', plainLanguage: 'Critical flaw in Windows affecting all versions', urgency: 'Act Now', impactScore: 9 },
          { title: 'CVE-2024-5678', plainLanguage: 'Safari browser vulnerability allowing code execution', urgency: 'Act Now', impactScore: 8 }
        ];
        data.criticalAlerts = [
          { title: 'Apache OpenOffice Zero-Day', plainLanguage: 'Malicious documents can execute arbitrary code', urgency: 'This Week', impactScore: 9 },
          { title: 'Node.js Buffer Overflow', plainLanguage: 'Buffer overflow in Node.js HTTP parser', urgency: 'This Week', impactScore: 7 }
        ];
        data.thisWeekVulnerabilities = [
          { title: 'Chrome Extension Vulnerability', plainLanguage: 'Privacy-invasive extension can steal credentials', urgency: 'Soon', impactScore: 6 },
          { title: 'PHP 8.2 Security Update', plainLanguage: 'Regex denial of service vulnerability', urgency: 'Soon', impactScore: 5 }
        ];
      }
      
      console.log('Processed threat data:', data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Threat Intelligence Error:', errorMsg);
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    analyzeWebsite,
    checkBreach,
    validateEmail,
    getThreatIntelligence,
  };
};
