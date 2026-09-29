/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TransactionEdge } from '../../types/investigation';
import { AddressDisplay } from '../common/AddressDisplay';
import { X, ExternalLink } from 'lucide-react';

interface EdgeDetailPanelProps {
  edge: TransactionEdge | null;
  onClose: () => void;
  onSelectAddress: (address: string) => void;
}

export const EdgeDetailPanel: React.FC<EdgeDetailPanelProps> = ({
  edge,
  onClose,
  onSelectAddress,
}) => {
  if (!edge) return null;

  return (
    <div className="h-full bg-[#0d1015] text-zinc-100 flex flex-col overflow-y-auto text-xs font-sans">
      {/* Header */}
      <div className="p-5 border-b border-[#1c222c] flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            {edge.asset === 'BTC' && (
              <span className="text-[10px] font-mono text-[#f5d13b] bg-[#f5d13b]/15 px-1 py-0.2 font-bold">
                ₿ BTC
              </span>
            )}
            <span className={`font-mono text-[10px] uppercase tracking-wider block ${edge.asset === 'BTC' ? 'text-[#f5d13b]' : 'text-[#7e8695]'}`}>
              Hop {edge.hop} Transaction {edge.isPrimaryPath ? '· Primary Peeling Route' : ''}
            </span>
          </div>
          <h3 className={`text-base font-bold font-mono ${edge.asset === 'BTC' ? 'text-[#f5d13b]' : 'text-white'}`}>
            {edge.amount} {edge.asset}
          </h3>
          <div className="font-mono text-[11px] text-[#5e6676]">
            Block #{edge.blockNumber}
          </div>
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
        {/* Parties */}
        <div className="space-y-3 pb-4 border-b border-[#1c222c]">
          <span className="text-[10px] font-mono uppercase text-[#5e6676] tracking-wider block">
            Transaction Counterparties
          </span>

          <div className="space-y-2">
            <div>
              <span className="text-[10px] font-mono text-[#7e8695] block">Origin (From):</span>
              <AddressDisplay
                address={edge.from}
                isTruncated={true}
                onAddressClick={onSelectAddress}
                className="text-xs text-zinc-200"
              />
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#7e8695] block">Recipient (To):</span>
              <AddressDisplay
                address={edge.to}
                isTruncated={true}
                onAddressClick={onSelectAddress}
                className="text-xs text-zinc-200"
              />
            </div>
          </div>
        </div>

        {/* Transaction Metadata */}
        <div className="space-y-3 pb-4 border-b border-[#1c222c]">
          <span className="text-[10px] font-mono uppercase text-[#5e6676] tracking-wider block">
            Cryptographic Proof & Execution
          </span>

          <div className="space-y-2 font-mono text-[11px]">
            <div>
              <span className="text-[#5e6676] block">Transaction Hash:</span>
              <span className="text-zinc-200 break-all">{edge.txHash}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[#5e6676] block">Estimated Value:</span>
                <span className="text-white">{edge.usdValueEstimate || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[#5e6676] block">Network Fee:</span>
                <span className="text-zinc-300">{edge.fee || 'Standard'}</span>
              </div>
            </div>

            <div className="pt-1">
              <span className="text-[#5e6676] block">Deterministic Timestamp:</span>
              <span className="text-zinc-300">
                {new Date(edge.timestamp).toUTCString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action: Copy Explorer Link */}
        <div className="pt-2">
          <a
            href={`https://etherscan.io/tx/${edge.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 font-mono cursor-pointer"
          >
            <span>Inspect on Blockchain Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
