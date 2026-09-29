/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Investigation } from '../../types/investigation';
import { AddressDisplay } from '../common/AddressDisplay';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { Search, Plus, Trash2, Copy, FileText, ArrowRight } from 'lucide-react';

interface HistoryViewProps {
  investigations: Investigation[];
  onOpenInvestigation: (id: string) => void;
  onDuplicateInvestigation: (inv: Investigation) => void;
  onDeleteInvestigation: (id: string) => void;
  onGenerateReport: (inv: Investigation) => void;
  onNavigateStart: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  investigations,
  onOpenInvestigation,
  onDuplicateInvestigation,
  onDeleteInvestigation,
  onGenerateReport,
  onNavigateStart,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [networkFilter, setNetworkFilter] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredInvestigations = useMemo(() => {
    return investigations.filter((inv) => {
      const q = search.toLowerCase();
      const matchesSearch =
        inv.caseName.toLowerCase().includes(q) ||
        inv.caseReference.toLowerCase().includes(q) ||
        inv.startingAddress.toLowerCase().includes(q) ||
        (inv.summary.finalKnownEntity &&
          inv.summary.finalKnownEntity.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      const matchesNetwork = networkFilter === 'all' || inv.network === networkFilter;

      return matchesSearch && matchesStatus && matchesNetwork;
    });
  }, [investigations, search, statusFilter, networkFilter]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteConfirmId === id) {
      onDeleteInvestigation(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="border-b border-[#1e242f] pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white font-serif">
              Investigations
            </h1>
            <p className="mt-2 text-sm text-[#9aa2b1] max-w-2xl leading-relaxed">
              Active forensics workspaces, multi-hop fund graph reconstructions, and case records.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateStart}
            className="h-9 px-4 bg-[#f5d13b] hover:bg-[#fef08a] text-black font-semibold text-xs tracking-tight rounded-none transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-[0_0_12px_rgba(245,209,59,0.2)]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Start Investigation</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#5e6676] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search case name, reference, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-[#0f1217] border border-[#232a36] text-xs font-mono text-zinc-100 placeholder-[#5e6676] focus:outline-none focus:border-[#f5d13b] transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-[#7e8695]">
            <div className="flex items-center gap-1.5">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 px-2 bg-[#0f1217] border border-[#232a36] text-xs text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="running">Running</option>
                <option value="requires_review">Requires Review</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span>Network:</span>
              <select
                value={networkFilter}
                onChange={(e) => setNetworkFilter(e.target.value)}
                className="h-8 px-2 bg-[#0f1217] border border-[#232a36] text-xs text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Networks</option>
                <option value="ethereum">Ethereum</option>
                <option value="bitcoin">Bitcoin</option>
                <option value="polygon">Polygon</option>
                <option value="arbitrum">Arbitrum</option>
              </select>
            </div>
          </div>
        </div>

        {/* Structured Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1e242f] text-[11px] font-mono uppercase tracking-wider text-[#5e6676]">
                <th className="py-2.5 pr-4 font-normal">Case & Reference</th>
                <th className="py-2.5 px-4 font-normal">Investigated Address</th>
                <th className="py-2.5 px-4 font-normal">Network</th>
                <th className="py-2.5 px-4 font-normal">Terminal Entity</th>
                <th className="py-2.5 px-4 font-normal">Confidence</th>
                <th className="py-2.5 px-4 font-normal">Created</th>
                <th className="py-2.5 pl-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181d26]">
              {filteredInvestigations.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => onOpenInvestigation(inv.id)}
                  className="hover:bg-[#0f131a] transition-colors cursor-pointer group"
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
                    {inv.summary.finalKnownEntity ? (
                      <div className="font-medium text-zinc-200">
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

                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#7e8695]">
                    {new Date(inv.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>

                  <td className="py-3.5 pl-4 text-right">
                    <div
                      className="inline-flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onGenerateReport(inv)}
                        className="text-[#7e8695] hover:text-zinc-200 p-1 cursor-pointer"
                        title="View Dossier"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicateInvestigation(inv)}
                        className="text-[#7e8695] hover:text-zinc-200 p-1 cursor-pointer"
                        title="Duplicate Case"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(inv.id, e)}
                        className={`p-1 transition-colors cursor-pointer ${
                          deleteConfirmId === inv.id
                            ? 'text-rose-400 font-bold'
                            : 'text-[#5e6676] hover:text-rose-400'
                        }`}
                        title={deleteConfirmId === inv.id ? 'Click to confirm delete' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenInvestigation(inv.id)}
                        className="text-xs text-zinc-300 hover:text-white font-medium ml-1 cursor-pointer"
                      >
                        Open →
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
