import { motion } from 'framer-motion'
import { Wifi, TrendingUp, Database, Brain, Activity, Signal } from 'lucide-react'

const features = [
  {
    icon: Signal,
    color: 'teal',
    title: 'Adaptive Updates',
    description: 'System automatically adjusts payload size and frequency based on real-time network quality — from full JSON to delta-only to heartbeat-only.',
    tag: 'Core',
    metric: '3x faster',
  },
  {
    icon: TrendingUp,
    color: 'cyan',
    title: 'Predictive Smoothing',
    description: 'Catmull-Rom spline interpolation visually smooths vehicle movement between sparse GPS pings, combined with dead-reckoning for gaps.',
    tag: 'Core',
    metric: '80 trail pts',
  },
  {
    icon: Brain,
    color: 'purple',
    title: 'ML ETA Prediction',
    description: 'Random Forest model trained on historical trip data predicts arrival times with a confidence interval, even under degraded signal conditions.',
    tag: 'AI',
    metric: '94% accuracy',
  },
  {
    icon: Database,
    color: 'amber',
    title: 'Store-and-Forward',
    description: 'Driver GPS pings queue locally in IndexedDB during total signal loss. On reconnect, batch-uploads restore the full route history seamlessly.',
    tag: 'Resilience',
    metric: 'Zero data loss',
  },
  {
    icon: Activity,
    color: 'green',
    title: 'Sparse Handling',
    description: 'Efficient state management interpolates between infrequent GPS updates, maintaining accurate ETA estimates even with 60-second gaps.',
    tag: 'Core',
    metric: '< 5 min lag',
  },
  {
    icon: Wifi,
    color: 'red',
    title: 'Graceful Degradation',
    description: 'Auto-negotiates between WebSocket, Server-Sent Events, and 30s polling as signal weakens — users never see a broken experience.',
    tag: 'Network',
    metric: '3-tier fallback',
  },
]

const colorMap: Record<string, string> = {
  teal: 'from-teal-500/15 to-teal-500/5 border-teal-500/20 text-teal-400',
  cyan: 'from-cyan-500/15 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
  purple: 'from-purple-500/15 to-purple-500/5 border-purple-500/20 text-purple-400',
  amber: 'from-amber-500/15 to-amber-500/5 border-amber-500/20 text-amber-400',
  green: 'from-green-500/15 to-green-500/5 border-green-500/20 text-green-400',
  red: 'from-rose-500/15 to-rose-500/5 border-rose-500/20 text-rose-400',
}

const tagColorMap: Record<string, string> = {
  Core: 'bg-teal-500/10 text-teal-400',
  AI: 'bg-purple-500/10 text-purple-400',
  Resilience: 'bg-amber-500/10 text-amber-400',
  Network: 'bg-rose-500/10 text-rose-400',
}

export default function FeaturesSection() {
  return (
    <section className="py-24 relative" id="features">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-teal-500/20 text-xs text-teal-400 font-mono mb-4">
            Built for Resilience
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
            Every feature matters<br />
            <span className="text-gradient">when signal drops.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Six core capabilities working in harmony to deliver reliable transit data under any network condition.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon
            const colors = colorMap[f.color]
            const [gradFrom, gradTo, border, textColor] = colors.split(' ')
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`card-hover relative p-6 rounded-2xl bg-gradient-to-br ${gradFrom} ${gradTo} border ${border} glass-light`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradFrom} ${gradTo} border ${border} flex items-center justify-center`}>
                    <Icon size={18} className={textColor} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColorMap[f.tag] || 'bg-white/5 text-slate-400'}`}>
                      {f.tag}
                    </span>
                  </div>
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{f.description}</p>
                <div className={`inline-flex items-center gap-1.5 text-xs font-mono ${textColor} bg-white/5 px-2.5 py-1 rounded-lg`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                  {f.metric}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
