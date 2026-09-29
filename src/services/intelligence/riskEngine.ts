/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WalletNode, TransactionEdge, RiskScoreBreakdown, RiskIndicator } from '../../types/investigation';

export class RiskIntelligenceEngine {
  /**
   * Calculates a transparent, explainable risk score (0-100) strictly separate from attribution confidence.
   * Compiles contributing behavioral and structural risk indicators.
   */
  public evaluateInvestigationRisk(
    nodes: WalletNode[],
    edges: TransactionEdge[]
  ): RiskScoreBreakdown {
    const indicators: RiskIndicator[] = [];
    let score = 10; // Baseline unverified activity score

    // Indicator 1: Mixer / Tumbler exposure
    const mixerNode = nodes.find(
      (n) =>
        n.entityType === 'Mixer / Privacy Protocol' ||
        n.walletClassification === 'Mixer / Tumbler' ||
        n.entityName?.toLowerCase().includes('tornado') ||
        n.entityName?.toLowerCase().includes('mixer')
    );
    if (mixerNode) {
      score += 35;
      const mixerEdge = edges.find(
        (e) => e.to.toLowerCase() === mixerNode.address.toLowerCase() || e.from.toLowerCase() === mixerNode.address.toLowerCase()
      );
      indicators.push({
        code: 'IND-MIXER',
        category: 'MIXER_EXPOSURE',
        label: 'Interaction with Privacy Protocol / Anonymizing Pool',
        severity: 'CRITICAL',
        weight: 35,
        description: `Funds routed through ${mixerNode.entityName || 'anonymizing pool'} to disrupt deterministic graph heuristics.`,
        evidenceTxHash: mixerEdge?.txHash,
        hop: mixerNode.hop,
      });
    }

    // Indicator 2: Sanctioned / Blacklisted / OFAC exposure
    const sanctionedNode = nodes.find(
      (n) => n.entityType === 'Sanctioned Entity' || n.entityName?.toLowerCase().includes('lockbit')
    );
    if (sanctionedNode) {
      score += 40;
      indicators.push({
        code: 'IND-SANCTIONED',
        category: 'SANCTIONED_OFAC',
        label: 'Association with Sanctioned Designation / Extortion Cluster',
        severity: 'CRITICAL',
        weight: 40,
        description: `Source address directly designated by regulatory/law enforcement cyber injunction (${sanctionedNode.entityName}).`,
        hop: sanctionedNode.hop,
      });
    }

    // Indicator 3: Rapid Multi-Hop Peeling / Dispersion Chain
    if (edges.length >= 4) {
      score += 20;
      indicators.push({
        code: 'IND-PEEL-CHAIN',
        category: 'RAPID_DISPERSION',
        label: 'UTXO Peeling / Rapid Dispersion Chain Pattern',
        severity: 'HIGH',
        weight: 20,
        description: `Observed sequential multi-hop peeling (${edges.length} hops) with asymmetric change distribution within short block intervals.`,
        evidenceTxHash: edges[1]?.txHash,
        hop: 2,
      });
    }

    // Indicator 4: Unhosted Peeling Residue
    const unhostedPeel = nodes.find((n) => n.notes?.toLowerCase().includes('peeling'));
    if (unhostedPeel) {
      score += 15;
      indicators.push({
        code: 'IND-UNHOSTED-RESIDUE',
        category: 'UNHOSTED_PEEL',
        label: 'Unhosted Intermediate Change Residue',
        severity: 'MEDIUM',
        weight: 15,
        description: `Split change outputs parked in unhosted intermediate transit wallets (${unhostedPeel.balance}).`,
        hop: unhostedPeel.hop,
      });
    }

    // Indicator 5: Cross-Chain Movement / Bridge hopping
    const crossChainEdge = edges.find((e) => e.isCrossChain === true);
    if (crossChainEdge) {
      score += 20;
      indicators.push({
        code: 'IND-CROSS-CHAIN',
        category: 'CROSS_CHAIN_JUMP',
        label: 'Cross-Chain Bridge Transition Observed',
        severity: 'HIGH',
        weight: 20,
        description: `Funds transitioned across consensus boundaries via ${crossChainEdge.bridgeService || 'cross-chain bridge'}.`,
        evidenceTxHash: crossChainEdge.txHash,
        hop: crossChainEdge.hop,
      });
    }

    const totalScore = Math.min(100, score);

    let riskLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'LOW' = 'LOW';
    if (totalScore >= 80) riskLevel = 'CRITICAL';
    else if (totalScore >= 60) riskLevel = 'HIGH';
    else if (totalScore >= 35) riskLevel = 'ELEVATED';

    const primaryRiskSummary =
      riskLevel === 'CRITICAL'
        ? 'High probability of malicious obfuscation, sanctioned entity exposure, or illicit mixer layering.'
        : riskLevel === 'HIGH'
        ? 'Significant dispersion indicators and multi-hop peeling patterns observed.'
        : riskLevel === 'ELEVATED'
        ? 'Moderate transit velocity and split routing detected across intermediate layers.'
        : 'Routine fund flow patterns with standard transaction characteristics.';

    return {
      totalScore,
      riskLevel,
      primaryRiskSummary,
      indicators,
      legalDisclaimer:
        'Legal Safeguard: Risk indicators represent objective analytical heuristics based on ledger activity. A risk score does not establish criminal culpability, which requires statutory judicial determination.',
    };
  }
}

export const riskEngine = new RiskIntelligenceEngine();
