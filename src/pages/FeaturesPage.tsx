import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Wifi, Database, Brain, TrendingUp, Signal, Activity, CheckCircle, Zap } from 'lucide-react'
import FeaturesSection from '@/components/blocks/FeaturesSection'
import { DesertDrift } from '@/components/ui/desert-drift'

const howItWorks = [
  {
    step: '01',
    icon: Signal,
    title: 'GPS Ping Collected',
    description: 'Driver device sends GPS coordinates every 3–30 seconds depending on network quality. The adaptive engine negotiates the best payload format.',
    color: 'teal',
  },
  {
    step: '02',
    icon: Database,
    title: 'Store or Forward',
    description: 'If online, pings stream via WebSocket. If offline, IndexedDB queues them locally. On reconnect, a batch upload restores the complete route history.',
    color: 'cyan',
  },
  {
    step: '03',
    icon: TrendingUp,
    title: 'Interpolation Engine',
    description: 'Catmull-Rom splines smooth the vehicle path between sparse pings. Dead-reckoning estimates position using last known speed and heading.',
    color: 'purple',
  },
  {
    step: '04',
    icon: Brain,
    title: 'ML ETA Prediction',
    description: 'RandomForest model takes 7 features — time, stops remaining, speed, historical delay — and outputs an ETA with a confidence interval.',
    color: 'amber',
  },
  {
    step: '05',
    icon: Activity,
    title: 'Live Map Renders',
    description: 'Animated markers pulse on a dark CartoDB map. A fading polyline trail shows recent movement. The sidebar ETA cards update in real time.',
    color: 'green',
  },
]

const colorMap: Record<string, { icon: string; border: string; bg: string; step: string }> = {
  teal: { icon: 'text-teal-400', border: 'border-teal-500/20', bg: 'bg-teal-500/10', step: 'text-teal-500/40' },
  cyan: { icon: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10', step: 'text-cyan-500/40' },
  purple: { icon: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/10', step: 'text-purple-500/40' },
  amber: { icon: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10', step: 'text-amber-500/40' },
  green: { icon: 'text-green-400', border: 'border-green-500/20', bg: 'bg-green-500/10', step: 'text-green-500/40' },
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero strip */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-teal-500/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-teal-500/20 text-xs text-teal-400 font-mono mb-6"
          >
            <Zap size={11} /> How TransitPulse Works
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold text-4xl sm:text-5xl text-white mb-5 leading-tight"
          >
            Engineered for the<br />
            <span className="text-gradient">worst-case scenario.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Five stages, working in harmony to deliver reliable transit data under any condition —
            from blazing 5G to total signal blackout.
          </motion.p>
        </div>
      </section>

      {/* How it works — stepped flow */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-8 top-10 bottom-10 w-px bg-gradient-to-b from-teal-500/30 via-purple-500/20 to-amber-500/30 hidden md:block" />

            <div className="space-y-6">
              {howItWorks.map((item, i) => {
                const Icon = item.icon
                const c = colorMap[item.color]
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative flex gap-6 md:gap-10"
                  >
                    {/* Step bubble */}
                    <div className="flex-shrink-0 relative z-10">
                      <div className={`w-16 h-16 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center shadow-lg`}>
                        <Icon size={22} className={c.icon} />
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 glass-light border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                      <span className={`absolute top-4 right-5 font-display font-black text-5xl ${c.step} select-none`}>
                        {item.step}
                      </span>
                      <h3 className="font-display font-semibold text-white text-lg mb-2">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed max-w-lg">{item.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Full feature grid */}
      <FeaturesSection />

      {/* 3D Spline embed section */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
              Visualize the <span className="text-gradient">network resilience</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              Interactive 3D model showing how data flows between bus, tower, and server even under signal stress.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-full h-[480px] rounded-2xl overflow-hidden border border-white/8 shadow-2xl glow-teal"
          >
            <DesertDrift />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-light border border-teal-500/15 rounded-3xl p-12"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/25 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={24} className="text-teal-400" />
            </div>
            <h2 className="font-display font-bold text-3xl text-white mb-4">
              Ready to track?
            </h2>
            <p className="text-slate-400 mb-8">Open the live tracker and watch all three buses navigate the campus loop in real time.</p>
            <Link
              to="/tracker"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-teal-500 text-black font-semibold hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20"
            >
              Open Live Tracker <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
