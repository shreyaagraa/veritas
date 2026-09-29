/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TransactionEdge, WalletNode } from '../../types/investigation';
import { AddressDisplay } from '../common/AddressDisplay';

interface TimelineViewProps {
  edges: TransactionEdge[];
  nodes: WalletNode[];
  onSelectAddress: (address: string) => void;
  onSelectEdge: (edge: TransactionEdge) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  edges,
  nodes,
  onSelectAddress,
  onSelectEdge,
}) => {
  const sortedEdges = [...edges].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const getNode = (addr: string) =>
    nodes.find((n) => n.address.toLowerCase() === addr.toLowerCase());

  return (
    <div className="h-full bg-[#090b0e] text-zinc-100 p-6 overflow-y-auto text-xs">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="border-b border-[#1b212c] pb-3">
          <h3 className="text-xs font-semibold tracking-wider text-zinc-200 uppercase font-mono">
            Sequential Fund Movement Narrative
          </h3>
          <p className="text-xs text-[#7e8695] mt-1">
            Chronological audit trail of funds traced from initial source to terminal attribution.
          </p>
        </div>

        <div className="border-l border-[#1b212c] ml-2 pl-6 space-y-8 relative">
          {sortedEdges.map((edge, idx) => {
            const sender = getNode(edge.from);
            const recipient = getNode(edge.to);
            const isLast = idx === sortedEdges.length - 1;

            const timeStr = new Date(edge.timestamp).toLocaleTimeString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={edge.id}
                onClick={() => onSelectEdge(edge)}
                className="relative cursor-pointer group space-y-1.5"
              >
                {/* Timeline node dot */}
                <div
                  className={`absolute -left-[30px] top-1.5 w-2 h-2 rounded-full ${
                    isLast
                      ? 'bg-emerald-400'
                      : idx === 0
                      ? 'bg-rose-500'
                      : 'bg-[#2b3547]'
                  }`}
                />

                {/* Step Metadata */}
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="text-zinc-200 font-medium">{timeStr}</span>
                  <span className="text-[#3b4556]">·</span>
                  <span className="text-[#7e8695]">Hop {edge.hop}</span>
                  <span className="text-[#3b4556]">·</span>
                  <span className="text-white font-medium tabular-nums">
                    {edge.amount} {edge.asset}
                  </span>
                </div>

                {/* Movement Parties */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <AddressDisplay
                      address={edge.from}
                      entityName={sender?.entityName}
                      role={sender?.role}
                      onAddressClick={onSelectAddress}
                    />
                    <span className="text-[#5e6678] font-mono">→</span>
                    <AddressDisplay
                      address={edge.to}
                      entityName={recipient?.entityName}
                      role={recipient?.role}
                      onAddressClick={onSelectAddress}
                    />
                  </div>

                  {recipient?.entityName && isLast && (
                    <div className="text-[11px] text-emerald-400 font-sans mt-1">
                      Terminal consolidation: Funds received into {recipient.entityName} custodial infrastructure.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
