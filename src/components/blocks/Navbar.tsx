import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BusIcon, Menu, X, Zap } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Tracker', href: '/tracker' },
  { label: 'Features', href: '/features' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Driver', href: '/driver' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:shadow-teal-500/50 transition-shadow">
            <BusIcon size={16} className="text-black" />
          </div>
          <span className="font-display font-bold text-white text-lg tracking-tight">TransitPulse</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                location.pathname === link.href
                  ? 'text-teal-400 bg-teal-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs text-teal-400 font-mono">3 buses live</span>
          </div>
          <Link
            to="/tracker"
            className="px-4 py-2 rounded-lg bg-teal-500 text-black text-sm font-semibold hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20"
          >
            Track Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 text-slate-400"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5 px-4 py-4"
          >
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-all',
                  location.pathname === link.href
                    ? 'text-teal-400 bg-teal-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >{link.label}</Link>
            ))}
            <Link to="/tracker" onClick={() => setMobileOpen(false)}
              className="block mt-3 px-4 py-3 rounded-lg bg-teal-500 text-black text-sm font-semibold text-center">
              Track Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
