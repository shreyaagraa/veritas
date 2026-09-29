/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TransactionEdge } from '../../types/investigation';
import { AddressDisplay } from '../common/AddressDisplay';

interface TransactionTableProps {
  edges: TransactionEdge[];
  selectedEdgeId: string | null;
  onSelectEdge: (edge: TransactionEdge) => void;
  onSelectAddress: (address: string) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  edges,
  selectedEdgeId,
  onSelectEdge,
  onSelectAddress,
}) => {
  return (
    <div className="h-full overflow-y-auto bg-[#0a0c10]">
      <table className="w-full text-left border-collapse text-xs">
        <thead className="sticky top-0 bg-[#0a0c10] z-10">
          <tr className="border-b border-[#1e242f] text-[11px] font-mono uppercase tracking-wider text-[#5e6676]">
            <th className="py-2.5 px-4 font-normal">Hop</th>
            <th className="py-2.5 px-4 font-normal">From</th>
            <th className="py-2.5 px-4 font-normal">To</th>
            <th className="py-2.5 px-4 font-normal text-right">Amount</th>
            <th className="py-2.5 px-4 font-normal">Timestamp</th>
            <th className="py-2.5 px-4 font-normal">Transaction Hash</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#151921] font-mono text-[11px]">
          {edges.map((edge) => {
            const isSelected = selectedEdgeId === edge.id;
            const isBtcOrPrimary = edge.asset === 'BTC' || edge.isPrimaryPath;
            return (
              <tr
                key={edge.id}
                onClick={() => onSelectEdge(edge)}
                className={`transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#141824] text-white border-l-2 border-[#f5d13b]'
                    : 'hover:bg-[#0e1218] text-zinc-300'
                }`}
              >
                <td className="py-2.5 px-4">
                  {isBtcOrPrimary ? (
                    <span className="text-[#f5d13b] font-semibold">H{edge.hop}*</span>
                  ) : (
                    <span className="text-[#7e8695]">H{edge.hop}</span>
                  )}
                </td>

                <td className="py-2.5 px-4">
                  <AddressDisplay
                    address={edge.from}
                    isTruncated={true}
                    onAddressClick={onSelectAddress}
                    className="font-normal"
                  />
                </td>

                <td className="py-2.5 px-4">
                  <AddressDisplay
                    address={edge.to}
                    isTruncated={true}
                    onAddressClick={onSelectAddress}
                    className="font-normal"
                  />
                </td>

                <td className="py-2.5 px-4 text-right">
                  <span className={`font-semibold ${isBtcOrPrimary ? 'text-[#f5d13b]' : 'text-white'}`}>
                    {edge.amount} {edge.asset}
                  </span>
                </td>

                <td className="py-2.5 px-4 text-[#7e8695]">
                  {new Date(edge.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>

                <td className="py-2.5 px-4 text-[#5e6676] hover:text-[#f5d13b] transition-colors">
                  {edge.txHash.slice(0, 10)}...{edge.txHash.slice(-6)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
