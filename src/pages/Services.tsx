import { ArrowUpRight, Clock3, Search, ShieldCheck, Sparkles, X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { categories, formatDuration, formatPrice, services } from '../data'
import { CtaBand, PageHeading } from '../components/UI'
import DemoNotice from '../components/DemoNotice'

export default function Services() {
  const [params, setParams] = useSearchParams()
  const current = categories.some(c => c.id === params.get('category')) ? params.get('category')! : 'all'
  const [query, setQuery] = useState('')
  const visible = services.filter(s => (current === 'all' || s.category === current) && `${s.name} ${s.description}`.toLocaleLowerCase('uk').includes(query.trim().toLocaleLowerCase('uk')))

  return (
    <>
      <PageHeading label="меню твоєї краси" title={<>Турбота, яку<br />ти обираєш.</>} description="Знайди свою процедуру в демонстраційному меню. Усі ціни — умовні, у гривнях, для прикладу оформлення." />
      <section className="container service-catalog">
        <DemoNotice kind="prices" />
        <div className="catalog-toolbar">
          <div className="category-tabs" aria-label="Категорії послуг">
            {[{ id: 'all', name: 'Усі послуги' }, ...categories].map(c => <button type="button" key={c.id} className={current === c.id ? 'active' : ''} aria-pressed={current === c.id} onClick={() => setParams(c.id === 'all' ? {} : { category: c.id }, { preventScrollReset: true })}>{c.name}{c.id === 'all' && <span>{services.length}</span>}</button>)}
          </div>
          <div className="search-field"><Search size={18} /><input aria-label="Пошук послуги" placeholder="Знайти свою послугу" value={query} onChange={e => setQuery(e.target.value)} />{query && <button aria-label="Очистити пошук" onClick={() => setQuery('')}><X size={17} /></button>}</div>
        </div>
        <div className="catalog-benefits"><span><Sparkles size={16} />Демонстраційне меню</span><span><ShieldCheck size={16} />Без замовлення та оплати</span><span>{visible.length} {visible.length === 1 ? 'послуга' : visible.length < 5 && visible.length > 0 ? 'послуги' : 'послуг'}</span></div>
        {visible.length ? <div className="service-list">
          {visible.map(service => {
            const cat = categories.find(c => c.id === service.category)!
            return (
              <article className="service-item" key={service.id}>
                <div className={`service-item-icon bg-${cat.color}`}><span>{cat.id === 'hair' ? '✂' : cat.id === 'nails' ? '✳' : cat.id === 'brows' ? '◡' : cat.id === 'care' ? '❋' : '✦'}</span></div>
                <div className="service-item-copy"><span className="service-category-label">{cat.name}{service.popular && <span className="popular-badge">Улюблене</span>}</span><h2>{service.name}</h2><p>{service.description}</p></div>
                <div className="service-item-meta"><span><Clock3 size={15} />{formatDuration(service.duration)}</span><strong>{formatPrice(service.price)}</strong><small className="demo-price-label">демоціна</small></div>
                <Link className="service-book button button-secondary" to={`/booking?service=${service.id}`} aria-label={`Записатися: ${service.name}`}>Спробувати запис<ArrowUpRight size={18} /></Link>
              </article>
            )
          })}
        </div> : <div className="empty-state"><Search size={36} /><h2>Поки нічого не знайшли</h2><p>Спробуй іншу назву або переглянь усі наші послуги.</p><button className="button button-primary" onClick={() => { setQuery(''); setParams({}) }}>Показати всі послуги</button></div>}
        <div className="price-note"><Sparkles size={23} /><p>Хочеш перевірити, як працює онлайн-запис? Обери будь-яку послугу й пройди всі кроки. Заявка нікуди не надсилатиметься, а ціна залишиться лише прикладом.</p><Link to="/booking" className="text-link">Спробувати <ArrowUpRight size={18} /></Link></div>
      </section>
      <CtaBand />
    </>
  )
}
