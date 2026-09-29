/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockchainProviderAdapter, NormalizedTransaction } from './types';

export class PolygonProviderAdapter implements BlockchainProviderAdapter {
  network = 'polygon' as const;
  name = 'Polygon PoS Mainnet RPC';
  endpoint = 'https://polygon-rpc.com';
  status = 'ONLINE' as const;
  authRequired = false;
  notes = 'High-speed EVM layer-2 gateway for POL (formerly MATIC) transfers and contract invocations.';

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
        const pol = (Number(wei) / 1e18).toFixed(4);
        return { balance: `${pol} POL`, asset: 'POL' };
      }
    } catch (e) {
      // fallback
    }
    return { balance: '0.0000 POL', asset: 'POL' };
  }

  async fetchTransactions(
    address: string,
    options?: { maxTxs?: number; timeRangePreset?: string }
  ): Promise<NormalizedTransaction[]> {
    return [];
  }
}
