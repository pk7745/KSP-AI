import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Filter, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { useNavigation } from '../../context/NavigationContext';
import './NetworkView.css';

export function NetworkView() {
  const { t } = useTranslation();
  const [data, setData] = useState<{ nodes: any[], links: any[], summary?: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterActive, setFilterActive] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const { openCase360, setCurrentView } = useNavigation();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExportCSV = () => {
    if (!data) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Node ID,Node Name,Type,Repeat Offender\n"
      + data.nodes.map(n => `${n.id},${n.name},${n.type},${n.repeatOffender ? 'Yes' : 'No'}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "criminal_nexus_map.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    import('../../utils/toast').then(m => m.showToast("Network map exported to CSV"));
  };

  useEffect(() => {
    async function fetchNetwork() {
      const netData = await api.getNetwork();
      setData(netData);
      setLoading(false);
    }
    fetchNetwork();
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const g = svg.append("g");

    // Zoom setup
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    // D3 Force Simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(40));

    // Links
    const link = g.append("g")
      .selectAll("line")
      .data(data.links)
      .enter().append("line")
      .attr("stroke", (d: any) => d.relation === 'Same Identity (Repeat Offender)' ? 'var(--accent-crimson)' : 'var(--border-light)')
      .attr("stroke-width", (d: any) => d.relation === 'Same Identity (Repeat Offender)' ? 2 : 1)
      .attr("stroke-dasharray", (d: any) => d.relation === 'Same Identity (Repeat Offender)' ? '5,5' : 'none');

    // Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(data.nodes)
      .enter().append("g")
      .call(d3.drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      )
      .on("click", (event, d) => {
        setSelectedNode(d);
      });

    // Node Shapes based on type
    node.each(function(d: any) {
      const el = d3.select(this);
      
      // If filtering is active, visually dim nodes that aren't repeat offenders or cases connected to them
      if (filterActive && d.type === 'accused' && !d.repeatOffender) {
        el.style('opacity', 0.2);
      } else {
        el.style('opacity', 1);
      }

      if (d.type === 'case') {
        el.append("rect")
          .attr("width", 32)
          .attr("height", 32)
          .attr("x", -16)
          .attr("y", -16)
          .attr("rx", 6)
          .attr("fill", "var(--bg-secondary)")
          .attr("stroke", "var(--accent-cyan)")
          .attr("stroke-width", 2);
      } else if (d.type === 'accused') {
        el.append("circle")
          .attr("r", d.repeatOffender ? 20 : 16)
          .attr("fill", "var(--bg-secondary)")
          .attr("stroke", d.repeatOffender ? "var(--accent-crimson)" : "var(--accent-amber)")
          .attr("stroke-width", d.repeatOffender ? 3 : 2)
          .style("filter", d.repeatOffender ? "drop-shadow(0 0 10px rgba(225, 29, 72, 0.5))" : "none");
      } else {
        el.append("circle")
          .attr("r", 12)
          .attr("fill", "var(--bg-secondary)")
          .attr("stroke", "var(--accent-emerald)")
          .attr("stroke-width", 2);
      }
    });

    // Node Labels
    node.append("text")
      .text((d: any) => d.name)
      .attr("x", 0)
      .attr("y", 28)
      .attr("text-anchor", "middle")
      .style("fill", "var(--text-primary)")
      .style("font-size", "10px")
      .style("font-family", "var(--font-main)")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

  }, [data, filterActive]);

  return (
    <div className="network-view animate-slide-in">
      <div className="network-header">
        <div className="network-title-area">
          <h2>{t('network.title', 'Criminal Nexus Visualization')}</h2>
          <p className="subtitle">{t('network.subtitle', 'Graph database mapping links between suspects, cases, and syndicates.')}</p>
        </div>
        
        <div className="network-actions">
          <button 
            className={`btn ${filterActive ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => setFilterActive(!filterActive)}
          >
            <Filter size={16} /> {filterActive ? 'Clear Filter' : t('network.filter', 'Filter Nodes')}
          </button>
          <button className="btn btn-primary" onClick={handleExportCSV}>
            <Share2 size={16} /> {t('network.export', 'Export Map')}
          </button>
        </div>

        {data?.summary && (
          <div className="network-stats glass-panel">
            <div className="stat-item">
              <span className="stat-label">{t('network.stats.nodes', 'Nodes')}</span>
              <span className="stat-val">{data.summary.totalNodes}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">{t('network.stats.links', 'Links')}</span>
              <span className="stat-val">{data.summary.totalLinks}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label text-crimson">{t('network.stats.repeatOffenders', 'Repeat Offenders')}</span>
              <span className="stat-val text-crimson">{data.summary.repeatOffendersDetected}</span>
            </div>
          </div>
        )}
      </div>

      <div className="network-canvas-container glass-panel" ref={containerRef}>
        {loading ? (
          <div className="loading-state">{t('network.rendering', 'Rendering Criminal Nexus Graph...')}</div>
        ) : (
          <>
            <div className="canvas-controls">
              <div className="legend">
                <div className="legend-item"><span className="legend-box case"></span> {t('network.legend.case', 'Cases (FIRs)')}</div>
                <div className="legend-item"><span className="legend-box accused"></span> {t('network.legend.accused', 'Accused Entities')}</div>
                <div className="legend-item"><span className="legend-box repeat"></span> {t('network.legend.repeat', 'Repeat Offenders')}</div>
              </div>
            </div>
            <svg ref={svgRef} className="network-svg"></svg>
            
            {selectedNode && (
              <div className="network-drawer glass-panel animate-slide-in">
                <button className="close-btn" onClick={() => setSelectedNode(null)}>×</button>
                <h3 className="drawer-title">{selectedNode.name}</h3>
                <div className="badge mt-xs inline-block" style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                  {selectedNode.group.toUpperCase()}
                </div>
                
                <div className="mt-md">
                  <p className="text-sm opacity-70">Known Connections</p>
                  <ul className="connections-list mt-sm">
                    {data?.links.filter(l => l.source.id === selectedNode.id || l.target.id === selectedNode.id).map((l, idx) => {
                      const isSource = l.source.id === selectedNode.id;
                      const connectedNode = isSource ? l.target : l.source;
                      return (
                        <li key={idx} className="connection-item">
                          <span className="text-cyan">{l.label}</span> {connectedNode.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                
                {selectedNode.group === 'case' && (
                  <button 
                    className="btn btn-primary w-full mt-md"
                    onClick={() => openCase360(selectedNode.caseId)}
                  >
                    View Case 360
                  </button>
                )}
                {selectedNode.group === 'accused' && (
                  <button 
                    className="btn btn-outline w-full mt-md"
                    onClick={() => setCurrentView('people')}
                  >
                    View People CRM
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
