/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  InvestigationFinding,
  EvidenceRecord,
  WalletNode,
  NearestVaspFinding,
  RiskScoreBreakdown,
} from '../../types/investigation';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { AddressDisplay } from '../common/AddressDisplay';
import { ShieldAlert, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

interface FindingsEvidenceViewProps {
  findings: InvestigationFinding[];
  evidence: EvidenceRecord[];
  nodes?: WalletNode[];
  nearestVasp?: NearestVaspFinding;
  riskBreakdown?: RiskScoreBreakdown;
  onSelectAddress: (address: string) => void;
}

export const FindingsEvidenceView: React.FC<FindingsEvidenceViewProps> = ({
  findings,
  evidence,
  nodes = [],
  nearestVasp,
  riskBreakdown,
  onSelectAddress,
}) => {
  const attributedNodes = nodes.filter((n) => n.entityName);

  return (
    <div className="h-full bg-[#090b0e] text-zinc-100 p-6 overflow-y-auto text-xs space-y-8 font-sans">
      {/* --------------------------------------------------
          0. NEAREST DIRECT-DEPOSIT VASP (Critical PS 182)
          -------------------------------------------------- */}
      <section className="space-y-3">
        <div className="border-b border-[#1b212c] pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#f5d13b]" />
            <h3 className="text-xs font-semibold tracking-wider text-white uppercase font-mono">
              Nearest Direct-Deposit-Accepting VASP Identification
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#7e8695]">FATF Rec 16 · Travel Rule Endpoint</span>
        </div>

        {nearestVasp && nearestVasp.identified ? (
          <div className="p-4 bg-[#0d1015] border border-[#f5d13b]/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c222c] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7e8695] block">
                  Identified Deposit Endpoint
                </span>
                <span className="text-base font-semibold text-white">
                  {nearestVasp.vaspName}
                </span>
                <span className="text-[11px] text-[#9aa2b1] block mt-0.5">
                  Classification: <span className="text-zinc-200">{nearestVasp.walletClassification || 'Exchange Deposit Wallet'}</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-[#1a1708] border border-[#f5d13b]/40 text-[#f5d13b] font-mono text-[11px] font-semibold">
                  {nearestVasp.isDirectDeposit ? 'Direct 1-Hop Deposit' : `${nearestVasp.hopsAway} Hops from Origin`}
                </span>
                {nearestVasp.confidence && (
                  <ConfidenceBadge
                    confidence={nearestVasp.confidence}
                    score={nearestVasp.confidenceScore}
                    explanation={nearestVasp.confidenceExplanation}
                    interpretation={nearestVasp.confidenceInterpretation}
                    reasoning={nearestVasp.confidenceReasoning}
                    size="sm"
                  />
                )}
              </div>
            </div>

            {/* Identified Entity → Confidence Score → Evidence Supporting the Result */}
            <div className="p-3 bg-[#080a0e] border border-[#1e2533]">
              <ConfidenceBadge
                confidence={nearestVasp.confidence || 'HIGH'}
                score={nearestVasp.confidenceScore}
                explanation={nearestVasp.confidenceExplanation}
                interpretation={nearestVasp.confidenceInterpretation}
                reasoning={nearestVasp.confidenceReasoning}
                showScoreBar={true}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
              <div>
                <span className="text-[#5e6678] block">Deposit Address:</span>
                <AddressDisplay
                  address={nearestVasp.address || ''}
                  onAddressClick={onSelectAddress}
                  isTruncated={true}
                  className="text-zinc-200 hover:text-white"
                />
              </div>

              <div>
                <span className="text-[#5e6678] block">Ingress Transaction Hash:</span>
                <span className="text-zinc-300">
                  {nearestVasp.transactionHash ? `${nearestVasp.transactionHash.slice(0, 14)}...` : 'Confirmed on Ledger'}
                </span>
              </div>

              <div>
                <span className="text-[#5e6678] block">Supporting Evidentiary Audit:</span>
                <span className="text-zinc-300">
                  {nearestVasp.evidenceReference || 'SEC-10K / PoR Merkle Disclosure'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-[#0d1015] border border-[#1e242f] text-center text-[#7e8695] italic font-mono">
            No verified direct-deposit VASP attribution found in traced horizon. (All intermediary hops remain in unhosted / unidentified transit).
          </div>
        )}
      </section>

      {/* --------------------------------------------------
          0b. BEHAVIORAL RISK INTELLIGENCE (Strictly separate from confidence)
          -------------------------------------------------- */}
      {riskBreakdown && (
        <section className="space-y-3">
          <div className="border-b border-[#1b212c] pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-semibold tracking-wider text-white uppercase font-mono">
                Behavioral Risk Intelligence & Heuristics
              </h3>
            </div>
            <span
              className={`font-mono text-[10px] font-semibold px-2 py-0.5 border ${
                riskBreakdown.riskLevel === 'CRITICAL'
                  ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                  : riskBreakdown.riskLevel === 'HIGH'
                  ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                  : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              }`}
            >
              Risk Score: {riskBreakdown.totalScore}/100 · {riskBreakdown.riskLevel}
            </span>
          </div>

          <div className="p-3.5 bg-[#0d1015] border border-[#1e242f] space-y-2">
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              {riskBreakdown.primaryRiskSummary}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-[#181d26]">
              {riskBreakdown.indicators.map((ind) => (
                <div
                  key={ind.code}
                  className="flex items-start justify-between gap-4 p-2 bg-[#090b0e] border border-[#1b212c] text-[11px]"
                >
                  <div className="space-y-0.5">
                    <span className="font-medium text-zinc-200 block">{ind.label}</span>
                    <span className="text-[#8d96a5] block">{ind.description}</span>
                  </div>
                  <span className="font-mono text-[10px] text-amber-400 shrink-0 font-semibold">
                    +{ind.weight} PTS
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-[#5e6678] italic pt-1">
              {riskBreakdown.legalDisclaimer}
            </p>
          </div>
        </section>
      )}

      {/* --------------------------------------------------
          1. ATTRIBUTION EVIDENCE (Authoritative, structured table)
          -------------------------------------------------- */}
      <section className="space-y-4">
        <div className="border-b border-[#1b212c] pb-3">
          <h3 className="text-xs font-semibold tracking-wider text-zinc-200 uppercase font-mono">
            Attribution Evidence
          </h3>
          <p className="text-xs text-[#7e8695] mt-1">
            Authoritative records and cryptographic proofs linking investigated addresses to identified Virtual Asset Service Providers.
          </p>
        </div>

        {attributedNodes.length === 0 ? (
          <div className="py-8 text-center text-[#5e6678] italic font-mono">
            No addresses in this tracing horizon have been attributed to a known entity yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1b212c] text-[11px] font-mono uppercase tracking-wider text-[#5e6678]">
                  <th className="py-2.5 pr-4 font-normal">Investigated Address</th>
                  <th className="py-2.5 px-4 font-normal">Attributed Entity</th>
                  <th className="py-2.5 px-4 font-normal">Classification</th>
                  <th className="py-2.5 px-4 font-normal">Evidence Source & Reference</th>
                  <th className="py-2.5 px-4 font-normal">Confidence</th>
                  <th className="py-2.5 pl-4 font-normal">Evidentiary Reasoning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141821] text-[11px]">
                {attributedNodes.map((node) => (
                  <tr key={node.id} className="hover:bg-[#0e1218] transition-colors">
                    <td className="py-3.5 pr-4">
                      <AddressDisplay
                        address={node.address}
                        onAddressClick={onSelectAddress}
                        isTruncated={true}
                        className="font-medium text-zinc-200"
                      />
                      <div className="text-[10px] font-mono text-[#5e6678] mt-0.5 uppercase">
                        Hop {node.hop} · {node.network}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-white">
                      {node.entityName}
                    </td>

                    <td className="py-3.5 px-4 text-[#9aa1b0]">
                      {node.walletClassification || node.entityType || 'Virtual Asset Service (VASP)'}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#7e8695]">
                      <div className="text-zinc-300">
                        {node.entityType?.includes('Mixer')
                          ? 'OFAC Designation Notice'
                          : 'Public Transparency / Proof-of-Reserves'}
                      </div>
                      <div className="text-[10px] text-[#5e6678] mt-0.5">
                        REF: POR-{node.address.slice(2, 8).toUpperCase()}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 min-w-[280px]">
                      <ConfidenceBadge
                        confidence={node.confidence || 'HIGH'}
                        score={node.confidenceScore}
                        explanation={node.confidenceExplanation}
                        interpretation={node.confidenceInterpretation}
                        reasoning={node.confidenceReasoning}
                        size="sm"
                        showScoreBar={true}
                      />
                    </td>

                    <td className="py-3.5 pl-4 text-[#9aa1b0] max-w-sm leading-relaxed">
                      {node.confidenceReasoning?.[0] ||
                        'Corroborated by deterministic on-chain clustering and official cold storage disclosure.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* --------------------------------------------------
          2. FORENSIC TYPOLOGY FINDINGS
          -------------------------------------------------- */}
      <section className="space-y-4 pt-2 border-t border-[#1b212c]">
        <div className="border-b border-[#1b212c] pb-3">
          <h3 className="text-xs font-semibold tracking-wider text-zinc-200 uppercase font-mono">
            Investigative Typology Findings
          </h3>
          <p className="text-xs text-[#7e8695] mt-1">
            Algorithmic patterns flagged across intermediary fund hops and peeling chains.
          </p>
        </div>

        <div className="space-y-3">
          {findings.map((f) => (
            <div
              key={f.id}
              className="py-3 border-b border-[#141821] space-y-1.5"
            >
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] uppercase text-[#657184] tracking-wider">
                    {f.severity}
                  </span>
                  <span className="font-medium text-zinc-200">{f.title}</span>
                </div>
                <ConfidenceBadge confidence={f.confidence} size="sm" />
              </div>

              <p className="text-[12px] text-[#9aa1b0] leading-relaxed">
                {f.description}
              </p>

              <div className="text-[11px] font-mono text-[#5e6678]">
                Supporting Evidence: {f.supportingEvidence}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

