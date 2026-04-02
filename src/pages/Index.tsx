import { useBinanceWebSocket } from '@/hooks/useBinanceWebSocket';
import PriceCard from '@/components/PriceCard';
import StatusBar from '@/components/StatusBar';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const PAIR_ORDER = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];

const Index = () => {
  const { tickers, connected, messageCount } = useBinanceWebSocket();
  const sortedTickers = PAIR_ORDER.map(s => tickers[s]).filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Crypto Live Ticker
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time prices via Binance WebSocket · BTC · ETH · BNB
          </p>
        </motion.div>

        {/* Status */}
        <div className="mb-6">
          <StatusBar connected={connected} messageCount={messageCount} />
        </div>

        {/* Price cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sortedTickers.length > 0 ? (
            sortedTickers.map(t => <PriceCard key={t.symbol} ticker={t} />)
          ) : (
            PAIR_ORDER.map(s => (
              <div key={s} className="rounded-xl border bg-card p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-24 mb-4" />
                <div className="h-8 bg-muted rounded w-40 mb-4" />
                <div className="h-3 bg-muted rounded w-full" />
              </div>
            ))
          )}
        </div>

        {/* Architecture note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 rounded-lg border bg-card"
        >
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Architecture</h2>
          <div className="flex items-center gap-2 text-xs font-mono-code text-muted-foreground flex-wrap">
            <span className="px-2 py-1 rounded bg-muted">Binance WSS</span>
            <span>→</span>
            <span className="px-2 py-1 rounded bg-muted">Browser Client</span>
            <span>→</span>
            <span className="px-2 py-1 rounded bg-muted">Live UI</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
