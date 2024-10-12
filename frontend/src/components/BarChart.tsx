import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  name: string;
  value: number;
}

interface BarChartProps {
  data: DataPoint[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, width])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([height, 0]);

    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.name))
      .range(d3.schemeCategory10);

    chart.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    chart.append('g')
      .call(d3.axisLeft(y));

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    chart.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name) || 0)
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', d => color(d.name))
      .on('mouseover', (event: MouseEvent, d: DataPoint) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`${d.name}: ${d.value}`)
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value));

  }, [data]);

  return <svg ref={ref} width="500" height="300"></svg>;
};

export default BarChart;
