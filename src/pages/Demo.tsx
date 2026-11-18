import { Banknote, CalendarCheck2, Image, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink, PageHeading } from '../components/UI'

export default function Demo() {
  return (
    <>
      <PageHeading label="портфолійний проєкт · демоверсія" title={<>Це демоверсія.<br />Усе прозоро.</>} description="«Мрія» — вигаданий салон краси. Цей сайт створений для демонстрації дизайну, адаптивної верстки та можливостей онлайн-запису." />
      <section className="container demo-info-grid" aria-label="Умови демонстраційного сайту">
        <article className="demo-info-card bg-lavender"><Banknote size={30} /><h2>Ціни умовні</h2><p>Усі суми у гривнях наведені як приклад. Це не актуальний прайс реального салону й не пропозиція придбати послуги. Через цей сайт послуги не надаються та не продаються.</p></article>
        <article className="demo-info-card bg-peach"><CalendarCheck2 size={30} /><h2>Запис не надсилається</h2><p>Форма лише імітує онлайн-запис. Дані зберігаються у твоєму браузері, не надсилаються салону та не створюють реального бронювання. SMS, листи й повідомлення не відправляються; оплата не стягується.</p></article>
        <article className="demo-info-card bg-ochre"><MapPin size={30} /><h2>Контакти — приклад</h2><p>Адреса, телефон, email і графік демонструють оформлення сторінки контактів. Вони не є контактами діючого салону «мрія». Мапа показує приклад розташування, а не підтверджену адресу бізнесу.</p></article>
        <article className="demo-info-card bg-cream"><Image size={30} /><h2>Історії вигадані</h2><p>Назва салону, біографії майстринь, стаж, відгуки та оцінки створені для портфоліо. Фотографії — ілюстративні стокові зображення, а не фото справжньої команди чи приміщення салону «мрія».</p></article>
      </section>
      <section className="container demo-data-explainer">
        <h2>Як безпечно спробувати форму?</h2>
        <p>Використовуй вигадане ім’я, наприклад «Марія», і тестовий номер <strong>+380 00 000 00 00</strong>. Після підтвердження демозапис залишиться лише в localStorage цього браузера. У блоці «Мої демозаписи» його можна скасувати або видалити всі дані.</p>
        <p>Подія для календаря також містить позначку «ДЕМО» та не підтверджує реального візиту. Деталі збереження даних описані на сторінці <Link to="/privacy">конфіденційності</Link>.</p>
        <div className="demo-page-actions"><ButtonLink to="/booking">Спробувати демозапис</ButtonLink><ButtonLink to="/" variant="secondary">Повернутися на головну</ButtonLink></div>
      </section>
    </>
  )
}
