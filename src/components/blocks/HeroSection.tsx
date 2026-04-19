import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Wifi, WifiOff, MapPin, Clock, Shield, Zap } from 'lucide-react'
import { SparklesText } from '@/components/ui/sparkles-text'

const floatVariants = {
  animate: { y: [0, -8, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' }
})

function LiveBusCard() {
  return (
    <motion.div
      variants={floatVariants}
      animate="animate"
      className="glass rounded-2xl p-5 w-72 shadow-2xl glow-teal"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-slate-400">BUS-01 • Campus Loop</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-xs text-teal-400">LIVE</span>
        </div>
      </div>
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-xs text-slate-500 mb-1">Next Stop</p>
          <p className="text-white font-semibold">Library Block</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-display font-bold text-teal-400">4</p>
          <p className="text-xs text-slate-400">minutes</p>
        </div>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '72%' }}
          transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-slate-500">Main Gate</span>
        <span className="text-xs text-teal-400">Library</span>
      </div>
      <div className="mt-4 pt-3 border-t border-white/5 flex gap-4">
        <div className="text-center">
          <p className="text-white font-semibold text-sm">28</p>
          <p className="text-xs text-slate-500">km/h</p>
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-sm">94%</p>
          <p className="text-xs text-slate-500">accuracy</p>
        </div>
        <div className="text-center">
          <p className="text-teal-400 font-semibold text-sm">Good</p>
          <p className="text-xs text-slate-500">signal</p>
        </div>
      </div>
    </motion.div>
  )
}

function NetworkStatusBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2 }}
      className="absolute -top-4 -right-4 glass rounded-xl px-3 py-2 flex items-center gap-2 border border-teal-500/20"
    >
      <Wifi size={12} className="text-teal-400" />
      <span className="text-xs text-teal-400 font-mono">Adaptive mode</span>
    </motion.div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-900/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — Text */}
        <div>
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-teal-500/20 mb-6">
            <Zap size={12} className="text-teal-400" />
            <span className="text-xs text-teal-400 font-mono">College Transport System v2.0</span>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <SparklesText
              text="TransitPulse"
              className="text-5xl sm:text-6xl lg:text-7xl text-white mb-2"
              colors={{ first: '#14b8a6', second: '#38bdf8' }}
              sparklesCount={8}
            />
          </motion.div>

          <motion.h2 {...fadeUp(0.2)} className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-300 mb-6 leading-tight">
            Know your bus,<br />
            <span className="text-gradient">even offline.</span>
          </motion.h2>

          <motion.p {...fadeUp(0.3)} className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
            Real-time campus bus tracking with ML-powered ETAs that adapts to low bandwidth, handles network drops gracefully, and keeps commuters informed — always.
          </motion.p>

          <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-4">
            <Link
              to="/tracker"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 text-black font-semibold hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/25 text-sm"
            >
              Track Live Buses <ArrowRight size={16} />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all text-sm font-medium"
            >
              See How It Works
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-6 mt-10">
            {[
              { icon: MapPin, label: '8 Stops', sub: 'Campus Loop' },
              { icon: Clock, label: '< 30s', sub: 'ETA accuracy' },
              { icon: Shield, label: '99.2%', sub: 'Uptime' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                  <Icon size={14} className="text-teal-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <p className="text-slate-500 text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Live Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative">
            <LiveBusCard />
            <NetworkStatusBadge />
            {/* Decorative rings */}
            <div className="absolute -inset-8 rounded-full border border-teal-500/5 pointer-events-none" />
            <div className="absolute -inset-16 rounded-full border border-teal-500/3 pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-500 font-mono">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-teal-400/60" />
        </motion.div>
      </motion.div>
    </section>
  )
}
