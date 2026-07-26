import React, { useEffect, useRef, useState } from 'react';
import { kspApi } from '../../services/api/kspApi';
import { RefreshCw, AlertCircle, Info } from 'lucide-react';
import * as d3 from 'd3';

export const CriminalNetworkGraph: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const fetchNetwork = async () => {
      try {
        setLoading(true);
        const res = await kspApi.getNetwork();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNetwork();
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const width = 800;
    const height = 480;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const nodes = data.nodes.map((d: any) => ({ ...d }));
    const links = data.links.map((d: any) => ({ ...d }));

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(110))
      .force('charge', d3.forceManyBody().strength(-220))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Render Edges
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', (d: any) => d.relation.includes('Repeat') ? '#EF4444' : '#94A3B8')
      .attr('stroke-dasharray', (d: any) => d.relation.includes('Repeat') ? '4 2' : 'none')
      .attr('stroke-width', (d: any) => d.relation.includes('Repeat') ? 2 : 1.2)
      .attr('opacity', 0.8);

    // Render Nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .on('click', (_event, d: any) => {
        setSelectedNode(d);
      })
      .call(
        d3.drag<any, any>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node Circles
    node.append('circle')
      .attr('r', (d: any) => d.type === 'case' ? 16 : (d.repeatOffender ? 14 : 10))
      .attr('fill', (d: any) => {
        if (d.type === 'case') return '#1E40AF'; // Case blue
        if (d.type === 'accused') return d.repeatOffender ? '#DC2626' : '#F59E0B'; // Red repeat, Amber normal accused
        return '#10B981'; // Victim green
      })
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2);

    // Node Labels
    node.append('text')
      .text((d: any) => d.name)
      .attr('x', 18)
      .attr('y', 4)
      .attr('font-size', '10px')
      .attr('font-weight', '500')
      .attr('fill', 'var(--text-primary)');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

  }, [data]);

  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px] text-xs text-[var(--text-muted)]">
        <RefreshCw className="w-4 h-4 animate-spin text-blue-600 mr-2" />
        Calculating D3 Force-Directed Criminal Graph & Cross-Case Linkages...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div>
          <h2 className="text-base font-medium text-[var(--text-primary)]">Criminal Network Linkage Analysis</h2>
          <p className="text-xs text-[var(--text-muted)]">Interactive D3 force graph revealing repeat offender nexuses across Karnataka</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-700"></span>
            <span>Case (FIR)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600"></span>
            <span>Repeat Accused</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Accused</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Victim</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* D3 Graph Canvas */}
        <div className="lg:col-span-3 p-4 rounded-xl border bg-[var(--surface)] shadow-sm flex items-center justify-center relative" style={{ borderColor: 'var(--border)' }}>
          <svg ref={svgRef} width="100%" height="480" viewBox="0 0 800 480" />
          <div className="absolute bottom-4 left-4 text-[10px] text-[var(--text-muted)] bg-[var(--bg-primary)] p-2 rounded border">
            💡 Click and drag any node to explore linkage clusters.
          </div>
        </div>

        {/* Node Detail Inspector */}
        <div className="p-6 rounded-xl border bg-[var(--surface)] shadow-sm space-y-4" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            Selected Entity Details
          </h3>

          {selectedNode ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border bg-[var(--bg-primary)] space-y-1" style={{ borderColor: 'var(--border)' }}>
                <div className="text-[10px] text-[var(--text-muted)] uppercase">Entity Type</div>
                <div className="font-medium capitalize text-[var(--text-primary)]">{selectedNode.type}</div>
              </div>

              <div className="p-3 rounded-lg border bg-[var(--bg-primary)] space-y-1" style={{ borderColor: 'var(--border)' }}>
                <div className="text-[10px] text-[var(--text-muted)] uppercase">Entity Name / Title</div>
                <div className="font-medium text-blue-600">{selectedNode.name}</div>
              </div>

              {selectedNode.repeatOffender && (
                <div className="p-3 rounded-lg border bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Repeat Offender Nexus Detected across multiple FIRs!</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-[var(--text-muted)] italic">
              Click on any node in the graph to inspect entity attributes and case connections.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
