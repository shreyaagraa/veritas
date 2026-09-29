/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockchainProviderAdapter, NormalizedTransaction } from './types';

export class SolanaProviderAdapter implements BlockchainProviderAdapter {
  network = 'solana' as const;
  name = 'Solana Mainnet-Beta RPC Gateway';
  endpoint = 'https://api.mainnet-beta.solana.com';
  status = 'STANDBY' as const;
  authRequired = false;
  notes = 'High-throughput cluster RPC for SPL token transfers and account state lookups.';

  validateAddress(address: string): boolean {
    if (!address || typeof address !== 'string') return false;
    // Base58 encoded 32-44 characters
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address.trim());
  }

  async fetchBalance(address: string): Promise<{ balance: string; asset: string }> {
    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [address.trim()],
        }),
      });
      const data = await res.json();
      if (typeof data.result?.value === 'number') {
        const sol = (data.result.value / 1e9).toFixed(4);
        return { balance: `${sol} SOL`, asset: 'SOL' };
      }
    } catch (e) {
      // fallback
    }
    return { balance: '0.0000 SOL', asset: 'SOL' };
  }

  async fetchTransactions(
    address: string,
    options?: { maxTxs?: number; timeRangePreset?: string }
  ): Promise<NormalizedTransaction[]> {
    return [];
  }
}
