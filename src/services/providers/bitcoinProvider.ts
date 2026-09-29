/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockchainProviderAdapter, NormalizedTransaction } from './types';

export class BitcoinProviderAdapter implements BlockchainProviderAdapter {
  network = 'bitcoin' as const;
  name = 'Bitcoin Core UTXO Indexer (Mempool.space)';
  endpoint = 'https://mempool.space/api';
  status = 'ONLINE' as const;
  authRequired = false;
  notes = 'Native Electrum/REST gateway for UTXO peeling chains, fees (sat/vB), and SegWit addresses.';

  validateAddress(address: string): boolean {
    if (!address || typeof address !== 'string') return false;
    const trimmed = address.trim();
    // Bech32 / SegWit (bc1q, bc1p)
    if (/^bc1[a-z0-9]{25,65}$/i.test(trimmed)) return true;
    // P2SH (3...)
    if (/^3[a-km-zA-HJ-NP-Z1-9]{26,35}$/.test(trimmed)) return true;
    // Legacy P2PKH (1...)
    if (/^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(trimmed)) return true;
    return false;
  }

  async fetchBalance(address: string): Promise<{ balance: string; asset: string }> {
    try {
      const res = await fetch(`https://mempool.space/api/address/${encodeURIComponent(address.trim())}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const funded = (data.chain_stats?.funded_txo_sum || 0) - (data.chain_stats?.spent_txo_sum || 0);
      const btc = (funded / 100000000).toFixed(4);
      return { balance: `${btc} BTC`, asset: 'BTC' };
    } catch {
      return { balance: '0.0000 BTC', asset: 'BTC' };
    }
  }

  async fetchTransactions(
    address: string,
    options?: { maxTxs?: number; timeRangePreset?: string }
  ): Promise<NormalizedTransaction[]> {
    const cleanAddress = address.trim();
    const limit = options?.maxTxs || 15;

    try {
      const res = await fetch(`https://mempool.space/api/address/${encodeURIComponent(cleanAddress)}/txs`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const txs = await res.json();

      if (!Array.isArray(txs)) return [];

      const normalized: NormalizedTransaction[] = [];

      for (const tx of txs.slice(0, limit)) {
        // Find if this is outgoing from the target address
        const isSender = tx.vin?.some(
          (vin: any) => vin.prevout?.scriptpubkey_address?.toLowerCase() === cleanAddress.toLowerCase()
        );

        // Identify receiver(s)
        const recipientOutputs = tx.vout?.filter(
          (vout: any) => vout.scriptpubkey_address && vout.scriptpubkey_address.toLowerCase() !== cleanAddress.toLowerCase()
        ) || [];

        const primaryRecipient = recipientOutputs[0] || tx.vout?.[0];
        const targetReceiver = primaryRecipient?.scriptpubkey_address || 'Unparsed_Script_Output';
        const satoshis = primaryRecipient?.value || 0;
        const btcAmount = (satoshis / 100000000).toFixed(4);

        const feeSat = tx.fee || 0;
        const feeBtc = (feeSat / 100000000).toFixed(6);

        normalized.push({
          hash: tx.txid,
          network: 'bitcoin',
          from: isSender ? cleanAddress : tx.vin?.[0]?.prevout?.scriptpubkey_address || 'Coinbase_Mining_Reward',
          to: targetReceiver,
          amount: btcAmount,
          asset: 'BTC',
          timestamp: tx.status?.block_time
            ? new Date(tx.status.block_time * 1000).toISOString()
            : new Date().toISOString(),
          blockNumber: tx.status?.block_height || 0,
          status: tx.status?.confirmed ? 'confirmed' : 'pending',
          fee: `${feeBtc} BTC (${Math.round(feeSat / (tx.vsize || 140))} sat/vB)`,
        });
      }

      return normalized;
    } catch (err) {
      console.warn(`[BitcoinProvider] Live query failed for ${cleanAddress}, falling back to normalized simulation:`, err);
      return [];
    }
  }
}
