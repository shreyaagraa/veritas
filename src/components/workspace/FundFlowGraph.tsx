/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { WalletNode, TransactionEdge } from '../../types/investigation';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface FundFlowGraphProps {
  nodes: WalletNode[];
  edges: TransactionEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  onSelectNode: (node: WalletNode) => void;
  onSelectEdge: (edge: TransactionEdge) => void;
  primaryPath?: string[];
}

export const FundFlowGraph: React.FC<FundFlowGraphProps> = ({
  nodes,
  edges,
  selectedNodeId,
  selectedEdgeId,
  onSelectNode,
  onSelectEdge,
  primaryPath = [],
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 30 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Calculate systematic planar positions arranged by hop depth columns
  const layoutNodes = useMemo(() => {
    const hopGroups: { [hop: number]: WalletNode[] } = {};
    let maxHop = 0;

    nodes.forEach((n) => {
      const hop = n.hop || 0;
      if (!hopGroups[hop]) hopGroups[hop] = [];
      hopGroups[hop].push(n);
      if (hop > maxHop) maxHop = hop;
    });

    const columnWidth = 240;
    const rowHeight = 110;

    return nodes.map((node) => {
      const hop = node.hop || 0;
      const group = hopGroups[hop] || [node];
      const indexInGroup = group.findIndex((n) => n.id === node.id);
      const totalInGroup = group.length;

      const x = 50 + hop * columnWidth;
      const verticalOffset = (indexInGroup - (totalInGroup - 1) / 2) * rowHeight;
      const y = 180 + verticalOffset;

      return {
        ...node,
        x,
        y,
      };
    });
  }, [nodes]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, typeof layoutNodes[0]>();
    layoutNodes.forEach((n) => {
      map.set(n.id.toLowerCase(), n);
      map.set(n.address.toLowerCase(), n);
    });
    return map;
  }, [layoutNodes]);

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'graph-canvas') {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 40, y: 30 });
  };

  return (
    <div
      id="graph-canvas"
      className="relative w-full h-full bg-[#080a0d] overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Subtle background grid pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <pattern id="dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.75" fill="#4a5568" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>

      {/* Minimal Graph Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-[#0c0f14]/90 border border-[#1e242f] p-1 font-mono text-xs shadow-lg">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(z + 0.15, 1.8))}
          className="p-1.5 text-[#7e8695] hover:text-[#f5d13b] transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(z - 0.15, 0.5))}
          className="p-1.5 text-[#7e8695] hover:text-[#f5d13b] transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleResetZoom}
          className="p-1.5 text-[#7e8695] hover:text-[#f5d13b] transition-colors cursor-pointer"
          title="Reset View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <span className="px-2 text-[10px] text-[#f5d13b] border-l border-[#1e242f] font-medium">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Main SVG Render Surface */}
      <svg
        className="w-full h-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#4a5568" />
          </marker>

          <marker
            id="arrowhead-selected"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#ffffff" />
          </marker>

          <marker
            id="arrowhead-btc"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#f5d13b" />
          </marker>
        </defs>

        {/* Connections / Edges */}
        <g className="edges">
          {edges.map((edge) => {
            const sourceNode = nodeMap.get(edge.from.toLowerCase());
            const targetNode = nodeMap.get(edge.to.toLowerCase());
            if (!sourceNode || !targetNode) return null;

            const isSelected = selectedEdgeId === edge.id;
            const isPath = primaryPath.includes(edge.from) && primaryPath.includes(edge.to);
            const isBtcFlow = edge.asset === 'BTC' || edge.network === 'bitcoin' || edge.isPrimaryPath || isPath;

            const startX = sourceNode.x + 160;
            const startY = sourceNode.y + 35;
            const endX = targetNode.x;
            const endY = targetNode.y + 35;

            const midX = (startX + endX) / 2;
            const pathData = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

            return (
              <g
                key={edge.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEdge(edge);
                }}
                className="cursor-pointer group"
              >
                {/* Wider invisible hitbox for easy click */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="18"
                />

                {/* Visible connector line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={
                    isSelected
                      ? '#ffffff'
                      : isBtcFlow
                      ? '#f5d13b'
                      : '#374151'
                  }
                  strokeWidth={isSelected ? 2.5 : isBtcFlow ? 1.75 : 1.25}
                  strokeDasharray={edge.isPrimaryPath ? undefined : '4 3'}
                  markerEnd={
                    isSelected
                      ? 'url(#arrowhead-selected)'
                      : isBtcFlow
                      ? 'url(#arrowhead-btc)'
                      : 'url(#arrowhead)'
                  }
                  className="transition-colors group-hover:stroke-[#fef08a]"
                />

                {/* Amount Label on connection */}
                <g transform={`translate(${midX}, ${(startY + endY) / 2 - 10})`}>
                  <rect
                    x="-34"
                    y="-9"
                    width="68"
                    height="18"
                    fill="#080a0e"
                    stroke={isSelected ? '#ffffff' : isBtcFlow ? '#f5d13b' : '#1e242f'}
                    strokeWidth={isBtcFlow || isSelected ? '1.2' : '1'}
                  />
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : isBtcFlow ? '#f5d13b' : '#9aa2b1'}
                    className="font-mono text-[9px] select-none font-semibold"
                  >
                    {edge.amount} {edge.asset}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* Planar Architectural Nodes */}
        <g className="nodes">
          {layoutNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isTerminalVASP = node.entityName && node.role === 'destination';
            const isSource = node.role === 'source';
            const isBtcNode = node.network === 'bitcoin' || node.asset === 'BTC';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(node);
                }}
                className="cursor-pointer group"
              >
                {/* Node Container: Flat planar rectangle with hairline border */}
                <rect
                  x="0"
                  y="0"
                  width="160"
                  height="70"
                  fill="#0c0f15"
                  stroke={
                    isSelected
                      ? '#f5d13b'
                      : isTerminalVASP
                      ? '#10b981'
                      : isSource
                      ? (isBtcNode ? '#f5d13b' : '#f43f5e')
                      : isBtcNode
                      ? '#2e3846'
                      : '#1e242f'
                  }
                  strokeWidth={isSelected ? 2 : 1}
                  className="transition-all group-hover:stroke-[#f5d13b]"
                />

                {/* Top strip indicator */}
                <line
                  x1="0"
                  y1="0"
                  x2="160"
                  y2="0"
                  stroke={
                    isSelected
                      ? '#f5d13b'
                      : isTerminalVASP
                      ? '#10b981'
                      : isSource
                      ? (isBtcNode ? '#f5d13b' : '#f43f5e')
                      : isBtcNode
                      ? '#ca8a04'
                      : '#2d3748'
                  }
                  strokeWidth={isSelected ? 3 : 2}
                />

                {/* Hop Tag & Role */}
                <text
                  x="10"
                  y="18"
                  fill="#7e8695"
                  className="font-mono text-[9px] uppercase tracking-wider select-none font-medium"
                >
                  Hop {node.hop} · {isSource ? 'Origin' : isTerminalVASP ? 'Terminal VASP' : 'Intermediate'}
                </text>

                {/* Bitcoin Symbol Badge */}
                {isBtcNode && (
                  <text
                    x="142"
                    y="18"
                    fill="#f5d13b"
                    className="font-mono text-[10px] font-bold select-none"
                  >
                    ₿
                  </text>
                )}

                {/* Primary Label: Entity Name or Formatted Address */}
                {node.entityName ? (
                  <text
                    x="10"
                    y="36"
                    fill={isSelected ? '#f5d13b' : '#ffffff'}
                    className="font-sans text-[11px] font-semibold select-none truncate"
                  >
                    {node.entityName.length > 20
                      ? `${node.entityName.slice(0, 18)}...`
                      : node.entityName}
                  </text>
                ) : (
                  <text
                    x="10"
                    y="36"
                    fill={isSelected ? '#f5d13b' : '#e2e8f0'}
                    className="font-mono text-[11px] select-none tracking-tight font-medium"
                  >
                    {`${node.address.slice(0, 6)}...${node.address.slice(-4)}`}
                  </text>
                )}

                {/* Secondary: Address (if entity exists) or Balance */}
                {node.entityName ? (
                  <text
                    x="10"
                    y="52"
                    fill="#7e8695"
                    className="font-mono text-[9px] select-none"
                  >
                    {`${node.address.slice(0, 6)}...${node.address.slice(-4)}`}
                  </text>
                ) : (
                  <text
                    x="10"
                    y="52"
                    fill={isBtcNode ? '#f5d13b' : '#9aa2b1'}
                    className="font-mono text-[9px] select-none font-medium"
                  >
                    Bal: {node.balance}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
