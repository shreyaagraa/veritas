/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockchainNetwork } from '../../types/investigation';

export interface NormalizedTransaction {
  hash: string;
  network: BlockchainNetwork;
  from: string;
  to: string;
  amount: string;
  asset: string;
  timestamp: string;
  blockNumber: number;
  status: 'confirmed' | 'pending' | 'failed';
  fee?: string;
  contractAddress?: string;
  tokenSymbol?: string;
  isContractCall?: boolean;
}

export type ProviderConnectionStatus = 'ONLINE' | 'STANDBY' | 'REQUIRES_CONFIG' | 'UNSUPPORTED';

export interface BlockchainProviderAdapter {
  network: BlockchainNetwork;
  name: string;
  endpoint: string;
  status: ProviderConnectionStatus;
  authRequired: boolean;
  notes: string;
  validateAddress(address: string): boolean;
  fetchTransactions(
    address: string,
    options?: {
      maxTxs?: number;
      timeRangePreset?: string;
    }
  ): Promise<NormalizedTransaction[]>;
  fetchBalance(address: string): Promise<{ balance: string; asset: string }>;
}
