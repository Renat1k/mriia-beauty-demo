import { useState } from 'react'
import { categories, masters } from '../data'
import { CtaBand, MasterCard, PageHeading } from '../components/UI'
import DemoNotice from '../components/DemoNotice'

export default function Team() {
  const [category, setCategory] = useState('all')
  const visible = masters.filter(m => category === 'all' || m.categories.some(c => c === category))
  return (
    <>
      <PageHeading label="люди, які дбають" title={<>Твоя краса —<br />у хороших руках.</>} description="Знайомся з командою нашої концепції. Імена, історії та досвід вигадані, щоб показати можливості сайту салону." />
      <section className="container team-section">
        <DemoNotice kind="team" />
        <div className="category-tabs team-tabs" aria-label="Спеціалізації майстринь">{[{ id: 'all', name: 'Уся команда' }, ...categories].map(c => <button key={c.id} className={category === c.id ? 'active' : ''} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>{c.name}</button>)}</div>
        <div className="team-grid">{visible.map(master => <MasterCard key={master.id} master={master} />)}</div>
      </section>
      <CtaBand />
    </>
  )
}
