import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

interface DataPoint {
  name: string;
  value: number;
}

interface BarChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
}

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const BarChart: React.FC<BarChartProps> = ({ data, width = 500, height = 300 }) => {
  const ref = useRef<SVGSVGElement>(null);

  const margin = useMemo(() => ({ top: 20, right: 30, bottom: 40, left: 40 }), []);
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([innerHeight, 0]);

    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.name))
      .range(d3.schemeCategory10);

    chart.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    chart.append('g')
      .call(d3.axisLeft(y));

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('padding', '10px');

    chart.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name) || 0)
      .attr('width', x.bandwidth())
      .attr('y', innerHeight)
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
      .attr('height', d => innerHeight - y(d.value));

  }, [data, innerWidth, innerHeight, margin]);

  return (
    <ChartContainer>
      <svg ref={ref} width={width} height={height}></svg>
    </ChartContainer>
  );
};

export default BarChart;
