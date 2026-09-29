/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BlockchainNetwork } from '../../types/investigation';
import {
  ShieldAlert,
  X,
  Play,
  CheckCircle2,
  Loader2,
  HelpCircle,
  AlertCircle,
  Info,
  Sparkles,
} from 'lucide-react';

interface StartInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: {
    caseName: string;
    caseReference: string;
    startingAddress: string;
    network: BlockchainNetwork;
    maxHops: number;
    mode: 'DEMO' | 'LIVE';
    timeRangePreset?: 'all' | '24h' | '7d' | '30d' | '90d';
  }) => Promise<void>;
}

export const StartInvestigationModal: React.FC<StartInvestigationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [caseName, setCaseName] = useState('');
  const [caseReference, setCaseReference] = useState('');
  const [startingAddress, setStartingAddress] = useState('');
  const [network, setNetwork] = useState<BlockchainNetwork>('ethereum');
  const [maxHops, setMaxHops] = useState<number>(4);
  const [timeRange, setTimeRange] = useState<'all' | '24h' | '7d' | '30d' | '90d'>('30d');
  const [mode, setMode] = useState<'DEMO' | 'LIVE'>('DEMO');
  const [error, setError] = useState<string | null>(null);

  // Investigation Execution Progress State
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const PROGRESS_STEPS = [
    'Initializing investigation parameters & scope',
    'Querying blockchain consensus ledger & blocks',
    'Building transactional directed flow graph',
    'Tracing multi-hop connected wallet clusters',
    'Cross-referencing attribution intelligence database',
    'Validating evidentiary grounds & calculating confidence',
    'Compiling final forensic dossier & results',
  ];

  if (!isOpen) return null;

  const validateAddress = (addr: string, net: BlockchainNetwork): boolean => {
    const trimmed = addr.trim();
    if (!trimmed) return false;
    if (net === 'ethereum' || net === 'polygon' || net === 'arbitrum') {
      return /^0x[a-fA-F0-9]{40}$/.test(trimmed);
    }
    if (net === 'bitcoin') {
      return (
        /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(trimmed) ||
        /^bc1q[a-z0-9]{38}$/.test(trimmed)
      );
    }
    return true;
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedAddress = startingAddress.trim();
    if (!trimmedAddress) {
      setError('Please provide a target suspicious wallet address.');
      return;
    }

    if (!validateAddress(trimmedAddress, network)) {
      setError(
        `Invalid address format for ${network.toUpperCase()}. Expected 42-character hexadecimal format (0x...).`
      );
      return;
    }

    setIsProcessing(true);
    setCurrentStep(0);

    // Staged progress execution
    for (let step = 0; step < PROGRESS_STEPS.length; step++) {
      setCurrentStep(step);
      await new Promise((res) => setTimeout(res, 320));
    }

    try {
      await onSubmit({
        caseName: caseName.trim() || `Investigation ${trimmedAddress.slice(0, 10)}...`,
        caseReference: caseReference.trim() || `CASE-${Date.now().toString().slice(-6)}`,
        startingAddress: trimmedAddress,
        network,
        maxHops,
        mode,
        timeRangePreset: timeRange,
      });
      setIsProcessing(false);
      onClose();
    } catch (err: any) {
      setIsProcessing(false);
      setError(err?.message || 'Failed to initialize investigation.');
    }
  };

  // Pre-seed sample cases
  const loadPreset = (type: 'ransomware' | 'darknet' | 'mixer') => {
    if (type === 'ransomware') {
      setCaseName('Operation Silver-Fox / Ransomware Drainage');
      setCaseReference('CRIM-2026-US-0842');
      setStartingAddress('0x71C63B7282b0e6d6DE7d383921B0721Eb7118491');
      setNetwork('ethereum');
      setMaxHops(4);
      setTimeRange('30d');
      setMode('DEMO');
    } else if (type === 'darknet') {
      setCaseName('Darknet Marketplace Vendor Cashout');
      setCaseReference('LEA-NARC-2026-118');
      setStartingAddress('0x948Ac4B30F537F994017C2aDe1F7fFa25bB2221b');
      setNetwork('ethereum');
      setMaxHops(3);
      setTimeRange('7d');
      setMode('DEMO');
    } else {
      setCaseName('Phishing Syndicate Sanctioned Mixer Diversion');
      setCaseReference('FIN-AML-2026-094');
      setStartingAddress('0x883491E2112d7c040d216599b5e5812BcaF92881');
      setNetwork('ethereum');
      setMaxHops(3);
      setTimeRange('24h');
      setMode('DEMO');
    }
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl text-slate-100 overflow-hidden text-xs">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-sm text-slate-100">Start New Forensic Investigation</h3>
              <p className="text-slate-400 text-[11px]">
                Trace virtual asset movements, discover connected wallets, and attribute VASP endpoints.
              </p>
            </div>
          </div>
          {!isProcessing && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Processing State Animation */}
        {isProcessing ? (
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <h4 className="font-semibold text-sm text-slate-100">Executing Tracing Engine...</h4>
              <p className="text-slate-400 text-xs font-mono">
                {PROGRESS_STEPS[currentStep]}
              </p>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              {PROGRESS_STEPS.map((stepText, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 text-xs transition-opacity duration-200 ${
                      isDone
                        ? 'text-emerald-400'
                        : isCurrent
                        ? 'text-cyan-300 font-semibold'
                        : 'text-slate-600'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span>{stepText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleStart} className="p-5 space-y-4">
            {/* Quick Preset Buttons */}
            <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span className="font-semibold uppercase tracking-wider text-[10px]">
                  Quick Load Demo Cases
                </span>
                <span>Select to populate verified sample flow</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => loadPreset('ransomware')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-200 text-xs font-medium transition-colors"
                >
                  Silver-Fox Ransomware (4 Hops → Binance)
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset('darknet')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-200 text-xs font-medium transition-colors"
                >
                  Darknet Escrow (3 Hops → Kraken)
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset('mixer')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-200 text-xs font-medium transition-colors"
                >
                  Phishing Drain (Sanctioned Tornado)
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Target Address & Network */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200 text-xs flex justify-between">
                <span>Target Wallet Address *</span>
                <span className="text-slate-400 font-normal">Hexadecimal (0x...) or BTC address</span>
              </label>
              <input
                type="text"
                required
                placeholder="0x71C63B7282b0e6d6DE7d383921B0721Eb7118491"
                value={startingAddress}
                onChange={(e) => setStartingAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Network */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200 text-xs">Blockchain Network</label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value as BlockchainNetwork)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="ethereum">Ethereum Mainnet (EVM)</option>
                  <option value="bitcoin">Bitcoin Core (UTXO)</option>
                  <option value="polygon">Polygon PoS</option>
                  <option value="arbitrum">Arbitrum One</option>
                </select>
              </div>

              {/* Tracing Depth */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200 text-xs flex justify-between">
                  <span>Max Tracing Hops</span>
                  <span className="font-mono text-cyan-400">{maxHops} Hops</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={maxHops}
                  onChange={(e) => setMaxHops(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>

            {/* Case Name & Reference ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200 text-xs">Case / Operation Name</label>
                <input
                  type="text"
                  placeholder="e.g. Operation Sovereign Drain"
                  value={caseName}
                  onChange={(e) => setCaseName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200 text-xs">Reference / Case ID</label>
                <input
                  type="text"
                  placeholder="e.g. CASE-2026-US-891"
                  value={caseReference}
                  onChange={(e) => setCaseReference(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Mode: Demo vs Live */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 text-xs block">Execution Mode</span>
                <span className="text-slate-400 text-[11px]">
                  {mode === 'DEMO'
                    ? 'Uses verified seed clusters & synthetic demonstrator data.'
                    : 'Requires active RPC endpoint and consensus node access.'}
                </span>
              </div>
              <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded">
                <button
                  type="button"
                  onClick={() => setMode('DEMO')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    mode === 'DEMO'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  DEMO MODE
                </button>
                <button
                  type="button"
                  onClick={() => setMode('LIVE')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    mode === 'LIVE'
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  LIVE MODE
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold shadow-md transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Investigation</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
