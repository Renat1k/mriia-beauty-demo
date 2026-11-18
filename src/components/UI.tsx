import { ArrowDownRight, ArrowUpRight, Check, ChevronDown, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { Master } from '../data'
import { Flower } from './Flower'

export function Clay({ kind = 'hero', className = '' }: { kind?: 'hero' | 'hair' | 'nails' | 'brows' | 'flower'; className?: string }) {
  return <div className={`clay-scene ${className}`} role="img" aria-label="Об’ємна композиція з квітів та косметики у фірмових кольорах мрії"><img src={`/illustrations/${kind}.png`} alt="" fetchPriority={kind === 'hero' ? 'high' : 'auto'} decoding="async" /></div>
}

export function ButtonLink({ to, children, variant = 'primary', className = '', arrow = true }: { to: string; children: ReactNode; variant?: 'primary' | 'secondary' | 'light'; className?: string; arrow?: boolean }) {
  return <Link className={`button button-${variant} ${className}`} to={to}>{children}{arrow && <ArrowUpRight size={18} aria-hidden="true" />}</Link>
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <span className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span className="eyebrow-dot" />{children}</span>
}

export function PageHeading({ label, title, description, children }: { label: string; title: ReactNode; description: string; children?: ReactNode }) {
  return <section className="page-heading container"><Eyebrow>{label}</Eyebrow><div className="page-heading-row"><div><h1>{title}</h1><p>{description}</p></div>{children || <Flower className="page-heading-flower" />}</div></section>
}

export function SectionHeading({ label, title, description, link, linkLabel }: { label: string; title: ReactNode; description?: string; link?: string; linkLabel?: string }) {
  return <div className="section-heading"><div><Eyebrow>{label}</Eyebrow><h2>{title}</h2>{description && <p>{description}</p>}</div>{link && <Link to={link} className="text-link">{linkLabel}<ArrowUpRight size={19} /></Link>}</div>
}

export function CtaBand() {
  return <section className="container cta-container"><div className="cta-band"><div className="cta-copy"><Eyebrow>твій час для себе</Eyebrow><h2>Давай створимо<br />щось прекрасне.</h2><p>Іноді для гарного настрою достатньо одного візиту.</p><ButtonLink to="/booking">Обрати свій час</ButtonLink></div><Clay kind="flower" className="cta-clay" /><span className="cta-handwritten">ти на це заслуговуєш <ArrowDownRight size={23} /></span></div></section>
}

export function MasterCard({ master, compact = false }: { master: Master; compact?: boolean }) {
  return <article className={`master-card ${compact ? 'master-card-compact' : ''}`}><div className={`master-image bg-${master.color}`}><img src={master.image} alt={`${master.name}, ${master.role.toLocaleLowerCase('uk')}`} loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none' }} /><span className="master-initial" aria-hidden="true">{master.name[0]}</span><span className="image-badge"><span />{master.experience}</span></div><div className="master-info"><div><h3>{master.name}</h3><p>{master.role}</p></div><Link className="round-link" to={`/booking?master=${master.id}`} aria-label={`Записатися до ${master.name}`}><ArrowUpRight size={22} /></Link></div>{!compact && <><p className="master-description">{master.description}</p><p className="master-motto">{master.motto}</p><ButtonLink to={`/booking?master=${master.id}`} variant="secondary">Записатися до майстрині</ButtonLink></>}</article>
}

const faqItems = [
  ['Як працює онлайн-запис?', 'Обери послугу, майстриню та зручний час, а потім залиш ім’я й український номер телефону. Це демонстраційний сайт: запис збережеться лише у твоєму браузері. Салон не отримає заявку, а реальне бронювання не відбудеться.'],
  ['Це справжній салон? Чи актуальні ціни?', 'Ні. «Мрія» — вигаданий салон у портфолійному проєкті. Усі ціни умовні, наведені у гривнях для демонстрації інтерфейсу та не є реальним прайсом або пропозицією придбати послуги.'],
  ['Як ви дбаєте про безпеку?', 'Для концепції салону передбачено триетапну обробку інструментів: дезінфекцію, передстерилізаційне очищення та сухожарову стерилізацію. Одноразові матеріали відкривають перед гостем.'],
  ['Чи можна змінити або скасувати запис?', 'У деморежимі можна скасувати свій запис у блоці «Мої демозаписи» на сторінці онлайн-запису, а потім обрати новий час. Будемо вдячні, якщо в реальному житті ти повідомлятимеш про зміни щонайменше за 12 годин.'],
  ['Що робити, якщо я не знаю, яку послугу обрати?', 'Почни з описів на сторінці «Послуги та ціни»: там є склад, тривалість і вартість кожної процедури. Під час демозапису також можна залишити побажання чи запитання в коментарі.'],
]

export function Faq() {
  return <section className="section container faq-section"><div className="faq-intro"><Eyebrow>просто про важливе</Eyebrow><h2>Є запитання?<br />Ми поруч.</h2><p>Усе, що хочеться знати<br className="desktop-only" /> перед першим візитом.</p><Sparkles className="faq-sparkle" size={72} strokeWidth={1} /></div><div className="faq-list">{faqItems.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={20} /></summary><p>{answer}</p></details>)}</div></section>
}

export function CheckItem({ children }: { children: ReactNode }) {
  return <span className="check-item"><Check size={15} />{children}</span>
}
