import './Coin.css';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { CoinContext } from '../../context/CoinContext';
import LineChart from '../../components/LineChart/LineChart';

const Coin = () => {
  const { coinId } = useParams();
  const { currency } = useContext(CoinContext);

  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coinId) return;

    let isMounted = true; 
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchCoinData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
          method: 'GET',
          headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-cJNzXjsFiobeFJVfvR6GmcMZ' },
          signal,
        });
        if (!response.ok) throw new Error(`Error ${response.status}: Failed to fetch data`);

        const data = await response.json();
        if (isMounted) setCoinData(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Coin Data Fetch Error:", err);
          if (isMounted) setError(err.message);
        }
      }
    };

    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`,
          {
            method: 'GET',
            headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-cJNzXjsFiobeFJVfvR6GmcMZ' },
            signal,
          }
        );
        if (!response.ok) throw new Error(`Error ${response.status}: Failed to fetch historical data`);

        const data = await response.json();
        if (isMounted) setHistoricalData(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Historical Data Fetch Error:", err);
          if (isMounted) setError(err.message);
        }
      }
    };

    fetchCoinData();
    fetchHistoricalData();

    return () => {
      isMounted = false;
      controller.abort(); 
    };
  }, [coinId, currency]);

  
  useEffect(() => {
    if (coinData && historicalData) {
      setLoading(false);
    }
  }, [coinData, historicalData]);

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="spinner">
        
        <div className="spin"></div>
      </div>
    );
  }

  return (
    <div className="coin">
      <div className="coin-name">
        <img src={coinData?.image?.large} alt={coinData?.name} />
        <p><b>{coinData?.name} ({coinData?.symbol?.toUpperCase()})</b></p>
      </div>
      <div className="coin-chart">
        <LineChart historicalData={historicalData} />
      </div>

      <div className="coin-info">
        <ul>
          <li>Crypto Market Rank</li>
          <li>{coinData?.market_cap_rank || "N/A"}</li>
        </ul>
        <ul>
          <li>Current Price</li>
          <li>{currency.symbol}{coinData?.market_data?.current_price[currency.name]?.toLocaleString() || "N/A"}</li>
        </ul>
        <ul>
          <li>Market Cap</li>
          <li>{currency.symbol}{coinData?.market_data?.market_cap[currency.name]?.toLocaleString() || "N/A"}</li>
        </ul>
        <ul>
          <li>24 Hour High</li>
          <li>{currency.symbol}{coinData?.market_data?.high_24h[currency.name]?.toLocaleString() || "N/A"}</li>
        </ul>
        <ul>
          <li>24 Hour Low</li>
          <li>{currency.symbol}{coinData?.market_data?.low_24h[currency.name]?.toLocaleString() || "N/A"}</li>
        </ul>
      </div>
    </div>
  );
};

export default Coin;

