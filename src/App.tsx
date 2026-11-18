import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import Team from './pages/Team'
import About from './pages/About'
import Contacts from './pages/Contacts'
import Booking from './pages/Booking'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'
import Demo from './pages/Demo'

const titles: Record<string, string> = {
  '/': 'мрія — простір твоєї краси',
  '/services': 'Послуги та ціни — мрія',
  '/team': 'Наші майстрині — мрія',
  '/about': 'Про наш простір — мрія',
  '/contacts': 'Контакти — мрія',
  '/booking': 'Онлайн-запис · деморежим — мрія',
  '/privacy': 'Конфіденційність — мрія',
  '/demo': 'Про демоверсію — мрія',
}

export default function App() {
  const location = useLocation()
  useEffect(() => { document.title = `${titles[location.pathname] || 'Сторінку не знайдено — мрія'} · демоверсія для портфоліо` }, [location.pathname])
  return <Routes><Route element={<Layout />}><Route index element={<Home />} /><Route path="services" element={<Services />} /><Route path="team" element={<Team />} /><Route path="about" element={<About />} /><Route path="contacts" element={<Contacts />} /><Route path="booking" element={<Booking />} /><Route path="privacy" element={<Privacy />} /><Route path="demo" element={<Demo />} /><Route path="*" element={<NotFound />} /></Route></Routes>
}
