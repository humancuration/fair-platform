import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NetworkGraph = ({ nodes, links }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 400;
    svg.attr('width', width).attr('height', height);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value));

    const node = svg.append('g')
      .selectAll('.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));

    node.append('circle')
      .attr('r', 15)
      .attr('fill', d => color(d.group))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    node.append('text')
      .text(d => d.id)
      .attr('x', 18)
      .attr('y', 6)
      .style('font-size', '12px');

    node.append('title')
      .text(d => `${d.id}\n${d.group}`);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.5, 5])
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform);
      });

    svg.call(zoom);

  }, [nodes, links]);

  return <svg ref={ref}></svg>;
};

export default NetworkGraph;
