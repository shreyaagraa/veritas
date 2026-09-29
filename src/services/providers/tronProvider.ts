/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockchainProviderAdapter, NormalizedTransaction } from './types';

export class TronProviderAdapter implements BlockchainProviderAdapter {
  network = 'tron' as const;
  name = 'TRON Grid API Gateway';
  endpoint = 'https://api.trongrid.io';
  status = 'REQUIRES_CONFIG' as const;
  authRequired = true;
  notes = 'TRON protocol indexer for TRC-20 USDT and TRX flows. Requires TronGrid API key for live queries.';

  validateAddress(address: string): boolean {
    if (!address || typeof address !== 'string') return false;
    // Standard TRON base58 address starting with T
    return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address.trim());
  }

  async fetchBalance(address: string): Promise<{ balance: string; asset: string }> {
    return { balance: '0.00 TRX', asset: 'TRX' };
  }

  async fetchTransactions(
    address: string,
    options?: { maxTxs?: number; timeRangePreset?: string }
  ): Promise<NormalizedTransaction[]> {
    // API not connected yet without TRONGRID API key
    return [];
  }
}
