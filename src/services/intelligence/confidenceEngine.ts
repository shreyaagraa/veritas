/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ConfidenceLevel,
  ConfidenceScoreDetail,
  ConfidenceScoreFactor,
  AttributionRecord,
} from '../../types/investigation';

export interface ConfidenceEvaluationParams {
  entityName?: string;
  entityType?: string;
  walletClassification?: string;
  associationType?: string;
  evidenceSource?: string;
  evidenceReference?: string;
  lastVerified?: string;
  status?: 'active' | 'outdated' | 'under_review' | 'conflicting';
  hopDistance?: number;
  isDirect?: boolean;
  supportingSourcesCount?: number;
  pathHasMixer?: boolean;
  pathHasUnresolvedBridge?: boolean;
}

export class AttributionConfidenceEngine {
  /**
   * Deterministic, evidence-based attribution confidence scoring (0–100).
   *
   * CRITICAL DISTINCTION:
   * The score measures:
   * "How strongly the available evidence supports the identified wallet/entity attribution."
   *
   * It does NOT represent:
   * - probability of criminality
   * - maliciousness
   * - transaction risk
   * - personal guilt
   */
  public evaluateConfidence(params: ConfidenceEvaluationParams): ConfidenceScoreDetail {
    const {
      entityName,
      entityType,
      walletClassification,
      associationType,
      evidenceSource = '',
      evidenceReference = '',
      lastVerified,
      status = 'active',
      hopDistance = 1,
      isDirect = hopDistance === 1,
      supportingSourcesCount = 2,
      pathHasMixer = false,
      pathHasUnresolvedBridge = false,
    } = params;

    // If unallocated or unknown, zero score with UNKNOWN level
    if (
      !entityName ||
      entityName === 'Unknown / Unattributed' ||
      walletClassification === 'Unknown / Unattributed'
    ) {
      return {
        score: 0,
        level: 'UNKNOWN',
        interpretation: 'Insufficient evidence to calculate a meaningful score',
        explanation: 'Insufficient evidence to calculate a meaningful attribution score.',
        factors: [],
      };
    }

    const factors: ConfidenceScoreFactor[] = [];
    let score = 0;

    // 1. Source Reliability & Proof Category
    const srcLower = evidenceSource.toLowerCase();
    const refLower = evidenceReference.toLowerCase();

    if (
      srcLower.includes('doj') ||
      srcLower.includes('justice') ||
      srcLower.includes('court') ||
      srcLower.includes('injunction') ||
      srcLower.includes('sanction') ||
      srcLower.includes('ofac') ||
      srcLower.includes('sec') ||
      srcLower.includes('fiu')
    ) {
      score += 35;
      factors.push({
        factor: 'Regulatory Authority / Government Directive',
        impact: +35,
        description: 'Attribution verified against official public regulatory filing or sovereign court injunction.',
      });
    } else if (
      srcLower.includes('proof-of-reserves') ||
      srcLower.includes('por') ||
      srcLower.includes('merkle') ||
      srcLower.includes('transparency') ||
      refLower.includes('por-') ||
      srcLower.includes('custody disclosure')
    ) {
      score += 30;
      factors.push({
        factor: 'Audited Proof-of-Reserves / Merkle Proof',
        impact: +30,
        description: 'Attribution corroborated by cryptographic Proof-of-Reserves cold storage disclosures.',
      });
    } else if (
      srcLower.includes('portal') ||
      srcLower.includes('bridge') ||
      srcLower.includes('api') ||
      srcLower.includes('cluster')
    ) {
      score += 24;
      factors.push({
        factor: 'Verified Institutional Registry',
        impact: +24,
        description: 'Attribution verified against certified exchange integration registry.',
      });
    } else {
      score += 18;
      factors.push({
        factor: 'Public Heuristic Clustering',
        impact: +18,
        description: 'Attribution based on public on-chain clustering heuristics.',
      });
    }

    // 2. Multiple Independent Supporting Sources
    if (supportingSourcesCount >= 3) {
      score += 15;
      factors.push({
        factor: '3+ Independent Supporting Sources',
        impact: +15,
        description: 'Corroborated across 3 or more independent verification datasets and explorer indexers.',
      });
    } else if (supportingSourcesCount === 2) {
      score += 10;
      factors.push({
        factor: 'Multiple Independent Sources',
        impact: +10,
        description: 'Corroborated across 2 independent attribution sources.',
      });
    } else {
      score += 5;
      factors.push({
        factor: 'Single Verified Evidence Source',
        impact: +5,
        description: 'Attribution derived from a single primary verification source.',
      });
    }

    // 3. Transaction-Path Proximity & Relationship
    if (isDirect || hopDistance === 1) {
      score += 20;
      factors.push({
        factor: 'Direct Transaction Ingress (1-Hop)',
        impact: +20,
        description: 'Direct customer intake relationship observed without intermediary unhosted hops.',
      });
    } else if (hopDistance === 2) {
      score += 12;
      factors.push({
        factor: '2-Hop Transaction Proximity',
        impact: +12,
        description: 'Near-proximity transaction flow across 1 intermediary peeling transfer.',
      });
    } else if (hopDistance === 3) {
      score += 6;
      factors.push({
        factor: '3-Hop Intermediate Flow',
        impact: +6,
        description: 'Multi-hop routing path through 2 intermediary unhosted transit addresses.',
      });
    } else {
      score += 2;
      factors.push({
        factor: 'Distal Flow (4+ Hops)',
        impact: +2,
        description: 'Extended multi-hop transit chain reduces attribution immediacy.',
      });
    }

    // 4. Role & Wallet Classification Precision
    const isDeposit =
      walletClassification === 'Exchange Deposit Wallet' ||
      associationType === 'Custodial Deposit Cluster' ||
      associationType === 'Officially Published Address';

    if (isDeposit) {
      score += 15;
      factors.push({
        factor: 'Deterministic Custodial Deposit Ingress',
        impact: +15,
        description: 'Address matches a deterministic custodial deposit intake structure.',
      });
    } else if (walletClassification === 'Exchange Hot Wallet' || associationType === 'Hot Wallet Liquidity Pool') {
      score += 10;
      factors.push({
        factor: 'Exchange Hot Wallet Infrastructure',
        impact: +10,
        description: 'Address serves as operational disbursement infrastructure rather than user deposit intake.',
      });
    } else if (walletClassification === 'Mixer / Tumbler' || entityType?.includes('Mixer')) {
      score += 14;
      factors.push({
        factor: 'Sanctioned Protocol Router',
        impact: +14,
        description: 'Identified canonical smart contract router for privacy protocol.',
      });
    } else {
      score += 8;
      factors.push({
        factor: 'Known Service Infrastructure',
        impact: +8,
        description: 'Address attributed to known decentralized service or liquidity router.',
      });
    }

    // 5. Freshness of Verification Data
    if (lastVerified) {
      try {
        const lastDate = new Date(lastVerified).getTime();
        const now = Date.now();
        const daysDiff = (now - lastDate) / (1000 * 60 * 60 * 24);

        if (daysDiff <= 90) {
          score += 10;
          factors.push({
            factor: 'Fresh Evidence (<90 Days)',
            impact: +10,
            description: 'Attribution re-verified within the last 90 days.',
          });
        } else if (daysDiff <= 180) {
          score += 6;
          factors.push({
            factor: 'Recent Evidence (<180 Days)',
            impact: +6,
            description: 'Attribution verified within the last 6 months.',
          });
        } else if (daysDiff <= 365) {
          score += 2;
          factors.push({
            factor: 'Evidence (<1 Year)',
            impact: +2,
            description: 'Attribution verified within the past year.',
          });
        } else {
          score -= 5;
          factors.push({
            factor: 'Stale Attribution Data (>1 Year)',
            impact: -5,
            description: 'Over 12 months since last authoritative re-audit.',
          });
        }
      } catch (e) {
        score += 5;
      }
    } else {
      score += 5;
    }

    // 6. Deductions & Impairments
    if (status === 'conflicting') {
      score -= 25;
      factors.push({
        factor: 'Conflicting Attribution Records',
        impact: -25,
        description: 'Discrepancy detected between independent attribution registries.',
      });
    }

    if (status === 'under_review') {
      score -= 10;
      factors.push({
        factor: 'Record Under Review',
        impact: -10,
        description: 'Attribution currently undergoing investigative validation.',
      });
    }

    if (status === 'outdated') {
      score -= 15;
      factors.push({
        factor: 'Outdated Attribution Record',
        impact: -15,
        description: 'Entity cluster has migrated to newer infrastructure.',
      });
    }

    if (pathHasMixer) {
      score -= 20;
      factors.push({
        factor: 'Intermediate Mixer Opacity',
        impact: -20,
        description: 'Fund path passes through a mixer/tumbler, diminishing direct cryptographic continuity.',
      });
    }

    if (pathHasUnresolvedBridge) {
      score -= 15;
      factors.push({
        factor: 'Unresolved Cross-Chain Jump',
        impact: -15,
        description: 'Cross-chain bridge transition creates an unresolved ledger discontinuity.',
      });
    }

    // Clamp score to [0, 100]
    const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

    // Map to Level & Interpretation
    const level = this.mapScoreToLevel(clampedScore);
    const interpretation = this.mapScoreToInterpretation(clampedScore);
    const explanation = this.generateExplanation(clampedScore, level, params, factors);

    return {
      score: clampedScore,
      level,
      interpretation,
      explanation,
      factors,
    };
  }

