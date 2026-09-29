/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AttributionRecord, WalletClassification } from '../../types/investigation';
import { confidenceEngine } from './confidenceEngine';

export interface WalletClassificationResult {
  classification: WalletClassification;
  entityName?: string;
  entityType?: string;
  isDirectDepositAccepting: boolean;
  evidenceSource?: string;
  evidenceReference?: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  confidenceScore?: number;
  confidenceExplanation?: string;
  confidenceInterpretation?: string;
  confidenceReasoning?: string[];
  notes?: string;
}

export class WalletClassificationEngine {
  /**
   * Classify an address against the attribution database and on-chain behavioral characteristics.
   * If no verified record exists, explicitly returns 'Unknown / Unattributed' without inventing identities.
   */
  public classifyAddress(
    address: string,
    network: string,
    attributions: AttributionRecord[]
  ): WalletClassificationResult {
    const cleanAddr = address.trim().toLowerCase();
    const match = attributions.find(
      (a) => a.address.toLowerCase() === cleanAddr && a.network === network
    );

    if (!match) {
      return {
        classification: 'Unknown / Unattributed',
        isDirectDepositAccepting: false,
        confidence: 'UNKNOWN',
        confidenceScore: 0,
        confidenceExplanation: 'No authoritative attribution or regulatory disclosure linked to this address.',
        confidenceInterpretation: 'Insufficient evidence to calculate a meaningful score',
        notes: 'No authoritative attribution or regulatory disclosure linked to this address.',
      };
    }

    let classification: WalletClassification = 'Known VASP';
    let isDirectDepositAccepting = false;

    // Distinguish between Exchange Cluster, Hot Wallet, and Deposit Wallet
    if (match.associationType === 'Custodial Deposit Cluster') {
      classification = 'Exchange Deposit Wallet';
      isDirectDepositAccepting = true;
    } else if (match.associationType === 'Hot Wallet Liquidity Pool') {
      classification = 'Exchange Hot Wallet';
      isDirectDepositAccepting = false; // Hot wallets disburse funds rather than direct-customer intake
    } else if (match.associationType === 'Officially Published Address') {
      if (match.entityType === 'Virtual Asset Service (VASP)' || match.entityType === 'Exchange') {
        classification = 'Exchange Deposit Wallet';
        isDirectDepositAccepting = true;
      } else {
        classification = 'Custodial Wallet Service';
      }
    } else if (match.entityType === 'Mixer / Privacy Protocol') {
      classification = 'Mixer / Tumbler';
      isDirectDepositAccepting = false;
    } else if (match.entityType === 'DeFi Protocol') {
      if (match.entityName.toLowerCase().includes('bridge') || match.entityName.toLowerCase().includes('portal')) {
        classification = 'DeFi Bridge';
      } else if (match.entityName.toLowerCase().includes('swap')) {
        classification = 'Cross-Chain Swap Service';
      } else {
        classification = 'Other Known Service';
      }
      isDirectDepositAccepting = false;
    } else if (match.entityType === 'Sanctioned Entity') {
      classification = 'Other Known Service';
      isDirectDepositAccepting = false;
    } else if (match.entityType === 'Custodian') {
      classification = 'Custodial Wallet Service';
      isDirectDepositAccepting = true;
    }

    const confDetail = confidenceEngine.evaluateRecord(match);

    return {
      classification,
      entityName: match.entityName,
      entityType: match.entityType,
      isDirectDepositAccepting,
      evidenceSource: match.evidenceSource,
      evidenceReference: match.evidenceReference,
      confidence: match.confidence || confDetail.level,
      confidenceScore: match.confidenceScore ?? confDetail.score,
      confidenceExplanation: match.confidenceExplanation ?? confDetail.explanation,
      confidenceInterpretation: match.confidenceInterpretation ?? confDetail.interpretation,
      confidenceReasoning: match.confidenceReasoning,
      notes: match.notes,
    };
  }
}

export const classificationEngine = new WalletClassificationEngine();
