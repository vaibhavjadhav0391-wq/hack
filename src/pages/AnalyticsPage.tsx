import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Clock, Activity, BarChart2, Users } from 'lucide-react'

const statCards = [
  { label: 'On-Time Rate', value: '87.4%', change: '+2.1%', up: true, icon: TrendingUp, color: 'teal' },
  { label: 'Avg Delay', value: '3.2 min', change: '-0.8m', up: true, icon: Clock, color: 'green' },
  { label: 'ETA Accuracy', value: '94.1%', change: '+1.3%', up: true, icon: Activity, color: 'cyan' },
  { label: 'Daily Riders', value: '1,248', change: '+12%', up: true, icon: Users, color: 'purple' },
]

const hourlyData = [
  { hour: '6AM', delay: 1.2, ontime: 92 },
  { hour: '7AM', delay: 2.8, ontime: 78 },
  { hour: '8AM', delay: 5.1, ontime: 62 },
  { hour: '9AM', delay: 3.4, ontime: 74 },
  { hour: '10AM', delay: 1.8, ontime: 88 },
  { hour: '11AM', delay: 1.2, ontime: 91 },
  { hour: '12PM', delay: 2.0, ontime: 85 },
  { hour: '1PM', delay: 2.5, ontime: 82 },
  { hour: '2PM', delay: 1.5, ontime: 89 },
  { hour: '3PM', delay: 3.8, ontime: 71 },
  { hour: '4PM', delay: 4.9, ontime: 65 },
  { hour: '5PM', delay: 5.8, ontime: 58 },
  { hour: '6PM', delay: 3.2, ontime: 77 },
  { hour: '7PM', delay: 2.1, ontime: 84 },
  { hour: '8PM', delay: 1.0, ontime: 94 },
]

const weekData = [
  { day: 'Mon', ontime: 85 },
  { day: 'Tue', ontime: 89 },
  { day: 'Wed', ontime: 82 },
  { day: 'Thu', ontime: 91 },
  { day: 'Fri', ontime: 76 },
  { day: 'Sat', ontime: 95 },
  { day: 'Sun', ontime: 97 },
]

const etaAccuracy = [1.2, 0.8, 1.5, 0.9, 2.1, 1.3, 0.7, 1.8, 1.1, 0.6, 1.4, 0.9]

const colorMap: Record<string, string> = {
  teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  green: 'text-green-400 bg-green-500/10 border-green-500/20',
  cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
}

export default function AnalyticsPage() {
  const maxDelay = Math.max(...hourlyData.map(d => d.delay))

  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-3xl text-white mb-1">Analytics Dashboard</h1>
          <p className="text-slate-400 text-sm mb-8">Historical performance insights — last 7 days</p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`stat-card rounded-2xl p-5 border ${colorMap[stat.color]}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <Icon size={14} className={colorMap[stat.color].split(' ')[0]} />
                </div>
                <p className="text-2xl font-display font-bold text-white mb-1">{stat.value}</p>
                <span className={`text-xs font-medium ${stat.up ? 'text-teal-400' : 'text-red-400'}`}>
                  {stat.change} vs last week
                </span>
              </motion.div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Hourly delay bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-light border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-white">Average Delay by Hour</h3>
                <p className="text-slate-500 text-xs mt-0.5">Peak hours: 8AM, 5PM</p>
              </div>
              <BarChart2 size={16} className="text-slate-500" />
            </div>
            <div className="flex items-end gap-1.5 h-40">
              {hourlyData.map((d, i) => (
                <motion.div
                  key={d.hour}
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.delay / maxDelay) * 100}%` }}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.5 }}
                  className="flex-1 flex flex-col justify-end gap-1"
                >
                  <div
                    className="rounded-t-sm w-full"
                    style={{
                      background: d.delay > 4 ? 'rgba(239,68,68,0.7)' : d.delay > 2.5 ? 'rgba(245,158,11,0.7)' : 'rgba(20,184,166,0.7)',
                    }}
                    title={`${d.hour}: ${d.delay}m delay`}
                  />
                </motion.div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-2 overflow-hidden">
              {hourlyData.map(d => (
                <div key={d.hour} className="flex-1 text-center">
                  <span className="text-[8px] text-slate-600">{d.hour.replace('AM', '').replace('PM', '')}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-teal-400/70" />Low (&lt;2.5m)</span>
              <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-sm bg-amber-400/70" />Moderate</span>
              <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2 h-2 rounded-sm bg-red-400/70" />Peak delay</span>
            </div>
          </motion.div>

          {/* Weekly on-time % */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-light border border-white/5 rounded-2xl p-6"
          >
            <h3 className="font-display font-semibold text-white mb-1">On-Time Rate</h3>
            <p className="text-slate-500 text-xs mb-6">This week by day</p>
            <div className="space-y-3">
              {weekData.map((d, i) => (
                <div key={d.day} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-8">{d.day}</span>
                  <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.ontime}%` }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
                      className="h-full rounded-lg flex items-center justify-end pr-2"
                      style={{
                        background: d.ontime >= 90 ? 'rgba(20,184,166,0.6)' : d.ontime >= 80 ? 'rgba(56,189,248,0.5)' : 'rgba(245,158,11,0.5)',
                      }}
                    >
                      <span className="text-[10px] text-white font-mono">{d.ontime}%</span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ETA model accuracy sparkline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3 glass-light border border-white/5 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-white">ML ETA Model Error (MAE)</h3>
                <p className="text-slate-500 text-xs mt-0.5">Mean Absolute Error in minutes — lower is better</p>
              </div>
              <span className="text-xs text-teal-400 font-mono bg-teal-500/10 px-3 py-1 rounded-full">Avg: 1.2 min</span>
            </div>
            <div className="flex items-end gap-2 h-24">
              {etaAccuracy.map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${(val / 2.5) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.06, duration: 0.5 }}
                  className="flex-1 rounded-t"
                  style={{ background: val < 1 ? 'rgba(20,184,166,0.8)' : val < 1.5 ? 'rgba(56,189,248,0.7)' : 'rgba(245,158,11,0.6)' }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-600 font-mono">
              {['Jan', '', '', 'Apr', '', '', 'Jul', '', '', 'Oct', '', 'Dec'].map((m, i) => (
                <span key={i}>{m}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
