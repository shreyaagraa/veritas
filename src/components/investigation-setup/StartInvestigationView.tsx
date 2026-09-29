/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BlockchainNetwork } from '../../types/investigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface StartInvestigationViewProps {
  onBack: () => void;
  onSubmit: (params: {
    caseName: string;
    caseReference: string;
    startingAddress: string;
    network: BlockchainNetwork;
    maxHops: number;
    mode: 'DEMO' | 'LIVE';
    timeRangePreset?: 'all' | '24h' | '7d' | '30d' | '90d';
  }) => void;
}

export const StartInvestigationView: React.FC<StartInvestigationViewProps> = ({
  onBack,
  onSubmit,
}) => {
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState<BlockchainNetwork>('ethereum');
  const [caseName, setCaseName] = useState('');
  const [caseReference, setCaseReference] = useState('');
  const [timeRange, setTimeRange] = useState<'all' | '24h' | '7d' | '30d' | '90d'>('30d');
  const [maxHops, setMaxHops] = useState(4);
  const [mode, setMode] = useState<'DEMO' | 'LIVE'>('DEMO');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    const finalCaseName = caseName.trim() || `Investigation ${address.slice(0, 8)}...`;
    const finalRef = caseReference.trim() || `CASE-2026-${Date.now().toString().slice(-4)}`;

    onSubmit({
      caseName: finalCaseName,
      caseReference: finalRef,
      startingAddress: address.trim(),
      network,
      maxHops,
      mode,
      timeRangePreset: timeRange,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        {/* Back Link */}
        <div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-[#7e8695] hover:text-white transition-colors flex items-center gap-1.5 font-mono cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Overview</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="border-b border-[#1e242f] pb-6 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-white">
            Start Investigation
          </h1>
          <p className="text-sm text-[#9aa2b1] leading-relaxed max-w-2xl">
            Trace the movement of funds from a suspicious wallet and identify associated services using verified attribution evidence.
          </p>
        </div>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Primary Field: Wallet Address */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium block">
                Target Cryptocurrency Address *
              </label>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-[#5e6676]">Quick Fill:</span>
                <button
                  type="button"
                  onClick={() => {
                    setAddress('bc1qa5wkgaew2dkv56kfvj49j0av5nqvrl529w8025');
                    setNetwork('bitcoin');
                    setCaseName('Operation Silk-Vector Bitcoin Ransomware');
                    setCaseReference('BTC-LEA-2026-8802');
                  }}
                  className="text-[#f5d13b] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                >
                  <span>₿ Bitcoin Sample</span>
                </button>
                <span className="text-[#3b4252]">·</span>
                <button
                  type="button"
                  onClick={() => {
                    setAddress('0x71C63B7282b0e6d6DE7d383921B0721Eb7118491');
                    setNetwork('ethereum');
                    setCaseName('Silver-Fox Ransomware Drainage');
                    setCaseReference('CRIM-2026-US-0842');
                  }}
                  className="text-[#9aa2b1] hover:text-white hover:underline cursor-pointer"
                >
                  Ethereum Sample
                </button>
                <span className="text-[#3b4252]">·</span>
                <button
                  type="button"
                  onClick={() => {
                    setAddress('TNDrfcrC96gS4HhGj5oZ6Y7B5Kz9uFqJ2e');
                    setNetwork('tron');
                    setCaseName('Operation Cyber-Bridge TRON Laundering');
                    setCaseReference('TRX-LEA-2026-4491');
                  }}
                  className="text-cyan-400 hover:underline cursor-pointer"
                >
                  TRON Sample
                </button>
              </div>
            </div>
            <input
              type="text"
              required
              placeholder="e.g. bc1qa5wkgaew2dkv56kfvj49j0av5nqvrl529w8025 or 0x71C6... or TNDrfcr..."
              value={address}
              onChange={(e) => {
                const val = e.target.value;
                setAddress(val);
                // Auto-detect network from address format
                const trimmed = val.trim();
                if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/i.test(trimmed)) {
                  setNetwork('bitcoin');
                } else if (/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(trimmed)) {
                  setNetwork('tron');
                } else if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed) && !trimmed.startsWith('0x') && !trimmed.startsWith('bc1')) {
                  setNetwork('solana');
                } else if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
                  if (network !== 'polygon' && network !== 'bsc') {
                    setNetwork('ethereum');
                  }
                }
              }}
              className="w-full h-11 px-4 bg-[#0c0f14] border border-[#232a36] text-sm font-mono text-white placeholder-[#5e6676] focus:outline-none focus:border-[#f5d13b] transition-colors"
            />
            <p className="text-[11px] text-[#7e8695] font-mono">
              Target unhosted address to reconstruct ingress and egress multi-hop transaction flows.
            </p>
          </div>

          {/* Secondary Field: Network */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium block">
              Blockchain Network *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'bitcoin', name: 'Bitcoin (BTC)', icon: '₿', status: 'Live Ready' },
                { id: 'ethereum', name: 'Ethereum (ETH)', icon: 'Ξ', status: 'Live Ready' },
                { id: 'tron', name: 'TRON (TRX)', icon: 'TRX', status: 'Adapter Ready' },
                { id: 'bsc', name: 'BNB Chain (BSC)', icon: 'BNB', status: 'Live Ready' },
                { id: 'solana', name: 'Solana (SOL)', icon: 'SOL', status: 'Standby RPC' },
                { id: 'polygon', name: 'Polygon (POL)', icon: '⬡', status: 'Live Ready' },
              ].map((net) => {
                const isSelected = network === net.id;
                const isBtc = net.id === 'bitcoin';
                return (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => setNetwork(net.id as BlockchainNetwork)}
                    className={`h-12 px-3 border text-xs font-mono transition-all text-left flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? isBtc
                          ? 'border-[#f5d13b] bg-[#1a1708] text-[#f5d13b] font-semibold shadow-[0_0_10px_rgba(245,209,59,0.15)]'
                          : 'border-white bg-[#141820] text-white font-medium'
                        : 'border-[#1e242f] bg-[#0c0e12] text-[#7e8695] hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1.5">
                        <span className={isBtc ? 'text-[#f5d13b] font-bold' : ''}>{net.icon}</span>
                        <span>{net.name}</span>
                      </span>
                      <span className="text-[9px] text-[#5e6676] mt-0.5">{net.status}</span>
                    </div>
                    {isSelected && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isBtc ? 'bg-[#f5d13b]' : 'bg-white'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Fields Divider */}
          <div className="border-t border-[#1e242f] pt-6 space-y-6">
            <div className="text-xs font-mono uppercase tracking-wider text-[#5e6676]">
              Optional Case Parameters
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-zinc-300 font-medium block">
                  Case Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Operation Silver-Fox Drainage"
                  value={caseName}
                  onChange={(e) => setCaseName(e.target.value)}
                  className="w-full h-10 px-3 bg-[#0f1217] border border-[#232a36] text-xs text-white placeholder-[#5e6676] focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-zinc-300 font-medium block">
                  Reference ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. CRIM-2026-US-0842"
                  value={caseReference}
                  onChange={(e) => setCaseReference(e.target.value)}
                  className="w-full h-10 px-3 bg-[#0f1217] border border-[#232a36] text-xs font-mono text-white placeholder-[#5e6676] focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-zinc-300 font-medium block">
                  Time Range
                </label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="w-full h-10 px-3 bg-[#0f1217] border border-[#232a36] text-xs text-zinc-200 focus:outline-none cursor-pointer"
                >
                  <option value="24h">Past 24 Hours</option>
                  <option value="7d">Past 7 Days</option>
                  <option value="30d">Past 30 Days (Recommended)</option>
                  <option value="90d">Past 90 Days</option>
                  <option value="all">All Available Ledger History</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-zinc-300 font-medium">
                    Maximum Hops: <span className="font-mono text-white">{maxHops} layers</span>
                  </label>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={maxHops}
                  onChange={(e) => setMaxHops(Number(e.target.value))}
                  className="w-full accent-[#f5d13b] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#7e8695]">
                  <span>1 Hop (Direct)</span>
                  <span className="text-[#f5d13b] font-medium">4 Hops (Standard)</span>
                  <span>6 Hops (Deep)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-300 font-medium block">
                Execution Mode
              </label>
              <div className="flex border border-[#232a36] bg-[#0c0e12] w-fit">
                <button
                  type="button"
                  onClick={() => setMode('DEMO')}
                  className={`px-4 py-2 text-xs font-mono transition-colors cursor-pointer ${
                    mode === 'DEMO'
                      ? 'bg-[#1a212e] text-[#f5d13b] font-semibold border-b border-[#f5d13b]'
                      : 'text-[#7e8695] hover:text-zinc-200'
                  }`}
                >
                  Demo Mode (Verified Seeds)
                </button>
                <button
                  type="button"
                  onClick={() => setMode('LIVE')}
                  className={`px-4 py-2 text-xs font-mono transition-colors cursor-pointer border-l border-[#232a36] ${
                    mode === 'LIVE'
                      ? 'bg-[#1a212e] text-[#f5d13b] font-semibold border-b border-[#f5d13b]'
                      : 'text-[#7e8695] hover:text-zinc-200'
                  }`}
                >
                  Live Consensus RPC
                </button>
              </div>
            </div>
          </div>

          {/* Primary Action Button: Obvious and disciplined */}
          <div className="border-t border-[#1e242f] pt-6 flex justify-end">
            <button
              type="submit"
              disabled={!address.trim()}
              className="h-11 px-7 bg-[#f5d13b] hover:bg-[#fef08a] disabled:opacity-40 text-black font-semibold text-xs tracking-tight rounded-none transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,209,59,0.22)]"
            >
              <span>Initialize Investigation</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
