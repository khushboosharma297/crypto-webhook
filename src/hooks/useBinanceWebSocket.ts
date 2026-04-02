import { useState, useEffect, useRef, useCallback } from 'react';

export interface TickerData {
  symbol: string;
  lastPrice: number;
  priceChange24h: number;
  priceChangePercent: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  timestamp: number;
  prevPrice?: number;
}

const PAIRS = ['btcusdt', 'ethusdt', 'bnbusdt'];

export function useBinanceWebSocket() {
  const [tickers, setTickers] = useState<Record<string, TickerData>>({});
  const [connected, setConnected] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const prevPrices = useRef<Record<string, number>>({});

  const connect = useCallback(() => {
    const streams = PAIRS.map(p => `${p}@ticker`).join('/');
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      setTimeout(connect, 3000);
    };
    ws.onerror = () => ws.close();

    ws.onmessage = (event) => {
      const { data } = JSON.parse(event.data);
      if (!data) return;
      const symbol = data.s;
      const lastPrice = parseFloat(data.c);
      
      setTickers(prev => ({
        ...prev,
        [symbol]: {
          symbol,
          lastPrice,
          priceChange24h: parseFloat(data.p),
          priceChangePercent: parseFloat(data.P),
          high24h: parseFloat(data.h),
          low24h: parseFloat(data.l),
          volume24h: parseFloat(data.v),
          timestamp: data.E,
          prevPrice: prevPrices.current[symbol],
        }
      }));
      prevPrices.current[symbol] = lastPrice;
      setMessageCount(c => c + 1);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, [connect]);

  return { tickers, connected, messageCount };
}
