import { motion } from 'framer-motion';
import { Wifi, WifiOff, Activity } from 'lucide-react';

interface StatusBarProps {
  connected: boolean;
  messageCount: number;
}

export default function StatusBar({ connected, messageCount }: StatusBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-4 py-2 rounded-lg bg-card border"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {connected ? (
            <Wifi className="w-4 h-4 text-price-up" />
          ) : (
            <WifiOff className="w-4 h-4 text-price-down" />
          )}
          <span className={`text-xs font-semibold uppercase tracking-wider ${connected ? 'text-price-up' : 'text-price-down'}`}>
            {connected ? 'Live' : 'Disconnected'}
          </span>
          {connected && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--price-up))] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[hsl(var(--price-up))]" />
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Activity className="w-3 h-3" />
        <span className="font-mono-code text-xs">{messageCount.toLocaleString()} msgs</span>
      </div>
    </motion.div>
  );
}
