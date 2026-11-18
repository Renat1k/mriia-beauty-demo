import { ArrowUpRight, Coffee, Heart, ShieldCheck, Sparkles, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories, masters, reviews, services, formatPrice } from '../data'
import { Flower } from '../components/Flower'
import { ButtonLink, CheckItem, Clay, CtaBand, Eyebrow, Faq, MasterCard, SectionHeading } from '../components/UI'

export default function Home() {
  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <Eyebrow>б’юті-простір у Києві</Eyebrow>
          <h1>Бути собою —<br />це <span className="hero-pretty">красиво.
            <svg viewBox="0 0 335 17" preserveAspectRatio="none" aria-hidden="true"><path d="M3 11C80 1 188 1 331 9M18 15C115 7 225 7 309 12" /></svg>
          </span></h1>
          <p className="hero-description">Місце, де дбають не тільки про твою красу,<br className="wide-only" /> а й про те, як ти почуваєшся. Видихни.<br className="wide-only" /> Решту довір нам.</p>
          <div className="hero-buttons">
            <ButtonLink to="/booking">Мій час для себе</ButtonLink>
            <Link className="text-link" to="/services">Обрати послугу <ArrowUpRight size={18} /></Link>
          </div>
          <div className="hero-social-proof">
            <div className="avatar-stack">{masters.slice(0, 3).map(master => <img key={master.id} src={master.image} alt="" />)}</div>
            <div>
              <div className="hero-rating"><span className="stars" aria-label="5 зірок">★★★★★</span><strong>4.9<span>/5</span></strong></div>
              <p>Любов із першого візиту<span className="demo-caption"> · демооцінка</span></p>
            </div>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-art-dots" aria-hidden="true"><span /><span /><span /></div>
          <span className="hero-art-caption">трохи любові до себе — щодня</span>
          <Clay className="hero-clay" />
          <div className="floating-note"><span className="note-icon"><Heart size={18} /></span><div><strong>Тут про тебе.</strong><span>І трішки про магію.</span></div><Sparkles size={19} /></div>
          <span className="hero-art-bottom">твоя маленька щаслива звичка <span>✳</span></span>
          <span className="hero-art-corner" aria-hidden="true">✧</span>
        </div>
      </section>

      <div className="values-strip">
        <div className="container values-inner">
          <span><ShieldCheck />Дбайливо та безпечно</span><Flower />
          <span><Sparkles />Підкреслюємо твоє</span><Flower />
          <span><Coffee />Кава, затишок і турбота</span><Flower />
          <span><Heart />Краса без правил</span>
        </div>
      </div>

      <section className="section container home-services">
        <SectionHeading label="меню твоєї краси" title={<>Трішки турботи.<br />Багато впевненості.</>} description="Що обереш для себе сьогодні?" link="/services" linkLabel="Усі послуги та ціни" />
        <div className="service-category-grid">
          {categories.slice(0, 3).map((category, index) => {
            const minPrice = Math.min(...services.filter(s => s.category === category.id).map(s => s.price))
            return (
              <Link to={`/services?category=${category.id}`} className={`category-card bg-${category.color}`} key={category.id}>
                <div className="category-top"><span className="category-number">0{index + 1} / {category.short}</span><span className="category-arrow"><ArrowUpRight size={23} /></span></div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <Clay kind={category.id as 'hair' | 'nails' | 'brows'} className="category-clay" />
                <div className="category-bottom"><span>від {formatPrice(minPrice)}</span><span>Обрати своє <ArrowUpRight size={16} /></span></div>
              </Link>
            )
          })}
        </div>
        <div className="services-extra"><span>А ще — ніжний догляд за обличчям та макіяж для особливих моментів.</span><Link to="/services" aria-label="Переглянути догляд за обличчям та макіяж"><ArrowUpRight size={22} /></Link></div>
        <p className="demo-inline">Демоціни наведені для прикладу й не є реальним прайсом. <Link to="/demo">Про демоверсію <ArrowUpRight size={13} /></Link></p>
      </section>

      <section className="section container about-preview">
        <div className="about-photo">
          <img src="/images/studio.jpg" alt="Інтер’єр б’юті-простору з великими дзеркалами, рослинами та зручними кріслами" loading="lazy" />
          <span className="photo-tag"><Flower /> місце сили. і краси.</span>
          <span className="photo-corner">Твоя мрія — тут.</span>
        </div>
        <div className="about-preview-copy">
          <Eyebrow>більше, ніж салон</Eyebrow>
          <h2>Можна просто<br />бути <span className="serene-word">собою.<Flower /></span></h2>
          <p>Без поспіху. Без «тобі треба». Без стандартів, у які потрібно вписуватися.</p>
          <p>Ми створили мрію як місце зустрічі з собою. Де улюблена музика, тепла кава й майстрині, які справді слухають. А краса — це те, як ти відчуваєш себе після.</p>
          <div className="about-checks"><CheckItem>Уважність до твоїх побажань</CheckItem><CheckItem>Професійні засоби та стерильність</CheckItem><CheckItem>Затишок у кожній деталі</CheckItem></div>
          <ButtonLink to="/about" variant="secondary">Трішки більше про нас</ButtonLink>
        </div>
      </section>

      <section className="section container">
        <SectionHeading label="люди, які дбають" title="У хороших руках." description="Майстрині, з якими легко бути на одній хвилі." link="/team" linkLabel="Знайомся з командою" />
        <div className="home-masters">{masters.slice(0, 3).map(master => <MasterCard key={master.id} master={master} compact />)}</div>
      </section>

      <section className="section reviews-section">
        <div className="container">
          <div className="reviews-heading">
            <SectionHeading label="післясмак турботи" title="І це взаємно ♡" description="Маленькі історії великої любові до себе." />
            <div className="review-score"><Star fill="currentColor" size={28} /><strong>4.9</strong><span>із 5 · демовідгуки</span></div>
          </div>
          <div className="reviews-grid">
            {reviews.map(review => (
              <article className="review-card" key={review.name}>
                <span className="stars" aria-label="5 зірок">★★★★★</span>
                <blockquote>«{review.text}»</blockquote>
                <div className="review-author"><span className={`review-avatar bg-${review.color}`}>{review.initial}</span><div><h3>{review.name}</h3><p>{review.service}</p></div><Heart size={20} /></div>
              </article>
            ))}
          </div>
          <p className="reviews-disclaimer">Відгуки та оцінки вигадані для демонстрації концепції салону.</p>
        </div>
      </section>
      <Faq />
      <CtaBand />
    </>
  )
}
