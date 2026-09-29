/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WalletNode, TransactionEdge } from '../../types/investigation';
import { AddressDisplay } from '../common/AddressDisplay';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { X, ChevronDown, ChevronRight } from 'lucide-react';

interface NodeDetailPanelProps {
  node: WalletNode | null;
  edges: TransactionEdge[];
  onClose: () => void;
  onSelectAddress: (address: string) => void;
  onOpenAttributionModal?: () => void;
}

export const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({
  node,
  edges,
  onClose,
  onSelectAddress,
  onOpenAttributionModal,
}) => {
  const [evidenceExpanded, setEvidenceExpanded] = useState(true);

  if (!node) {
    return (
      <div className="h-full bg-[#0d1015] p-6 text-xs text-[#5e6676] flex items-center justify-center italic">
        Select a node on the graph or a transaction to inspect on-chain details.
      </div>
    );
  }

  const relatedEdges = edges.filter(
    (e) =>
      e.from.toLowerCase() === node.address.toLowerCase() ||
      e.to.toLowerCase() === node.address.toLowerCase()
  );

  return (
    <div className="h-full bg-[#0d1015] text-zinc-100 flex flex-col overflow-y-auto text-xs font-sans">
      {/* 1. Header & Identity */}
      <div className="p-5 border-b border-[#1c222c] flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            {node.network === 'bitcoin' && (
              <span className="text-[10px] font-mono text-[#f5d13b] bg-[#f5d13b]/15 px-1 py-0.2 font-bold">
                ₿ BTC
              </span>
            )}
            <span className={`font-mono text-[10px] uppercase tracking-wider block ${node.network === 'bitcoin' ? 'text-[#f5d13b]' : 'text-[#7e8695]'}`}>
              Hop {node.hop} · {node.network.toUpperCase()}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white">
            {node.entityName || (node.network === 'bitcoin' ? 'Unhosted Bitcoin UTXO Node' : 'Unhosted Transit Node')}
          </h3>
          <AddressDisplay
            address={node.address}
            isTruncated={true}
            className="font-mono text-xs text-zinc-300"
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-[#7e8695] hover:text-[#f5d13b] p-1 cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* 2. Attribution Status & Wallet Classification */}
        <div className="space-y-2 pb-4 border-b border-[#1c222c]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-[#5e6676] tracking-wider block">
              Attribution & Classification
            </span>
            {node.isDirectDepositVasp && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#f5d13b]/15 border border-[#f5d13b]/40 text-[#f5d13b] font-semibold">
                ★ Nearest Deposit VASP
              </span>
            )}
          </div>

          <div className="p-2.5 bg-[#0a0c10] border border-[#1e242f] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-[#7e8695]">Service Type:</span>
              <span className="font-mono text-[11px] text-zinc-200 font-medium">
                {node.walletClassification || (node.entityName ? 'Known VASP' : 'Unknown / Unattributed')}
              </span>
            </div>

            {node.entityName ? (
              <>
                <div className="flex items-center justify-between pt-1 border-t border-[#181d26]">
                  <span className="font-mono text-[11px] text-[#7e8695]">Entity:</span>
                  <span className="text-white font-medium text-[11px]">{node.entityName}</span>
                </div>

                <div className="pt-2 border-t border-[#181d26]">
                  <ConfidenceBadge
                    confidence={node.confidence || 'HIGH'}
                    score={node.confidenceScore}
                    explanation={node.confidenceExplanation}
                    interpretation={node.confidenceInterpretation}
                    reasoning={node.confidenceReasoning}
                    size="sm"
                    showScoreBar={true}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between pt-1 border-t border-[#181d26]">
                <span className="text-[#7e8695] italic text-[11px]">No verified attribution record</span>
                {onOpenAttributionModal && (
                  <button
                    type="button"
                    onClick={onOpenAttributionModal}
                    className="text-xs text-[#f5d13b] hover:text-[#fef08a] underline cursor-pointer font-mono"
                  >
                    + Add attribution
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 2b. Risk Intelligence (Separated from Attribution Confidence) */}
        {node.riskLevel && (
          <div className="space-y-1.5 pb-4 border-b border-[#1c222c]">
            <span className="text-[10px] font-mono uppercase text-[#5e6676] tracking-wider block">
              Behavioral Risk Indicator
            </span>
            <div className="flex items-center justify-between p-2 bg-[#0a0c10] border border-[#1e242f]">
              <span className="font-mono text-[11px] text-[#7e8695]">Analytical Risk:</span>
              <span
                className={`font-mono text-[10px] font-semibold px-2 py-0.5 border ${
                  node.riskLevel === 'CRITICAL'
                    ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                    : node.riskLevel === 'HIGH'
                    ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                    : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                }`}
              >
                {node.riskLevel} {node.riskScore ? `(${node.riskScore}/100)` : ''}
              </span>
            </div>
          </div>
        )}

        {/* 3. Balance / Volume */}
        <div className="space-y-3 pb-4 border-b border-[#1c222c]">
          <span className="text-[10px] font-mono uppercase text-[#5e6676] tracking-wider block">
            Ledger Balances & Volume
          </span>

          <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
            <div>
              <span className="text-[#5e6676] block">Balance:</span>
              <span className={`font-semibold ${node.asset === 'BTC' ? 'text-[#f5d13b]' : 'text-zinc-200'}`}>
                {node.balance}
              </span>
            </div>
            <div>
              <span className="text-[#5e6676] block">Transactions:</span>
              <span className="text-zinc-200">{node.txCount} txs</span>
            </div>
            <div>
              <span className="text-[#5e6676] block">Inflow:</span>
              <span className={node.asset === 'BTC' ? 'text-[#f5d13b]' : 'text-emerald-400'}>
                {node.incomingVolume}
              </span>
            </div>
            <div>
              <span className="text-[#5e6676] block">Outflow:</span>
              <span className="text-zinc-300">{node.outgoingVolume}</span>
            </div>
          </div>
        </div>

        {/* 4. Related Transactions */}
        <div className="space-y-2 pb-4 border-b border-[#1c222c]">
          <span className="text-[10px] font-mono uppercase text-[#5e6676] tracking-wider block">
            Associated Inflows & Outflows ({relatedEdges.length})
          </span>

          <div className="space-y-2">
            {relatedEdges.map((edge) => {
              const isOutflow = edge.from.toLowerCase() === node.address.toLowerCase();
              return (
                <div
                  key={edge.id}
                  className="p-2 bg-[#0a0c10] border border-[#1e242f] text-[11px] font-mono flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className={isOutflow ? 'text-rose-400' : 'text-emerald-400'}>
                      {isOutflow ? 'OUT' : 'IN'}
                    </span>
                    <span className="text-zinc-200">
                      {edge.amount} {edge.asset}
                    </span>
                  </div>

                  <span className="text-[#5e6676]">
                    Hop {edge.hop}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Supporting Evidence (Expandable) */}
        {node.confidenceReasoning && node.confidenceReasoning.length > 0 && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setEvidenceExpanded(!evidenceExpanded)}
              className="w-full flex items-center justify-between text-[10px] font-mono uppercase text-[#7e8695] hover:text-white cursor-pointer"
            >
              <span>Supporting Evidence ({node.confidenceReasoning.length})</span>
              {evidenceExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {evidenceExpanded && (
              <div className="space-y-2 pt-1">
                {node.confidenceReasoning.map((reason, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-[#0a0c10] border border-[#1e242f] text-[11px] text-[#9aa2b1] leading-relaxed"
                  >
                    {reason}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
