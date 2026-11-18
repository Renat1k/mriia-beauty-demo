import { Coffee, Heart, Leaf, ShieldCheck } from 'lucide-react'
import { Flower } from '../components/Flower'
import { ButtonLink, CtaBand, Eyebrow, PageHeading } from '../components/UI'

const values = [
  { title: 'Ти — на першому місці', description: 'Слухаємо, запитуємо, радимо. Знаходимо рішення разом із тобою, а не замість тебе.', color: 'pink', Icon: Heart },
  { title: 'Турбота в кожній деталі', description: 'Стерильні інструменти, одноразові матеріали та професійні засоби. Бо спокій — теж частина краси.', color: 'teal', Icon: ShieldCheck },
  { title: 'Природно бути собою', description: 'Не змінюємо тебе під тренди. Допомагаємо побачити та полюбити те, що вже прекрасне.', color: 'lavender', Icon: Leaf },
]

export default function About() {
  return (
    <>
      <PageHeading label="історія нашої мрії" title={<>Місце, де красиво.<br />І де добре.</>} description="Мрія почалася з простого бажання: створити простір, із якого виходиш не лише красивою, а й щасливою." />
      <section className="container about-main-image">
        <img src="/images/studio.jpg" alt="Інтер’єр салону з рослинами, круглими дзеркалами та зручними кріслами" />
        <div className="about-image-label"><Flower /><span>З любов’ю до краси.<br />З повагою до тебе.</span></div>
      </section>
      <section className="section container story-section">
        <div><Eyebrow>наша філософія</Eyebrow><h2>Краса починається<br />з відчуття.</h2><Flower className="story-flower" /></div>
        <div className="story-text">
          <p className="lead-text">Пам’ятаєш відчуття, коли нарешті нікуди не потрібно поспішати? Саме його ми хотіли зберегти в мрії.</p>
          <p>Ми — маленька команда людей, закоханих у свою справу. Нам близькі живі розмови, природна краса та прості радощі: ароматна кава, улюблена пісня, відтінок лаку, що раптом став твоїм.</p>
          <p>У нашій концепції немає «недоліків», які треба виправляти. Є твоя індивідуальність, яку хочеться підкреслити. Тому кожен візит починається не з процедури, а зі знайомства з тобою.</p>
          <ButtonLink to="/team" variant="secondary">Знайомся з майстринями</ButtonLink>
        </div>
      </section>
      <section className="container values-section">
        <div className="values-heading"><Eyebrow>те, у що ми віримо</Eyebrow><h2>Просто. Щиро. З турботою.</h2></div>
        <div className="values-grid">{values.map(({ title, description, color, Icon }) => <article className={`value-card bg-${color}`} key={title}><Icon size={34} strokeWidth={1.4} /><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>
      <section className="section container little-things">
        <div className="little-things-icon"><Coffee size={60} strokeWidth={1.2} /><Flower /></div>
        <div><Eyebrow>приємні дрібниці</Eyebrow><h2>Кава — з нас.<br />Гарний настрій — спільний.</h2><p>Капучино на рослинному, ароматний чай чи просто склянка води з лимоном? Влаштовуйся зручніше. Ми вже подбали про все.</p></div>
      </section>
      <CtaBand />
    </>
  )
}
