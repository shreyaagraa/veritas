/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ConfidenceLevel } from '../../types/investigation';

interface ConfidenceBadgeProps {
  confidence: ConfidenceLevel;
  score?: number;
  explanation?: string;
  interpretation?: string;
  reasoning?: string[];
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showScoreBar?: boolean;
  showFullText?: boolean;
  className?: string;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  score,
  explanation,
  interpretation,
  reasoning = [],
  size = 'md',
  showLabel = true,
  showScoreBar = false,
  showFullText = false,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Derive score if not provided explicitly
  const numericScore =
    score !== undefined
      ? score
      : confidence === 'HIGH'
      ? 87
      : confidence === 'MEDIUM'
      ? 62
      : confidence === 'LOW'
      ? 34
      : 0;

  const getStyle = () => {
    switch (confidence) {
      case 'HIGH':
        return {
          dot: 'bg-emerald-400',
          text: 'text-emerald-400',
          barBg: 'bg-emerald-400',
          border: 'border-emerald-500/30',
          label: 'High Confidence',
          levelShort: 'High',
          defaultInterpretation: 'Strong supporting evidence',
          defaultExplanation:
            'Known exchange deposit address, supported by multiple attribution sources and a direct transaction relationship.',
        };
      case 'MEDIUM':
        return {
          dot: 'bg-amber-400',
          text: 'text-amber-400',
          barBg: 'bg-amber-400',
          border: 'border-amber-500/30',
          label: 'Medium Confidence',
          levelShort: 'Medium',
          defaultInterpretation: 'Moderate supporting evidence',
          defaultExplanation:
            'Multi-hop routing with verified attestation, but reduced by intermediate unhosted transit hops.',
        };
      case 'LOW':
        return {
          dot: 'bg-rose-400',
          text: 'text-rose-400',
          barBg: 'bg-rose-400',
          border: 'border-rose-500/30',
          label: 'Low Confidence',
          levelShort: 'Low',
          defaultInterpretation: 'Weak supporting evidence',
          defaultExplanation:
            'Limited single-source heuristic clustering; lacks primary regulatory disclosure or multi-source confirmation.',
        };
      default:
        return {
          dot: 'bg-zinc-500',
          text: 'text-zinc-400',
          barBg: 'bg-zinc-600',
          border: 'border-zinc-700/40',
          label: 'Unknown',
          levelShort: 'Unknown',
          defaultInterpretation: 'Insufficient evidence to calculate a meaningful score',
          defaultExplanation: 'Insufficient evidence to calculate a meaningful score.',
        };
    }
  };

  const style = getStyle();
  const effectiveExplanation = explanation || style.defaultExplanation;
  const effectiveInterpretation = interpretation || style.defaultInterpretation;

  // Visual Horizontal Progress Bar Mode
  if (showScoreBar) {
    return (
      <div className={`w-full space-y-2 font-mono select-none ${className}`}>
        {/* Result Header: Attribution Confidence: 87/100 — High */}
        <div className="flex items-center text-xs">
          <div className="flex items-center gap-2 text-zinc-300 min-w-0">
            <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
            <span className="text-[#8d96a5] whitespace-nowrap font-medium">Attribution Confidence:</span>
            {confidence === 'UNKNOWN' ? (
              <span className="text-zinc-400 font-medium ml-1">Unknown</span>
            ) : (
              <div className="inline-flex items-center gap-1.5 whitespace-nowrap ml-0.5">
                <span className="text-white font-semibold">{numericScore}/100</span>
                <span className="text-[#5e6678] font-normal">—</span>
                <span className={`font-semibold ${style.text}`}>{style.levelShort}</span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Horizontal Progress Bar 0 to 100 */}
        <div className="relative h-2 w-full bg-[#12151c] border border-[#222938] overflow-hidden rounded-xs">
          <div
            className={`h-full transition-all duration-300 ${style.barBg}`}
            style={{
              width: confidence === 'UNKNOWN' ? '0%' : `${Math.max(3, Math.min(100, numericScore))}%`,
            }}
          />
        </div>

        {/* Explanatory Narrative */}
        {effectiveExplanation && (
          <p className="text-[11px] text-[#8d96a5] font-sans leading-relaxed pt-0.5">
            &ldquo;{effectiveExplanation}&rdquo;
          </p>
        )}
      </div>
    );
  }

  // Full Text Display: Attribution Confidence: 87/100 — High
  if (showFullText) {
    return (
      <div
        className={`relative inline-flex items-center select-none font-mono ${
          size === 'sm' ? 'text-[11px]' : 'text-xs'
        } ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="inline-flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
          <span className="text-[#8d96a5] whitespace-nowrap font-medium">Attribution Confidence:</span>
          {confidence === 'UNKNOWN' ? (
            <span className="text-zinc-400 font-medium ml-1">Unknown</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap ml-0.5">
              <span className="text-white font-semibold">{numericScore}/100</span>
              <span className="text-[#5e6678] font-normal">—</span>
              <span className={`font-semibold ${style.text}`}>{style.levelShort}</span>
            </span>
          )}
        </div>

        {showTooltip && (
          <div className="absolute bottom-full left-0 mb-2 z-50 w-72 p-3 bg-[#0f1218] border border-[#222938] shadow-2xl text-[11px] text-zinc-300 pointer-events-none space-y-2 font-sans">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#7e8695] uppercase tracking-wider border-b border-[#1c222c] pb-1">
              <span>Attribution Evidence Score</span>
              <span className={style.text}>{numericScore}/100</span>
            </div>

            <p className="text-zinc-300 text-[11px] leading-relaxed">
              &ldquo;{effectiveExplanation}&rdquo;
            </p>

            {reasoning && reasoning.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-zinc-400 text-[10px] pt-1 border-t border-[#1c222c]">
                {reasoning.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }

  // Standard Compact Badge Display (Backward compatible, enhanced with numeric tooltip & score)
  return (
    <div
      className={`relative inline-flex items-center select-none ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`inline-flex items-center gap-1.5 font-mono ${
          size === 'sm' ? 'text-[11px]' : size === 'lg' ? 'text-sm' : 'text-xs'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
        {showLabel && (
          <span className={`font-medium tracking-tight ${style.text}`}>
            {confidence === 'UNKNOWN' ? 'Unattributed' : `${numericScore}/100 · ${style.levelShort}`}
          </span>
        )}
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 z-50 w-72 p-3 bg-[#0f1218] border border-[#222938] shadow-2xl text-[11px] text-zinc-300 pointer-events-none space-y-2 font-sans">
          <div className="flex items-center justify-between font-mono text-[10px] text-[#7e8695] uppercase tracking-wider border-b border-[#1c222c] pb-1">
            <span>Attribution Evidence Score</span>
            <span className={style.text}>{numericScore}/100 — {style.levelShort}</span>
          </div>

          <p className="text-zinc-300 text-[11px] leading-relaxed">
            &ldquo;{effectiveExplanation}&rdquo;
          </p>

          {reasoning && reasoning.length > 0 && (
            <ul className="list-disc list-inside space-y-1 text-zinc-400 text-[10px] pt-1 border-t border-[#1c222c]">
              {reasoning.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
