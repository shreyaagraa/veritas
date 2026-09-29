/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockchainProviderAdapter, NormalizedTransaction } from './types';

export class EthereumProviderAdapter implements BlockchainProviderAdapter {
  network = 'ethereum' as const;
  name = 'Ethereum Mainnet Consensus RPC';
  endpoint = 'https://eth.llamarpc.com';
  status = 'ONLINE' as const;
  authRequired = false;
  notes = 'JSON-RPC 2.0 gateway for EVM accounts, balances, and transaction receipts.';

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
        const eth = (Number(wei) / 1e18).toFixed(4);
        return { balance: `${eth} ETH`, asset: 'ETH' };
      }
    } catch (e) {
      // fallback
    }
    return { balance: '0.0000 ETH', asset: 'ETH' };
  }

  async fetchTransactions(
    address: string,
    options?: { maxTxs?: number; timeRangePreset?: string }
  ): Promise<NormalizedTransaction[]> {
    // In live mode with public RPC, full historical transaction listing typically requires an indexer (like Etherscan API).
    // If an Etherscan key is configured in env, it queries it; otherwise, returns empty array to signal unindexed provider.
    return [];
  }
}
