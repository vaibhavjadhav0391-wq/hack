import React, { useState, useRef, useContext, createContext, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'

const MouseContext = createContext({ x: 0, y: 0 })

function DockIcon({ icon }: { icon: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const mouse = useContext(MouseContext)
  const distance = useMotionValue(Infinity)

  useEffect(() => {
    if (!ref.current || mouse.x === 0) {
      distance.set(Infinity)
      return
    }
    const iconRect = ref.current.getBoundingClientRect()
    const containerRect = ref.current.parentElement!.getBoundingClientRect()
    const iconCenterX = iconRect.left + iconRect.width / 2
    const mouseXAbsolute = containerRect.left + mouse.x
    distance.set(Math.abs(mouseXAbsolute - iconCenterX))
  }, [mouse, distance])

  const width = useTransform(distance, [0, 100], [60, 44])
  const springW = useSpring(width, { mass: 0.1, stiffness: 150, damping: 12 })

  return (
    <motion.div
      ref={ref}
      style={{ width: springW }}
      className="aspect-square rounded-full bg-white/10 border border-white/10 grid place-items-center cursor-pointer hover:bg-teal-500/20 hover:border-teal-500/40 transition-colors text-slate-300 hover:text-teal-400"
    >
      {icon}
    </motion.div>
  )
}

export default function MagneticDock() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const onMouseMove = (e: React.MouseEvent) => {
    const { clientX, currentTarget } = e
    const { left } = (currentTarget as HTMLElement).getBoundingClientRect()
    setPos({ x: clientX - left, y: 0 })
  }

  const onMouseLeave = () => setPos({ x: 0, y: 0 })

  return (
    <MouseContext.Provider value={pos}>
      <div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="flex h-16 items-end gap-3 rounded-2xl glass px-4 pb-3"
      >
        <DockIcon icon={<Github size={18} />} />
        <DockIcon icon={<Linkedin size={18} />} />
        <DockIcon icon={<Twitter size={18} />} />
        <DockIcon icon={<Mail size={18} />} />
      </div>
    </MouseContext.Provider>
  )
}
