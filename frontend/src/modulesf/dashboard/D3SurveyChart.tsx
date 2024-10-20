import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

interface DataPoint {
  label: string;
  value: number;
}

interface D3SurveyChartProps {
  data: DataPoint[];
  type: 'bar' | 'pie' | 'line';
  width?: number;
  height?: number;
}

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const D3SurveyChart: React.FC<D3SurveyChartProps> = ({ data, type, width = 600, height = 400 }) => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  const margin = useMemo(() => ({ top: 20, right: 20, bottom: 30, left: 40 }), []);
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    if (chartRef.current) {
      // Clear any existing chart
      d3.select(chartRef.current).selectAll('*').remove();

      // Create new chart based on type
      switch (type) {
        case 'bar':
          createBarChart();
          break;
        case 'pie':
          createPieChart();
          break;
        case 'line':
          createLineChart();
          break;
      }
    }
  }, [data, type, width, height, margin, innerWidth, innerHeight]);

  const createBarChart = () => {
    const svg = d3.select(chartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, innerWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([innerHeight, 0]);

    x.domain(data.map(d => d.label));
    y.domain([0, d3.max(data, d => d.value) || 0]);

    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.label) || 0)
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.value))
      .attr('height', d => innerHeight - y(d.value))
      .attr('fill', 'steelblue');

    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));
  };

  const createPieChart = () => {
    // Implement pie chart logic here
  };

  const createLineChart = () => {
    // Implement line chart logic here
  };

  return (
    <ChartContainer>
      <svg ref={chartRef}></svg>
    </ChartContainer>
  );
};

export default D3SurveyChart;
