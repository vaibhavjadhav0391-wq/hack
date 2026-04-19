'use client'
import React, { ComponentProps, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { FacebookIcon, FrameIcon, InstagramIcon, LinkedinIcon, YoutubeIcon, BusIcon } from 'lucide-react'

const footerLinks = [
  { label: 'Product', links: [{ title: 'Features', href: '#features' }, { title: 'Live Tracker', href: '#tracker' }, { title: 'Driver App', href: '#driver' }, { title: 'Analytics', href: '#analytics' }] },
  { label: 'Company', links: [{ title: 'About Us', href: '#about' }, { title: 'Privacy Policy', href: '#' }, { title: 'Terms of Service', href: '#' }, { title: 'Contact', href: '#contact' }] },
  { label: 'Resources', links: [{ title: 'Documentation', href: '#' }, { title: 'API Reference', href: '#' }, { title: 'Changelog', href: '#' }, { title: 'Help Center', href: '#' }] },
  {
    label: 'Social', links: [
      { title: 'Facebook', href: '#', icon: FacebookIcon },
      { title: 'Instagram', href: '#', icon: InstagramIcon },
      { title: 'YouTube', href: '#', icon: YoutubeIcon },
      { title: 'LinkedIn', href: '#', icon: LinkedinIcon },
    ]
  },
]

type ViewAnimationProps = { delay?: number; className?: ComponentProps<typeof motion.div>['className']; children: ReactNode }

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion()
  if (shouldReduceMotion) return <>{children}</>
  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >{children}</motion.div>
  )
}

export function Footer() {
  return (
    <footer className="relative w-full border-t border-white/5 bg-navy-800/50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 xl:grid-cols-3 xl:gap-12">
          <AnimatedContainer className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                <BusIcon size={16} className="text-teal-400" />
              </div>
              <span className="font-display font-bold text-lg text-white">TransitPulse</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Real-time college bus tracking that stays accurate even when the network doesn't.
            </p>
            <p className="text-slate-500 text-xs mt-8">
              © {new Date().getFullYear()} TransitPulse. All rights reserved.
            </p>
          </AnimatedContainer>
          <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
            {footerLinks.map((section, i) => (
              <AnimatedContainer key={section.label} delay={0.1 + i * 0.1}>
                <div>
                  <h3 className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-4">{section.label}</h3>
                  <ul className="space-y-2">
                    {section.links.map(link => (
                      <li key={link.title}>
                        <a href={link.href} className="text-slate-400 hover:text-white text-sm inline-flex items-center gap-1.5 transition-colors duration-200">
                          {'icon' in link && link.icon && <link.icon className="w-3.5 h-3.5" />}
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
