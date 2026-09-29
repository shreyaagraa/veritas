/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Investigation, BlockchainNetwork } from '../../types/investigation';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { AddressDisplay } from '../common/AddressDisplay';
import { ArrowRight, Plus } from 'lucide-react';

interface DashboardViewProps {
  investigations: Investigation[];
  onOpenInvestigation: (id: string) => void;
  onNavigateStart: () => void;
  onQuickStart: (address: string, network: BlockchainNetwork) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  investigations,
  onOpenInvestigation,
  onNavigateStart,
  onQuickStart,
}) => {
  const [quickAddress, setQuickAddress] = useState('');
  const [quickNetwork, setQuickNetwork] = useState<BlockchainNetwork>('ethereum');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddress.trim()) return;
    onQuickStart(quickAddress.trim(), quickNetwork);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        {/* Intro Section: Restrained introduction with Bitcoin light-yellow presence */}
        <section className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 font-mono text-xs text-[#f5d13b] uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5d13b] shadow-[0_0_8px_#f5d13b]" />
            <span>Veritas Forensics · Multi-Chain & Bitcoin Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-white leading-tight">
            Virtual Asset Tracing &amp; <span className="text-[#f5d13b]">Fund Flow Attribution</span>
          </h1>

          <p className="text-sm sm:text-base text-[#9aa2b1] leading-relaxed">
            Trace the movement of illicit funds from suspicious unhosted addresses through multi-hop peeling chains and identify recipient Virtual Asset Service Providers using verified cryptographic attribution evidence.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onNavigateStart}
              className="h-9 px-4 bg-[#f5d13b] hover:bg-[#fef08a] text-black font-semibold text-xs tracking-tight rounded-none transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,209,59,0.2)]"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Start Investigation</span>
            </button>

            <span className="text-xs text-[#7e8695] font-mono flex items-center gap-2">
              <span className="text-[#f5d13b]">₿</span> Direct Bitcoin UTXO &amp; EVM Consensus Ledger Query · Zero Heuristic Guesswork
            </span>
          </div>
        </section>

        {/* Forensic Intelligence Key Metrics Bar */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-y border-[#1e242f] py-4">
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase text-[#7e8695] tracking-wider block">
              Active Forensics Cases
            </span>
            <div className="text-xl font-mono font-semibold text-white flex items-baseline gap-1.5">
              <span>{investigations.length}</span>
              <span className="text-[11px] text-[#7e8695] font-normal">files</span>
            </div>
          </div>

          <div className="space-y-1 border-l border-[#1e242f] pl-4">
            <span className="font-mono text-[10px] uppercase text-[#7e8695] tracking-wider block">
              Monitored Volume
            </span>
            <div className="text-xl font-mono font-semibold text-[#f5d13b] flex items-baseline gap-1.5">
              <span>24.50</span>
              <span className="text-xs text-[#fef08a] font-normal">BTC + ETH</span>
            </div>
          </div>

          <div className="space-y-1 border-l border-[#1e242f] pl-4">
            <span className="font-mono text-[10px] uppercase text-[#7e8695] tracking-wider block">
              Terminal VASPs Attributed
            </span>
            <div className="text-xl font-mono font-semibold text-white flex items-baseline gap-1.5">
              <span className="text-white">100%</span>
              <span className="text-[10px] text-emerald-400 font-mono">Proof-of-Reserves</span>
            </div>
          </div>

          <div className="space-y-1 border-l border-[#1e242f] pl-4">
            <span className="font-mono text-[10px] uppercase text-[#7e8695] tracking-wider block">
              Peeling Chain Depth
            </span>
            <div className="text-xl font-mono font-semibold text-white flex items-baseline gap-1.5">
              <span className="text-[#f5d13b]">4</span>
              <span className="text-[11px] text-[#7e8695] font-normal">Max Hops</span>
            </div>
          </div>
        </section>

        {/* Inline Quick Trace Input */}
        <section className="border border-[#1e242f] bg-[#0c0f14] p-4">
          <form
            onSubmit={handleQuickSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <span className="font-mono text-xs text-[#f5d13b] uppercase tracking-wider shrink-0 flex items-center gap-1.5 font-medium">
              <span>₿</span> Quick Trace:
            </span>

            <input
              type="text"
              placeholder="Paste cryptocurrency address (e.g. bc1qa5wk..., 0x71C6..., TNDrfcr...)"
              value={quickAddress}
              onChange={(e) => {
                const val = e.target.value;
                setQuickAddress(val);
                const trimmed = val.trim();
                if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/i.test(trimmed)) {
                  setQuickNetwork('bitcoin');
                } else if (/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(trimmed)) {
                  setQuickNetwork('tron');
                } else if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed) && !trimmed.startsWith('0x') && !trimmed.startsWith('bc1')) {
                  setQuickNetwork('solana');
                } else if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
                  if (quickNetwork !== 'polygon' && quickNetwork !== 'bsc') {
                    setQuickNetwork('ethereum');
                  }
                }
              }}
              className="flex-1 h-9 px-3 bg-[#080a0e] border border-[#232a36] text-xs font-mono text-zinc-100 placeholder-[#5e6676] focus:outline-none focus:border-[#f5d13b] transition-colors"
            />

            <select
              value={quickNetwork}
              onChange={(e) => setQuickNetwork(e.target.value as BlockchainNetwork)}
              className="h-9 px-2 bg-[#080a0e] border border-[#232a36] text-xs font-mono text-[#f5d13b] focus:outline-none focus:border-[#f5d13b] cursor-pointer shrink-0"
            >
              <option value="bitcoin">Bitcoin (BTC)</option>
              <option value="ethereum">Ethereum (ETH)</option>
              <option value="tron">TRON (TRX)</option>
              <option value="bsc">BNB Chain (BSC)</option>
              <option value="solana">Solana (SOL)</option>
              <option value="polygon">Polygon (POL)</option>
            </select>

            <button
              type="submit"
              disabled={!quickAddress.trim()}
              className="h-9 px-4 bg-[#f5d13b] hover:bg-[#fef08a] disabled:opacity-40 text-xs font-mono font-semibold text-black transition-all cursor-pointer shrink-0 shadow-[0_0_10px_rgba(245,209,59,0.15)]"
            >
              Trace Now →
            </button>
          </form>
        </section>

        {/* Recent Investigations: Clean structured table / vertical scanning */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#1e242f] pb-3">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase font-mono flex items-center gap-2">
                <span>Recent Investigations</span>
                <span className="text-[10px] text-[#f5d13b] bg-[#f5d13b]/10 border border-[#f5d13b]/30 px-1.5 py-0.2 normal-case font-mono">
                  Live Ledger State
                </span>
              </h2>
              <p className="text-xs text-[#7e8695] mt-0.5">
                Active forensics files, Bitcoin UTXO peeling chains, and multi-hop traces
              </p>
            </div>

            <button
              type="button"
              onClick={onNavigateStart}
              className="text-xs text-[#f5d13b] hover:text-[#fef08a] transition-colors cursor-pointer font-mono"
            >
              New Case +
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1e242f] text-[11px] font-mono uppercase tracking-wider text-[#5e6676]">
                  <th className="py-2.5 pr-4 font-normal">Case</th>
                  <th className="py-2.5 px-4 font-normal">Target Address</th>
                  <th className="py-2.5 px-4 font-normal">Network</th>
                  <th className="py-2.5 px-4 font-normal">Status</th>
                  <th className="py-2.5 px-4 font-normal">Identified Entity</th>
                  <th className="py-2.5 px-4 font-normal">Confidence</th>
                  <th className="py-2.5 pl-4 font-normal text-right">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181d26]">
                {investigations.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => onOpenInvestigation(inv.id)}
                    className="hover:bg-[#0e1218] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 pr-4">
                      <div className="font-medium text-zinc-200 group-hover:text-[#f5d13b] transition-colors flex items-center gap-2">
                        {inv.network === 'bitcoin' && (
                          <span className="text-[10px] font-mono text-[#f5d13b] bg-[#f5d13b]/10 border border-[#f5d13b]/30 px-1 py-0.2 font-bold shrink-0">
                            ₿ BTC
                          </span>
                        )}
                        <span>{inv.caseName}</span>
                      </div>
                      <div className="font-mono text-[11px] text-[#5e6676] mt-0.5">
                        {inv.caseReference}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <AddressDisplay
                        address={inv.startingAddress}
                        isTruncated={true}
                        className="font-medium text-zinc-200"
                      />
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {inv.network === 'bitcoin' ? (
                        <span className="inline-block px-1.5 py-0.5 bg-[#f5d13b]/15 text-[#f5d13b] border border-[#f5d13b]/30 font-semibold uppercase text-[10px]">
                          Bitcoin
                        </span>
                      ) : (
                        <span className="text-[#7e8695] uppercase">
                          {inv.network}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            inv.status === 'completed'
                              ? 'bg-emerald-400'
                              : inv.status === 'running'
                              ? 'bg-[#f5d13b]'
                              : 'bg-zinc-500'
                          }`}
                        />
                        <span className="text-[#9aa2b1] capitalize">
                          {inv.status.replace('_', ' ')}
                        </span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {inv.summary.finalKnownEntity ? (
                        <div className="font-medium text-zinc-200 group-hover:text-white">
                          {inv.summary.finalKnownEntity}
                        </div>
                      ) : (
                        <div className="text-[#5e6676] italic">Unattributed</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <ConfidenceBadge
                        confidence={inv.summary.finalConfidence}
                        reasoning={inv.summary.finalConfidenceReasoning}
                        size="sm"
                      />
                    </td>

                    <td className="py-3.5 pl-4 text-right font-mono text-[11px] text-[#7e8695]">
                      <div className="flex items-center justify-end gap-1.5">
                        <span>
                          {new Date(inv.updatedAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <ArrowRight className="w-3 h-3 text-[#5e6676] group-hover:text-[#f5d13b] transition-colors opacity-0 group-hover:opacity-100" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Minimal Supporting Information: Restrained, non-cluttered */}
        <section className="pt-4 border-t border-[#1e242f] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#7e8695]">
          <div className="space-y-1">
            <span className="font-mono text-[11px] uppercase text-[#9aa2b1] block">
              Multi-Hop Graph Engine
            </span>
            <p className="text-[11px] leading-relaxed">
              Synthesizes transaction flow across arbitrary hop depths, tracking peel balances and intermediary consolidation hubs.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[11px] uppercase text-[#9aa2b1] block">
              Cryptographic Grounding
            </span>
            <p className="text-[11px] leading-relaxed">
              Attributions are anchored in public Proof-of-Reserves disclosures, regulatory registrations, and court-order filings.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[11px] uppercase text-[#9aa2b1] block">
              Evidentiary Standards
            </span>
            <p className="text-[11px] leading-relaxed">
              Clear separation between deterministic on-chain observations and probabilistic heuristic inferences.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
