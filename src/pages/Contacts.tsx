import { ArrowUpRight, Clock3, Mail, MapPin, Phone, TrainFront } from 'lucide-react'
import { contact } from '../data'
import { ButtonLink, Eyebrow, PageHeading } from '../components/UI'
import { Flower } from '../components/Flower'
import DemoNotice from '../components/DemoNotice'

export default function Contacts() {
  return (
    <>
      <PageHeading label="давай зустрінемось" title={<>Твоя мрія —<br />ближче, ніж здається.</>} description="Приклад сторінки контактів для вигаданого салону в Києві. Так міг би виглядати простір, де чекають на тебе." />
      <div className="container"><DemoNotice kind="contacts" /></div>
      <section className="container contacts-grid">
        <div className="contact-details">
          <div className="contact-block"><MapPin /><div><span>приклад адреси</span><h2>{contact.address}</h2><p>{contact.city} · демонстраційне розташування</p><a className="text-link" href={contact.map} target="_blank" rel="noreferrer">Переглянути приклад на мапі <ArrowUpRight size={17} /></a></div></div>
          <div className="contact-block"><Clock3 /><div><span>демонстраційний графік</span><h2>Щодня, 09:00–20:00</h2><p>Приклад робочих годин для форми запису</p></div></div>
          <div className="contact-block"><Phone /><div><span>приклад телефону</span><span className="contact-big-link contact-example-value">{contact.phone}</span><p>Демонстраційний номер, не для реальних дзвінків</p></div></div>
          <div className="contact-block"><Mail /><div><span>приклад електронної адреси</span><span className="contact-big-link contact-example-value">{contact.email}</span><p>Не є адресою для реального листування</p></div></div>
          <div className="contact-booking"><Eyebrow>перевір, як це працює</Eyebrow><p>Спробуй обрати послугу, дату й час. Запис залишиться лише у твоєму браузері.</p><ButtonLink to="/booking">Спробувати демозапис</ButtonLink></div>
        </div>
        <div className="contact-map">
          <iframe title="Приклад розташування на мапі: Київ, Велика Васильківська, 30" src="https://www.openstreetmap.org/export/embed.html?bbox=30.5090%2C50.4324%2C30.5240%2C50.4416&layer=mapnik&marker=50.4370%2C30.5165" loading="lazy" referrerPolicy="no-referrer" />
          <div className="map-label"><Flower /><div><strong>мрія.</strong><span>ДЕМО · приклад розташування</span></div><a href={contact.map} target="_blank" rel="noreferrer" aria-label="Переглянути демонстраційну адресу в Google Maps"><ArrowUpRight /></a></div>
          <div className="map-bottom"><TrainFront size={20} /><span>Ілюстративне розташування біля метро<br /><strong>«Площа Українських Героїв»</strong></span></div>
        </div>
      </section>
      <section className="container arrival-note"><div><Eyebrow>демонстрація концепції</Eyebrow><h2>Так могла б виглядати мрія.</h2></div><p>Адреса на мапі наведена як приклад. Вона не підтверджує, що там працює салон «мрія». Проєкт демонструє дизайн і функціональність сайту для портфоліо.</p><Flower /></section>
    </>
  )
}
