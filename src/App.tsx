import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from '@/components/blocks/Navbar'
import HomePage from '@/pages/HomePage'
import TrackerPage from '@/pages/TrackerPage'
import FeaturesPage from '@/pages/FeaturesPage'
import AnalyticsPage from '@/pages/AnalyticsPage'
import DriverPage from '@/pages/DriverPage'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/driver" element={<DriverPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
