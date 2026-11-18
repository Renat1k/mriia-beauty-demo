import { ArrowUpRight, Info } from 'lucide-react'
import { Link } from 'react-router-dom'

const notices = {
  prices: {
    title: 'Демоверсія: ціни наведені для прикладу',
    text: 'Це портфолійний проєкт вигаданого салону. Вказані суми у гривнях є умовними й не є актуальним прайсом або пропозицією придбати послуги.',
  },
  booking: {
    title: 'Демозапис — дані нікуди не надсилаються',
    text: 'Форма працює лише для демонстрації. Запис збережеться в цьому браузері, не передається салону й не бронює реальний візит. Оплата не стягується. Використовуй вигадане ім’я та тестовий номер.',
  },
  contacts: {
    title: 'Демонстраційні контакти',
    text: 'Салон «мрія» вигаданий. Адреса, графік, телефон та email показані як приклад оформлення, а не як контакти діючого салону.',
  },
  team: {
    title: 'Знайомство з вигаданою командою',
    text: 'Імена, досвід і біографії майстринь вигадані для портфоліо. Портрети — ілюстративні стокові фотографії.',
  },
}

export default function DemoNotice({ kind }: { kind: keyof typeof notices }) {
  const { title, text } = notices[kind]
  return (
    <aside className="demo-banner demo-notice" aria-label={title} data-demo-notice={kind}>
      <Info size={21} aria-hidden="true" />
      <div><strong>{title}</strong><p>{text}</p></div>
      <Link to="/demo" className="demo-notice-link">Про демоверсію <ArrowUpRight size={14} aria-hidden="true" /></Link>
    </aside>
  )
}