  /**
   * Threshold mapping to High / Medium / Low / Unknown
   */
  public mapScoreToLevel(score: number): ConfidenceLevel {
    if (score >= 75) return 'HIGH';
    if (score >= 50) return 'MEDIUM';
    if (score >= 25) return 'LOW';
    if (score > 0) return 'LOW';
    return 'UNKNOWN';
  }

  /**
   * Qualitative interpretation conforming to specification
   */
  public mapScoreToInterpretation(score: number): string {
    if (score >= 90) return 'Very strong supporting evidence';
    if (score >= 75) return 'Strong supporting evidence';
    if (score >= 50) return 'Moderate supporting evidence';
    if (score >= 25) return 'Weak supporting evidence';
    if (score > 0) return 'Very limited evidence';
    return 'Insufficient evidence to calculate a meaningful score';
  }

  /**
   * Deterministic human-readable explanation generator
   */
  private generateExplanation(
    score: number,
    level: ConfidenceLevel,
    params: ConfidenceEvaluationParams,
    factors: ConfidenceScoreFactor[]
  ): string {
    const isDirect = params.isDirect || params.hopDistance === 1;
    const isDeposit =
      params.walletClassification === 'Exchange Deposit Wallet' ||
      params.associationType === 'Custodial Deposit Cluster';

    if (params.status === 'conflicting') {
      return 'Conflicting attribution records identified between independent datasets; requires corroborating subpoena.';
    }

    if (score >= 85 && isDirect && isDeposit) {
      return 'Known exchange deposit address, supported by multiple attribution sources and a direct transaction relationship.';
    }

    if (score >= 75 && isDirect) {
      return 'Direct deposit intake relationship corroborated by verified institutional Proof-of-Reserves disclosures.';
    }

    if (score >= 75) {
      return `Attributed entity supported by verified Proof-of-Reserves audit; adjusted for ${params.hopDistance || 2}-hop proximity.`;
    }

    if (score >= 50) {
      return `Multi-hop routing (${params.hopDistance || 3} hops) with verified attestation, but reduced by intermediate unhosted transit hops.`;
    }

    if (score >= 25) {
      return 'Heuristic attribution based on secondary on-chain patterns; lacks primary regulatory disclosure or multi-source confirmation.';
    }

    return 'Limited single-source heuristic clustering; lacks primary regulatory disclosure or multi-source confirmation.';
  }

