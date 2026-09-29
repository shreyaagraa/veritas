/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { AttributionRecord, EntityType, ConfidenceLevel } from '../../types/investigation';
import { AddressDisplay } from '../common/AddressDisplay';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { Search, Plus, X } from 'lucide-react';

interface AttributionDatabaseViewProps {
  attributions: AttributionRecord[];
  onAddAttribution: (
    record: Omit<AttributionRecord, 'id' | 'firstVerified' | 'lastVerified'>
  ) => void;
  onUpdateAttribution: (id: string, updates: Partial<AttributionRecord>) => void;
}

export const AttributionDatabaseView: React.FC<AttributionDatabaseViewProps> = ({
  attributions,
  onAddAttribution,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [confidenceFilter, setConfidenceFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form fields for new attribution
  const [newAddress, setNewAddress] = useState('');
  const [newEntity, setNewEntity] = useState('');
  const [newType, setNewType] = useState<EntityType>('Virtual Asset Service (VASP)');
  const [newConfidence, setNewConfidence] = useState<ConfidenceLevel>('HIGH');
  const [newSource, setNewSource] = useState('Proof-of-Reserves Audit');
  const [newReason, setNewReason] = useState('');

  const filteredAttributions = useMemo(() => {
    return attributions.filter((attr) => {
      const q = search.toLowerCase();
      const matchesSearch =
        attr.address.toLowerCase().includes(q) ||
        attr.entityName.toLowerCase().includes(q) ||
        attr.evidenceSource.toLowerCase().includes(q);
      const matchesType = typeFilter === 'all' || attr.entityType === typeFilter;
      const matchesConf = confidenceFilter === 'all' || attr.confidence === confidenceFilter;
      return matchesSearch && matchesType && matchesConf;
    });
  }, [attributions, search, typeFilter, confidenceFilter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim() || !newEntity.trim()) return;

    onAddAttribution({
      address: newAddress.trim(),
      network: 'ethereum',
      entityId: `ent-${newEntity.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      entityName: newEntity.trim(),
      entityType: newType,
      associationType: 'Custodial Deposit Cluster',
      confidence: newConfidence,
      confidenceReasoning: newReason ? [newReason] : ['Institutional compliance cross-match'],
      status: 'active',
      evidenceSource: newSource,
      evidenceReference: `VER-${Date.now().toString().slice(-4)}`,
      evidenceDate: new Date().toISOString(),
      notes: 'Added via analyst intelligence intake',
    });

    setIsAddModalOpen(false);
    setNewAddress('');
    setNewEntity('');
    setNewReason('');
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Header: Curated intelligence reference title */}
        <div className="border-b border-[#1e242f] pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white font-serif">
              Attribution Database
            </h1>
            <p className="mt-2 text-sm text-[#9aa2b1] max-w-2xl leading-relaxed">
              Curated registry of cryptocurrency addresses attributed to regulated Virtual Asset
              Service Providers, institutional custodians, and illicit infrastructure.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 px-4 bg-[#f5d13b] hover:bg-[#fef08a] text-black font-semibold text-xs tracking-tight rounded-none transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-[0_0_12px_rgba(245,209,59,0.2)]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Submit Attribution</span>
          </button>
        </div>

        {/* Filters: Simple, useful, calm */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#5e6676] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by address, entity name, or source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-[#0f1217] border border-[#232a36] text-xs font-mono text-zinc-100 placeholder-[#5e6676] focus:outline-none focus:border-[#f5d13b] transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-[#7e8695]">
            <div className="flex items-center gap-1.5">
              <span>Entity Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-8 px-2 bg-[#0f1217] border border-[#232a36] text-xs text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="Virtual Asset Service (VASP)">VASP</option>
                <option value="Exchange">Exchange</option>
                <option value="Custodian">Custodian</option>
                <option value="Mixer / Privacy Protocol">Mixer / Privacy Protocol</option>
                <option value="DeFi Protocol">DeFi Protocol</option>
                <option value="Sanctioned Entity">Sanctioned Entity</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span>Confidence:</span>
              <select
                value={confidenceFilter}
                onChange={(e) => setConfidenceFilter(e.target.value)}
                className="h-8 px-2 bg-[#0f1217] border border-[#232a36] text-xs text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="HIGH">High Only</option>
                <option value="MEDIUM">Medium Only</option>
                <option value="LOW">Low Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clean Searchable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1e242f] text-[11px] font-mono uppercase tracking-wider text-[#5e6676]">
                <th className="py-2.5 pr-4 font-normal">Address</th>
                <th className="py-2.5 px-4 font-normal">Entity</th>
                <th className="py-2.5 px-4 font-normal">Type</th>
                <th className="py-2.5 px-4 font-normal">Confidence</th>
                <th className="py-2.5 px-4 font-normal">Evidence Source</th>
                <th className="py-2.5 pl-4 font-normal text-right">Last Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181d26]">
              {filteredAttributions.map((attr) => (
                <tr key={attr.id} className="hover:bg-[#0f131a] transition-colors">
                  <td className="py-3 pr-4">
                    <AddressDisplay
                      address={attr.address}
                      isTruncated={true}
                      className="font-medium text-zinc-200"
                    />
                    <div className="text-[10px] font-mono mt-0.5 uppercase">
                      {attr.network === 'bitcoin' ? (
                        <span className="text-[#f5d13b] font-bold">₿ BITCOIN</span>
                      ) : (
                        <span className="text-[#5e6676]">{attr.network}</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-medium text-white">
                    {attr.entityName}
                  </td>

                  <td className="py-3 px-4 text-[#9aa2b1]">
                    {attr.entityType}
                  </td>

                  <td className="py-3 px-4 min-w-[270px]">
                    <ConfidenceBadge
                      confidence={attr.confidence}
                      score={attr.confidenceScore}
                      explanation={attr.confidenceExplanation}
                      interpretation={attr.confidenceInterpretation}
                      reasoning={attr.confidenceReasoning}
                      size="sm"
                      showScoreBar={true}
                    />
                  </td>

                  <td className="py-3 px-4 text-[#9aa2b1]">
                    <div>{attr.evidenceSource}</div>
                    <div className="font-mono text-[10px] text-[#5e6676] mt-0.5">
                      {attr.evidenceReference}
                    </div>
                  </td>

                  <td className="py-3 pl-4 text-right font-mono text-[11px] text-[#7e8695]">
                    {new Date(attr.lastVerified).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Attribution Modal (Clean, restrained dialog) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-[2px] p-4">
          <div className="w-full max-w-lg bg-[#101319] border border-[#232a36] p-6 shadow-2xl space-y-6 text-zinc-100">
            <div className="flex items-center justify-between border-b border-[#1e242f] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#5e6676]">
                  Intelligence Registry
                </span>
                <h3 className="text-base font-semibold text-white">
                  Submit Verified Attribution
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#7e8695] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block font-mono text-[11px] uppercase">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full h-9 px-3 bg-[#0a0c10] border border-[#232a36] text-xs font-mono text-white focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium block font-mono text-[11px] uppercase">
                    Entity Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEntity}
                    onChange={(e) => setNewEntity(e.target.value)}
                    placeholder="e.g. Coinbase Custody"
                    className="w-full h-9 px-3 bg-[#0a0c10] border border-[#232a36] text-xs text-white focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium block font-mono text-[11px] uppercase">
                    Classification
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full h-9 px-2 bg-[#0a0c10] border border-[#232a36] text-xs text-white focus:outline-none"
                  >
                    <option value="Virtual Asset Service (VASP)">Virtual Asset Service (VASP)</option>
                    <option value="Exchange">Exchange</option>
                    <option value="Custodian">Custodian</option>
                    <option value="DeFi Protocol">DeFi Protocol</option>
                    <option value="Mixer / Privacy Protocol">Mixer / Privacy Protocol</option>
                    <option value="Sanctioned Entity">Sanctioned Entity</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium block font-mono text-[11px] uppercase">
                    Confidence Assessment
                  </label>
                  <select
                    value={newConfidence}
                    onChange={(e) => setNewConfidence(e.target.value as any)}
                    className="w-full h-9 px-2 bg-[#0a0c10] border border-[#232a36] text-xs text-white focus:outline-none"
                  >
                    <option value="HIGH">High (Proof-of-Reserves / Regulated)</option>
                    <option value="MEDIUM">Medium (Clustering / Multi-deposit)</option>
                    <option value="LOW">Low (Single Heuristic)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium block font-mono text-[11px] uppercase">
                    Evidence Source
                  </label>
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full h-9 px-3 bg-[#0a0c10] border border-[#232a36] text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium block font-mono text-[11px] uppercase">
                  Reasoning Criteria
                </label>
                <textarea
                  rows={2}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="e.g. Disclosed in Q4 Transparency Report, verified via cryptographic signature"
                  className="w-full p-2.5 bg-[#0a0c10] border border-[#232a36] text-xs text-white focus:outline-none"
                />
              </div>

              <div className="border-t border-[#1e242f] pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-[#7e8695] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#f5d13b] hover:bg-[#fef08a] text-black font-semibold text-xs rounded-none cursor-pointer shadow-[0_0_10px_rgba(245,209,59,0.2)]"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
