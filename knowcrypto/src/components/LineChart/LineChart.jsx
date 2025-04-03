import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; 
import Chart from 'react-google-charts';

const LineChart = ({ historicalData }) => {
  const [data, setData] = useState([["Date", "Prices"]]);

  useEffect(() => {
    let dataCopy = [["Date", "Prices"]];

    if (historicalData && Array.isArray(historicalData.prices)) {
      historicalData.prices.forEach((item) => {
        dataCopy.push([new Date(item[0]), item[1]]);
      });
      setData(dataCopy);
    }
  }, [historicalData]);

  return (
    <Chart
      chartType="LineChart"
      data={data}
      height="400px"
      legendToggle
    />
  );
};


LineChart.propTypes = {
  historicalData: PropTypes.shape({
    prices: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)) 
  })
};

export default LineChart;