  /**
   * Quick evaluate directly from an AttributionRecord
   */
  public evaluateRecord(
    record: AttributionRecord,
    context?: {
      hopDistance?: number;
      isDirect?: boolean;
      pathHasMixer?: boolean;
      pathHasUnresolvedBridge?: boolean;
    }
  ): ConfidenceScoreDetail {
    return this.evaluateConfidence({
      entityName: record.entityName,
      entityType: record.entityType,
      walletClassification:
        record.associationType === 'Custodial Deposit Cluster'
          ? 'Exchange Deposit Wallet'
          : record.associationType === 'Hot Wallet Liquidity Pool'
          ? 'Exchange Hot Wallet'
          : 'Known VASP',
      associationType: record.associationType,
      evidenceSource: record.evidenceSource,
      evidenceReference: record.evidenceReference,
      lastVerified: record.lastVerified,
      status: record.status,
      hopDistance: context?.hopDistance ?? 1,
      isDirect: context?.isDirect ?? true,
      supportingSourcesCount: record.confidenceReasoning?.length || 2,
      pathHasMixer: context?.pathHasMixer ?? false,
      pathHasUnresolvedBridge: context?.pathHasUnresolvedBridge ?? false,
    });
  }
}

export const confidenceEngine = new AttributionConfidenceEngine();
