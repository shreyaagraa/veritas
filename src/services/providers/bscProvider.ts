/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockchainProviderAdapter, NormalizedTransaction } from './types';

export class BscProviderAdapter implements BlockchainProviderAdapter {
  network = 'bsc' as const;
  name = 'BNB Smart Chain RPC Node';
  endpoint = 'https://binance.llamarpc.com';
  status = 'ONLINE' as const;
  authRequired = false;
  notes = 'Consensus node gateway for BNB Chain BEP-20 transfers and account states.';

  validateAddress(address: string): boolean {
    if (!address || typeof address !== 'string') return false;
    return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
  }

  async fetchBalance(address: string): Promise<{ balance: string; asset: string }> {
    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [address.trim(), 'latest'],
          id: 1,
        }),
      });
      const data = await res.json();
      if (data.result) {
        const wei = BigInt(data.result);
        const bnb = (Number(wei) / 1e18).toFixed(4);
        return { balance: `${bnb} BNB`, asset: 'BNB' };
      }
    } catch (e) {
      // fallback
    }
    return { balance: '0.0000 BNB', asset: 'BNB' };
  }

  async fetchTransactions(
    address: string,
    options?: { maxTxs?: number; timeRangePreset?: string }
  ): Promise<NormalizedTransaction[]> {
    return [];
  }
}
