import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Bus, MapPin, Clock, TrendingUp, Wifi, Shield, Star, ChevronRight } from 'lucide-react'
import HeroSection from '@/components/blocks/HeroSection'
import FeaturesSection from '@/components/blocks/FeaturesSection'
import { SparklesText } from '@/components/ui/sparkles-text'
import MagneticDock from '@/components/ui/magnetic-dock'
import { Footer } from '@/components/ui/footer-section'
import Mapbox3D from "../components/ui/Mapbox3D";

const testimonials = [
  {
    name: 'Priya S.',
    role: 'B.Tech CSE, Year 3',
    text: 'I used to miss the 8AM bus every day. TransitPulse tells me exactly when to leave my hostel. Game changer.',
    stars: 5,
  },
  {
    name: 'Arjun M.',
    role: 'Campus Transport Admin',
    text: 'The offline buffering is incredible. We were losing data every time buses went through the underpass. Not anymore.',
    stars: 5,
  },
  {
    name: 'Sneha K.',
    role: 'M.Tech, Year 1',
    text: 'Even when the signal is terrible near the labs, the ETA is still pretty accurate. I trust it completely now.',
    stars: 5,
  },
]

const statRows = [
  { label: 'GPS Pings / Day', value: '86,400', sub: 'Across all buses' },
  { label: 'ETA Accuracy', value: '94.1%', sub: 'Within 2 minutes' },
  { label: 'Network Uptime', value: '99.2%', sub: 'With graceful fallback' },
  { label: 'Data Loss', value: '0%', sub: 'Store-and-forward guarantee' },
]

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "YOUR_MAPBOX_TOKEN_HERE";
const MAPBOX_STYLE = "mapbox://styles/yaak-driving-curriculum/cm6up5as0019a01r5e6n33wmn";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-navy-900 flex flex-col overflow-x-hidden">
      <HeroSection />

      {/* Stats ribbon */}
      <section className="py-14 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/10 via-transparent to-cyan-900/10" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statRows.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-display font-black text-4xl text-gradient mb-1">{s.value}</p>
                <p className="text-white text-sm font-medium">{s.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <FeaturesSection />

      {/* How it adapts — visual explainer */}
      <section className="py-24 relative">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
              Adapts to your <span className="text-gradient">network reality.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Three fallback tiers keep data flowing no matter what's happening with the signal.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                mode: 'Excellent', signal: 4, color: 'teal', freq: 'Every 3 seconds',
                desc: 'Full JSON payload over WebSocket. Complete bus state, speed, heading, and trail history.',
                badge: 'WebSocket',
              },
              {
                mode: 'Degraded', signal: 2, color: 'amber', freq: 'Every 5–30 seconds',
                desc: 'Delta-only compressed payload or Server-Sent Events. Only lat/lng changes transmitted.',
                badge: 'SSE / Polling',
              },
              {
                mode: 'Offline', signal: 0, color: 'red', freq: 'On reconnect',
                desc: 'IndexedDB queues all pings locally. Batch-uploads restore full route on reconnection.',
                badge: 'Store & Forward',
              },
            ].map((tier, i) => (
              <motion.div
                key={tier.mode}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="card-hover glass-light border border-white/8 rounded-2xl p-6"
              >
                {/* Signal bars */}
                <div className="flex items-end gap-1 mb-4 h-8">
                  {[1, 2, 3, 4].map(bar => (
                    <div
                      key={bar}
                      className="flex-1 rounded-sm transition-all"
                      style={{
                        height: `${bar * 25}%`,
                        background: bar <= tier.signal
                          ? tier.color === 'teal' ? 'rgba(20,184,166,0.8)'
                            : tier.color === 'amber' ? 'rgba(245,158,11,0.8)'
                              : 'rgba(239,68,68,0.8)'
                          : 'rgba(255,255,255,0.08)',
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${tier.color === 'teal' ? 'bg-teal-500/10 text-teal-400' : tier.color === 'amber' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                    {tier.badge}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-1">{tier.mode} Signal</h3>
                <p className="text-xs font-mono text-slate-500 mb-3">{tier.freq}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{tier.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
              Loved by campus commuters.
            </h2>
            <p className="text-slate-400">Real feedback from students and staff.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-hover glass-light border border-white/8 rounded-2xl p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Dock */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass border border-teal-500/15 rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-radial from-teal-500/5 via-transparent to-transparent" />
            <div className="relative">
              <SparklesText
                text="Never miss your bus."
                className="text-3xl sm:text-4xl text-white mb-4"
                colors={{ first: '#14b8a6', second: '#38bdf8' }}
                sparklesCount={6}
              />
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Join hundreds of campus commuters who've made guessing their bus time a thing of the past.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/tracker"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-teal-500 text-black font-semibold hover:bg-teal-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/20"
                >
                  Start Tracking <ArrowRight size={16} />
                </Link>
                <Link
                  to="/driver"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all hover:scale-105 active:scale-95 font-medium"
                >
                  Driver App <ChevronRight size={16} />
                </Link>
              </div>

              {/* Magnetic dock */}
              <div className="flex justify-center mt-10">
                <MagneticDock />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
