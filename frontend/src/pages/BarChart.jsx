// BarChart.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

const BarChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); // Clear previous content

    const width = ref.current.parentElement ? ref.current.parentElement.offsetWidth : 500;
    const height = 300;

    svg.attr('width', width).attr('height', height);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, width])
      .padding(0.4);

    const y = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value)]).range([height, 0]);

    const xAxis = (g) =>
      g.attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));

    const yAxis = (g) =>
      g.call(d3.axisLeft(y)).call((g) => g.select('.domain').remove());

    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);

    svg
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.name))
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', '#ff6f61')
      .transition()
      .duration(800)
      .attr('y', (d) => y(d.value))
      .attr('height', (d) => height - y(d.value));
  }, [data]);

  return <svg ref={ref} width={ref.current.parentElement ? ref.current.parentElement.offsetWidth : 500} height={300}></svg>;
};

BarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default BarChart;