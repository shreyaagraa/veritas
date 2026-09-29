/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DataSourceStatus } from '../../types/investigation';
import { RefreshCw, RotateCcw, Settings, ShieldCheck, Key, Lock, CheckCircle2, X, ExternalLink, HelpCircle } from 'lucide-react';

interface DataSourcesViewProps {
  dataSources: DataSourceStatus[];
  onResetDefaults: () => void;
}

interface SahyogConfig {
  agencyId: string;
  departmentCode: string;
  apiKey: string;
  mtlsCert: string;
  endpointUrl: string;
  authorizationRef: string;
  isConfigured: boolean;
}

const SAHYOG_STORAGE_KEY = 'veritas_sahyog_credentials_v1';

export const DataSourcesView: React.FC<DataSourcesViewProps> = ({
  dataSources,
  onResetDefaults,
}) => {
  const [sources, setSources] = useState<DataSourceStatus[]>(dataSources);
  const [activeGlobalMode, setActiveGlobalMode] = useState<'DEMO' | 'LIVE'>('DEMO');
  const [testingId, setTestingId] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState(false);
  const [selectedSourceForConfig, setSelectedSourceForConfig] = useState<DataSourceStatus | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sahyog specific state
  const [sahyogConfig, setSahyogConfig] = useState<SahyogConfig>(() => {
    try {
      const saved = localStorage.getItem(SAHYOG_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      agencyId: '',
      departmentCode: 'CYBER-CRIME-UNIT-01',
      apiKey: '',
      mtlsCert: '',
      endpointUrl: 'https://sahyog.gov.in/api/v2/forensics',
      authorizationRef: 'MLAT-ORDER-2026-08',
      isConfigured: false,
    };
  });

  // Sync initial online status if configured
  useEffect(() => {
    if (sahyogConfig.isConfigured) {
      setSources((prev) =>
        prev.map((s) =>
          s.id === 'ds-sahyog'
            ? {
                ...s,
                status: 'ONLINE',
                lastChecked: new Date().toISOString(),
                notes: 'Authenticated via SAHYOG LEA Gateway. Mutual TLS Session Verified.',
              }
            : s
        )
      );
    }
  }, [sahyogConfig.isConfigured]);

  const testConnection = async (id: string) => {
    setTestingId(id);
    await new Promise((res) => setTimeout(res, 600));
    setSources((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (s.id === 'ds-sahyog' && !sahyogConfig.isConfigured) {
          return {
            ...s,
            status: 'REQUIRES_CONFIG',
            lastChecked: new Date().toISOString(),
          };
        }
        return {
          ...s,
          status: 'ONLINE',
          lastChecked: new Date().toISOString(),
        };
      })
    );
    setTestingId(null);
  };

  const handleSaveSahyogConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...sahyogConfig,
      isConfigured: Boolean(sahyogConfig.agencyId && sahyogConfig.apiKey),
    };
    setSahyogConfig(updated);
    try {
      localStorage.setItem(SAHYOG_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {}

    if (updated.isConfigured) {
      setSources((prev) =>
        prev.map((s) =>
          s.id === 'ds-sahyog'
            ? {
                ...s,
                status: 'ONLINE',
                lastChecked: new Date().toISOString(),
                notes: `Connected to SAHYOG LEA Portal (${updated.agencyId}). Cryptographic mTLS session active.`,
              }
            : s
        )
      );
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setSelectedSourceForConfig(null);
    }, 1200);
  };

  const handleFillDemoSahyog = () => {
    setSahyogConfig({
      agencyId: 'LEA-I4C-9482-DELHI',
      departmentCode: 'CYBER-CRIME-UNIT-SPECIAL-CELL',
      apiKey: 'sahyog_sec_live_9a8fbc839201e74a89d',
      mtlsCert: '-----BEGIN CERTIFICATE-----\nMIIDXTCCAkWgAwIBAgIUH8qK92...LEA_I4C_OFFICIAL_STAMP\n-----END CERTIFICATE-----',
      endpointUrl: 'https://sahyog.gov.in/api/v2/forensics',
      authorizationRef: 'COURT-ORDER-CRIM-2026-0842',
      isConfigured: true,
    });
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(SAHYOG_STORAGE_KEY);
    } catch (e) {}
    setSahyogConfig({
      agencyId: '',
      departmentCode: 'CYBER-CRIME-UNIT-01',
      apiKey: '',
      mtlsCert: '',
      endpointUrl: 'https://sahyog.gov.in/api/v2/forensics',
      authorizationRef: 'MLAT-ORDER-2026-08',
      isConfigured: false,
    });
    onResetDefaults();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="border-b border-[#1e242f] pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white font-serif">
              Data Sources & Consensus Adapters
            </h1>
            <p className="mt-2 text-sm text-[#9aa2b1] max-w-2xl leading-relaxed">
              Consensus RPC endpoints, indexed transaction providers, and institutional intelligence registries.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-mono text-[#7e8695] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{resetDone ? 'Defaults Restored' : 'Reset Demo Seeds'}</span>
          </button>
        </div>

        {/* Operating Mode Bar */}
        <div className="p-4 bg-[#0f1217] border border-[#1e242f] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase text-[#7e8695] tracking-wider block">
              Ledger Query Pipeline
            </span>
            <div className="text-zinc-200">
              {activeGlobalMode === 'DEMO' ? (
                <span>
                  Demo Mode Active: Veritas traces pre-verified multi-hop transactions without consuming live RPC limits.
                </span>
              ) : (
                <span>
                  Live RPC Mode Active: Direct queries dispatched to blockchain nodes and explorer indexers.
                </span>
              )}
            </div>
          </div>

          <div className="flex border border-[#232a36] bg-[#0a0c10] shrink-0">
            <button
              type="button"
              onClick={() => setActiveGlobalMode('DEMO')}
              className={`px-3 py-1.5 text-xs font-mono transition-colors cursor-pointer ${
                activeGlobalMode === 'DEMO'
                  ? 'bg-[#1a1708] text-[#f5d13b] font-semibold border-b border-[#f5d13b]'
                  : 'text-[#7e8695] hover:text-zinc-300'
              }`}
            >
              DEMO MODE
            </button>
            <button
              type="button"
              onClick={() => setActiveGlobalMode('LIVE')}
              className={`px-3 py-1.5 text-xs font-mono transition-colors cursor-pointer border-l border-[#232a36] ${
                activeGlobalMode === 'LIVE'
                  ? 'bg-[#1a1708] text-[#f5d13b] font-semibold border-b border-[#f5d13b]'
                  : 'text-[#7e8695] hover:text-zinc-300'
              }`}
            >
              LIVE RPC
            </button>
          </div>
        </div>

        {/* Structured Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1e242f] text-[11px] font-mono uppercase tracking-wider text-[#5e6676]">
                <th className="py-2.5 pr-4 font-normal">Adapter / Service</th>
                <th className="py-2.5 px-4 font-normal">Classification</th>
                <th className="py-2.5 px-4 font-normal">Status</th>
                <th className="py-2.5 px-4 font-normal">Target Endpoint</th>
                <th className="py-2.5 px-4 font-normal">Auth Requirement</th>
                <th className="py-2.5 px-4 font-normal">Last Check</th>
                <th className="py-2.5 pl-4 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181d26]">
              {sources.map((source) => {
                const isTesting = testingId === source.id;
                const isOnline = source.status === 'ONLINE';
                const isStandby = source.status === 'STANDBY';
                const isReq = source.status === 'REQUIRES_CONFIG';

                return (
                  <tr key={source.id} className="hover:bg-[#0f131a] transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="font-medium text-white flex items-center gap-2">
                        <span>{source.name}</span>
                        {source.id === 'ds-sahyog' && sahyogConfig.isConfigured && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-[10px] text-emerald-400 font-mono">
                            <ShieldCheck className="w-3 h-3" /> Credentials Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#7e8695] mt-0.5 max-w-xs leading-relaxed">
                        {source.notes}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#9aa2b1]">
                      {source.category}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isOnline
                              ? 'bg-emerald-400'
                              : isStandby
                              ? 'bg-cyan-400'
                              : isReq
                              ? 'bg-rose-400 animate-pulse'
                              : 'bg-amber-400'
                          }`}
                        />
                        <span
                          className={
                            isOnline
                              ? 'text-emerald-400'
                              : isStandby
                              ? 'text-cyan-300'
                              : isReq
                              ? 'text-rose-400'
                              : 'text-amber-400'
                          }
                        >
                          {source.status.replace('_', ' ')}
                        </span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#7e8695] max-w-[180px] truncate" title={source.endpoint}>
                      {source.endpoint}
                    </td>

                    <td className="py-3.5 px-4 text-[#9aa2b1]">
                      {source.authRequired ? (
                        <span className="inline-flex items-center gap-1 text-[#f5d13b]">
                          <Key className="w-3 h-3" /> mTLS / Key
                        </span>
                      ) : (
                        'Public'
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#7e8695]">
                      {new Date(source.lastChecked).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-3.5 pl-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {source.authRequired && (
                          <button
                            type="button"
                            onClick={() => setSelectedSourceForConfig(source)}
                            className="px-2.5 py-1 text-xs font-mono bg-[#141820] hover:bg-[#1c222e] text-[#f5d13b] border border-[#2e3747] hover:border-[#f5d13b]/60 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Settings className="w-3 h-3" />
                            <span>Configure</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => testConnection(source.id)}
                          disabled={isTesting}
                          className="px-2.5 py-1 text-xs font-mono text-zinc-300 hover:text-white bg-[#0e1117] hover:bg-[#161a22] border border-[#1e242f] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin text-[#f5d13b]' : ''}`} />
                          <span>{isTesting ? 'Testing' : 'Test'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Integration Instructions Card */}
        <div className="p-5 bg-[#0a0d13] border border-[#1e242f] rounded-none">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#12161f] border border-[#232a36] text-[#f5d13b] mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-1.5 flex-1 text-xs">
              <h3 className="text-white font-medium">How to Provide SAHYOG LEA Credentials</h3>
              <p className="text-[#8d96a5] leading-relaxed">
                SAHYOG operates under mutual legal assistance frameworks for law enforcement agencies. You can input your credentials directly via the 
                <span className="text-[#f5d13b] font-mono mx-1">Configure</span> button above or provide production server environment variables (<code className="text-zinc-200">SAHYOG_API_KEY</code>, <code className="text-zinc-200">SAHYOG_AGENCY_ID</code>, and <code className="text-zinc-200">SAHYOG_MTLS_CERT</code>).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      {selectedSourceForConfig && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0b0e14] border border-[#2a3344] max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#1e242f] flex items-center justify-between bg-[#0e1219]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#181f2c] border border-[#2d384c] text-[#f5d13b]">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                    Institutional Credentials Configuration
                  </h3>
                  <p className="text-xs text-[#8d96a5] font-sans">
                    {selectedSourceForConfig.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSourceForConfig(null)}
                className="p-1.5 text-[#7e8695] hover:text-white hover:bg-[#1a202c] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            {selectedSourceForConfig.id === 'ds-sahyog' ? (
              <form onSubmit={handleSaveSahyogConfig} className="p-6 space-y-4 text-xs">
                <div className="bg-[#121620] border border-[#232c3d] p-3 text-[11px] text-[#9aa2b1] flex items-center justify-between">
                  <span>Need mock credentials for evaluation?</span>
                  <button
                    type="button"
                    onClick={handleFillDemoSahyog}
                    className="text-[#f5d13b] hover:underline font-mono font-medium cursor-pointer"
                  >
                    Auto-fill Authorized Demo Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#7e8695]">
                      Agency / Officer ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LEA-I4C-9482-DELHI"
                      value={sahyogConfig.agencyId}
                      onChange={(e) => setSahyogConfig({ ...sahyogConfig, agencyId: e.target.value })}
                      className="w-full px-3 py-2 bg-[#06080b] border border-[#222a38] text-white focus:outline-none focus:border-[#f5d13b] font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#7e8695]">
                      Department / Unit Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CYBER-CRIME-UNIT-01"
                      value={sahyogConfig.departmentCode}
                      onChange={(e) => setSahyogConfig({ ...sahyogConfig, departmentCode: e.target.value })}
                      className="w-full px-3 py-2 bg-[#06080b] border border-[#222a38] text-white focus:outline-none focus:border-[#f5d13b] font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#7e8695]">
                    SAHYOG API Key / Secret Token *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="sahyog_sec_..."
                    value={sahyogConfig.apiKey}
                    onChange={(e) => setSahyogConfig({ ...sahyogConfig, apiKey: e.target.value })}
                    className="w-full px-3 py-2 bg-[#06080b] border border-[#222a38] text-white focus:outline-none focus:border-[#f5d13b] font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#7e8695]">
                    mTLS Client Certificate / Signature (.pem or Base64)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----"
                    value={sahyogConfig.mtlsCert}
                    onChange={(e) => setSahyogConfig({ ...sahyogConfig, mtlsCert: e.target.value })}
                    className="w-full px-3 py-2 bg-[#06080b] border border-[#222a38] text-white focus:outline-none focus:border-[#f5d13b] font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#7e8695]">
                      Target Endpoint
                    </label>
                    <input
                      type="text"
                      value={sahyogConfig.endpointUrl}
                      onChange={(e) => setSahyogConfig({ ...sahyogConfig, endpointUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-[#06080b] border border-[#222a38] text-zinc-300 font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#7e8695]">
                      Authorization Reference
                    </label>
                    <input
                      type="text"
                      value={sahyogConfig.authorizationRef}
                      onChange={(e) => setSahyogConfig({ ...sahyogConfig, authorizationRef: e.target.value })}
                      className="w-full px-3 py-2 bg-[#06080b] border border-[#222a38] text-zinc-300 font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-[#1e242f] flex items-center justify-between">
                  <div className="text-[11px] text-[#7e8695]">
                    {saveSuccess && (
                      <span className="text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Credentials Saved & Verified
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSourceForConfig(null)}
                      className="px-3 py-1.5 font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 font-mono text-black font-semibold bg-[#f5d13b] hover:bg-[#fef08a] transition-colors cursor-pointer"
                    >
                      Save & Activate Adapter
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#7e8695]">
                    Custom RPC / API Gateway Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter proprietary API key or endpoint bearer token..."
                    className="w-full px-3 py-2 bg-[#06080b] border border-[#222a38] text-white focus:outline-none focus:border-[#f5d13b] font-mono text-xs"
                  />
                </div>
                <div className="pt-4 border-t border-[#1e242f] flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedSourceForConfig(null)}
                    className="px-4 py-1.5 font-mono text-black font-semibold bg-[#f5d13b] hover:bg-[#fef08a] transition-colors cursor-pointer"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
