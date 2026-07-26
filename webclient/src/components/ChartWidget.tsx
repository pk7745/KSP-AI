import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './ChartWidget.css';

interface TrendData {
  month: string;
  count?: number;
  Property?: number;
  Violent?: number;
  Cyber?: number;
  NDPS?: number;
}

interface ChartWidgetProps {
  data: TrendData[];
  title: string;
}

export function ChartWidget({ data, title }: ChartWidgetProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const processedData = data.map(d => ({
      ...d,
      count: d.count !== undefined ? d.count : ((d.Property || 0) + (d.Violent || 0) + (d.Cyber || 0) + (d.NDPS || 0))
    }));

    const x = d3.scalePoint()
      .domain(processedData.map(d => d.month))
      .range([0, width])
      .padding(0.5);

    const y = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => d.count as number) || 100])
      .range([height, 0]);

    // X Axis
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .attr("color", "var(--text-muted)")
      .selectAll("text")
      .style("font-family", "var(--font-main)")
      .style("font-size", "12px");

    // Y Axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .attr("color", "var(--text-muted)")
      .selectAll("text")
      .style("font-family", "var(--font-main)")
      .style("font-size", "12px");

    // Remove axis domain lines
    g.selectAll(".domain").remove();

    // Add Grid lines
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickSize(-width)
        .tickFormat(() => "")
      )
      .attr("color", "var(--border-light)")
      .selectAll(".domain").remove();

    // Line generator
    const line = d3.line<TrendData>()
      .x(d => x(d.month)!)
      .y(d => y(d.count as number))
      .curve(d3.curveMonotoneX);

    // Add glowing line
    g.append("path")
      .datum(processedData)
      .attr("fill", "none")
      .attr("stroke", "var(--accent-cyan)")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add dots
    g.selectAll(".dot")
      .data(processedData)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.month)!)
      .attr("cy", d => y(d.count as number))
      .attr("r", 5)
      .attr("fill", "transparent")
      .attr("stroke", "var(--text-primary)")
      .attr("stroke-width", 1.5)
      .on("mouseover", function() {
        d3.select(this)
          .attr("r", 6)
          .attr("fill", "var(--accent-cyan)");
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("r", 5)
          .attr("fill", "transparent");
      });

  }, [data]);

  return (
    <div className="chart-widget wireframe-box registration-mark">
      <div className="chart-header">
        <h3>{title}</h3>
      </div>
      <div className="chart-container">
        <svg ref={svgRef} width="100%" height="300"></svg>
      </div>
    </div>
  );
}
