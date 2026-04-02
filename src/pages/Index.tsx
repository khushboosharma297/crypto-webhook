import { useBinanceWebSocket, TickerData } from '@/hooks/useBinanceWebSocket';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PAIR_ORDER = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
const NAMES: Record<string, string> = { BTCUSDT: 'Bitcoin', ETHUSDT: 'Ethereum', BNBUSDT: 'BNB' };

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Row({ t }: { t: TickerData }) {
  const up = t.priceChangePercent >= 0;
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-semibold text-foreground">{NAMES[t.symbol]}</p>
        <p className="text-xs text-muted-foreground">{t.symbol.replace('USDT', '/USDT')}</p>
      </div>
      <div className="text-right">
        <p className="font-mono-code text-sm font-bold text-foreground">${fmt(t.lastPrice)}</p>
        <p className={`flex items-center justify-end gap-1 text-xs font-mono-code ${up ? 'text-price-up' : 'text-price-down'}`}>
          {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {up ? '+' : ''}{t.priceChangePercent.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

export default function Index() {
  const { tickers, connected } = useBinanceWebSocket();
  const list = PAIR_ORDER.map(s => tickers[s]).filter(Boolean);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold text-foreground">Live Prices</h1>
          <span className={`flex items-center gap-1.5 text-xs ${connected ? 'text-price-up' : 'text-price-down'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-[hsl(var(--price-up))]' : 'bg-[hsl(var(--price-down))]'}`} />
            {connected ? 'Live' : 'Offline'}
          </span>
        </div>
        <div className="rounded-xl border bg-card px-5">
          {list.length > 0
            ? list.map(t => <Row key={t.symbol} t={t} />)
            : PAIR_ORDER.map(s => (
                <div key={s} className="py-4 border-b border-border last:border-0">
                  <div className="h-4 bg-muted rounded w-20 mb-2 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-28 animate-pulse" />
                </div>
              ))
          }
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-4">Binance WebSocket · Real-time</p>
      </div>
    </div>
  );
}
