/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { NodeRole } from '../../types/investigation';

interface AddressDisplayProps {
  address: string;
  entityName?: string;
  role?: NodeRole;
  isTruncated?: boolean;
  onAddressClick?: (address: string) => void;
  className?: string;
}

export const AddressDisplay: React.FC<AddressDisplayProps> = ({
  address,
  entityName,
  isTruncated = false,
  onAddressClick,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const displayAddr = isTruncated
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onAddressClick) {
      e.stopPropagation();
      onAddressClick(address);
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 font-mono ${className}`}>
      {entityName ? (
        <span
          onClick={handleClick}
          className="text-zinc-200 hover:text-white font-medium cursor-pointer transition-colors"
          title={address}
        >
          {entityName}
        </span>
      ) : (
        <span
          onClick={handleClick}
          className={`text-zinc-300 hover:text-white transition-colors tracking-tight text-xs ${
            onAddressClick ? 'cursor-pointer hover:underline underline-offset-2' : ''
          }`}
          title={address}
        >
          {displayAddr}
        </span>
      )}

      <button
        type="button"
        onClick={handleCopy}
        className="text-[#5e6678] hover:text-zinc-200 transition-colors p-0.5 cursor-pointer"
        title="Copy address"
      >
        {copied ? (
          <Check className="w-3 h-3 text-emerald-400" />
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </button>
    </div>
  );
};
