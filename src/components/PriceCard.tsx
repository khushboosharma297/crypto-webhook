import { TickerData } from '@/hooks/useBinanceWebSocket';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceCardProps {
  ticker: TickerData;
}

const SYMBOL_NAMES: Record<string, string> = {
  BTCUSDT: 'Bitcoin',
  ETHUSDT: 'Ethereum',
  BNBUSDT: 'BNB',
};

const SYMBOL_ICONS: Record<string, string> = {
  BTCUSDT: '₿',
  ETHUSDT: 'Ξ',
  BNBUSDT: '◆',
};

function formatPrice(price: number): string {
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatVolume(vol: number): string {
  if (vol >= 1_000_000) return (vol / 1_000_000).toFixed(2) + 'M';
  if (vol >= 1_000) return (vol / 1_000).toFixed(2) + 'K';
  return vol.toFixed(2);
}

export default function PriceCard({ ticker }: PriceCardProps) {
  const isUp = ticker.priceChangePercent > 0;
  const isDown = ticker.priceChangePercent < 0;
  const priceFlash = ticker.prevPrice !== undefined
    ? ticker.lastPrice > ticker.prevPrice ? 'up' : ticker.lastPrice < ticker.prevPrice ? 'down' : 'same'
    : 'same';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-xl border bg-card p-6 transition-shadow duration-300 ${
        isUp ? 'glow-up border-[hsl(var(--price-up)/0.2)]' : isDown ? 'glow-down border-[hsl(var(--price-down)/0.2)]' : ''
      }`}
    >
      {/* Background glow */}
      <div className={`absolute inset-0 opacity-5 ${isUp ? 'bg-[hsl(var(--price-up))]' : isDown ? 'bg-[hsl(var(--price-down))]' : ''}`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">{SYMBOL_ICONS[ticker.symbol] || '●'}</span>
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-foreground">
                {ticker.symbol.replace('USDT', '/USDT')}
              </h3>
              <p className="text-xs text-muted-foreground">{SYMBOL_NAMES[ticker.symbol] || ticker.symbol}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isUp ? 'bg-[hsl(var(--price-up)/0.15)] text-price-up' : isDown ? 'bg-[hsl(var(--price-down)/0.15)] text-price-down' : 'bg-muted text-price-neutral'
          }`}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : isDown ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {isUp ? '+' : ''}{ticker.priceChangePercent.toFixed(2)}%
          </div>
        </div>

        {/* Price */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={ticker.lastPrice}
            initial={{ opacity: 0.7, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4"
          >
            <span className={`font-mono-code text-3xl font-bold tracking-tight ${
              priceFlash === 'up' ? 'text-price-up' : priceFlash === 'down' ? 'text-price-down' : 'text-foreground'
            }`}>
              ${formatPrice(ticker.lastPrice)}
            </span>
            <span className={`ml-2 text-sm font-mono-code ${
              isUp ? 'text-price-up' : isDown ? 'text-price-down' : 'text-price-neutral'
            }`}>
              {isUp ? '+' : ''}{formatPrice(ticker.priceChange24h)}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/50">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">24h High</p>
            <p className="font-mono-code text-xs text-foreground">${formatPrice(ticker.high24h)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">24h Low</p>
            <p className="font-mono-code text-xs text-foreground">${formatPrice(ticker.low24h)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Volume</p>
            <p className="font-mono-code text-xs text-foreground">{formatVolume(ticker.volume24h)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
