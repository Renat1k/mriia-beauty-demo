import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Clock3, MapPin, Menu, Phone, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { contact } from '../data'
import { Flower } from './Flower'
import { ButtonLink } from './UI'

const navItems = [
  ['/services', 'Послуги та ціни'],
  ['/team', 'Майстри'],
  ['/about', 'Про мрію'],
  ['/contacts', 'Контакти'],
]

function Logo({ footer = false }: { footer?: boolean }) {
  return <Link to="/" className={`logo ${footer ? 'logo-footer' : ''}`} aria-label="мрія — на головну"><Flower /><span>мрія<span className="logo-period">.</span></span></Link>
}

function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => { setOpen(false) }, [location.pathname, location.search])
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggleRef.current?.focus() }
      if (event.key === 'Tab') {
        const items = [toggleRef.current, ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a, button') || [])].filter(Boolean) as HTMLElement[]
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize) }
  }, [open])
  return (
    <>
      <div className="announcement demo-announcement">
        <span className="portfolio-demo-badge">ДЕМО</span>
        <span>Демоверсія для портфоліо.</span>
        <span className="announcement-end">Салон вигаданий, ціни наведені для прикладу.</span>
        <Link to="/demo" className="announcement-link">Докладніше <ArrowUpRight size={13} aria-hidden="true" /></Link>
      </div>
      <header className="site-header">
        <div className="header-inner container">
          <Logo />
          <nav className="desktop-nav" aria-label="Основна навігація">{navItems.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>
          <div className="header-actions">
            <Link className="header-phone" to="/contacts" aria-label="Переглянути демонстраційні контакти" title="Демонстраційні контакти"><Phone size={18} /></Link>
            <ButtonLink to="/booking" className="header-book">Записатися</ButtonLink>
            <button ref={toggleRef} className="menu-toggle" aria-label={open ? 'Закрити меню' : 'Відкрити меню'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
          </div>
        </div>
        {open && <div className="mobile-menu" id="mobile-menu" ref={menuRef}>
          <nav aria-label="Мобільна навігація">
            <NavLink to="/">Головна</NavLink>
            {navItems.map(([to, label]) => <NavLink key={to} to={to}>{label}<ArrowUpRight size={22} /></NavLink>)}
            <NavLink to="/demo">Про демоверсію<ArrowUpRight size={22} /></NavLink>
            <ButtonLink to="/booking">Спробувати демозапис</ButtonLink>
          </nav>
          <p><MapPin size={17} />Київ, Велика Васильківська, 30</p>
          <span className="small-muted">Приклад адреси вигаданого салону</span>
        </div>}
      </header>
    </>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand"><Logo footer /><p>Твоя краса. Твій настрій.<br />Твій час для себе.</p><span className="made-in">Створено з любов’ю в Україні <span>↗</span></span></div>
          <div><h3>Знайомся з мрією</h3><nav aria-label="Навігація в підвалі">{navItems.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}<Link to="/demo">Про демоверсію</Link><Link to="/booking">Спробувати демозапис <ArrowUpRight size={14} /></Link></nav></div>
          <div>
            <h3>Приклад контактів</h3>
            <a href={contact.map} target="_blank" rel="noreferrer" aria-label="Приклад адреси на мапі">{contact.address}<br />{contact.city} <ArrowUpRight size={14} /></a>
            <p className="footer-hours"><Clock3 size={15} />Демографік: 09:00–20:00</p>
            <span className="footer-contact-example">{contact.phone}</span>
            <span className="footer-contact-example footer-email">{contact.email}</span>
          </div>
          <div className="footer-note"><Flower /><h3>Тут можна бути собою.</h3><p>І з новою стрижкою.<br />І без особливого приводу.</p><Link to="/booking" className="text-link">Спробувати демозапис <ArrowUpRight size={18} /></Link></div>
        </div>
        <div className="footer-demo"><span className="demo-dot" /><p><strong>Демоверсія для портфоліо.</strong> Салон, команда, відгуки та контакти вигадані або наведені як ілюстрація. Ціни умовні й не є реальною пропозицією. Записи нікуди не надсилаються та не створюють реального бронювання. <Link to="/demo">Докладніше про демоверсію <ArrowUpRight size={12} /></Link></p></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} мрія. Портфолійний проєкт.</span><Link to="/privacy">Конфіденційність</Link><span>Зроблено з турботою про тебе <Flower /></span></div>
      </div>
    </footer>
  )
}

export default function Layout() {
  const location = useLocation()
  const firstRender = useRef(true)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (!firstRender.current) document.getElementById('main-content')?.focus({ preventScroll: true })
    firstRender.current = false
  }, [location.pathname])
  return <><a className="skip-link" href="#main-content">Перейти до вмісту</a><Header /><main id="main-content" tabIndex={-1}><Outlet /></main><Footer /></>
}
