export type Category = 'hair' | 'nails' | 'brows' | 'care' | 'makeup'

export interface Service {
  id: string
  category: Category
  name: string
  description: string
  duration: number
  price: number
  popular?: boolean
}

export const categories: { id: Category; name: string; short: string; color: string; description: string }[] = [
  { id: 'hair', name: 'Волосся', short: 'Твоє нове «вау»', color: 'pink', description: 'Від легкого оновлення до сміливих змін. Знайдемо форму й відтінок, які відчуваються твоїми.' },
  { id: 'nails', name: 'Нігті', short: 'Краса в деталях', color: 'teal', description: 'Бездоганне покриття, дбайливий догляд і той самий відтінок. Або трішки більше кольору.' },
  { id: 'brows', name: 'Брови та вії', short: 'Погляд із характером', color: 'lavender', description: 'Підкреслимо природну красу твого погляду. Делікатно, гармонійно, без зайвого.' },
  { id: 'care', name: 'Догляд за обличчям', short: 'Ніжність до себе', color: 'peach', description: 'Ритуали, що повертають шкірі сяйво, а тобі — відчуття спокою.' },
  { id: 'makeup', name: 'Макіяж', short: 'Твій особливий момент', color: 'ochre', description: 'Від невагомого нюду до вечірнього образу. Ти, тільки з додатковим сяйвом.' },
]

export const services: Service[] = [
  { id: 'haircut', category: 'hair', name: 'Стрижка та укладання', description: 'Консультація, миття, індивідуальна форма та легке укладання. Для будь-якої довжини.', duration: 60, price: 950, popular: true },
  { id: 'color', category: 'hair', name: 'Фарбування в один тон', description: 'М’яке фарбування професійними засобами. Матеріали, миття та укладання включено.', duration: 120, price: 2400 },
  { id: 'balayage', category: 'hair', name: 'Балаяж / airtouch', description: 'Багатовимірний колір із природним переходом. Матеріали та тонування включено.', duration: 240, price: 4800 },
  { id: 'hair-care', category: 'hair', name: 'Відновлення волосся', description: 'Глибокий догляд із підбором формули для твого типу волосся.', duration: 60, price: 1200 },
  { id: 'manicure', category: 'nails', name: 'Манікюр із покриттям', description: 'Дбайливий комбінований манікюр, вирівнювання та гель-лак в один тон. Зняття включено.', duration: 90, price: 850, popular: true },
  { id: 'pedicure', category: 'nails', name: 'Педикюр із покриттям', description: 'Апаратний педикюр, догляд за стопами та стійке покриття. Зняття включено.', duration: 90, price: 1100 },
  { id: 'natural-nails', category: 'nails', name: 'Манікюр без покриття', description: 'Акуратна форма, обробка кутикули та живильний догляд.', duration: 45, price: 550 },
  { id: 'brows', category: 'brows', name: 'Архітектура брів', description: 'Підбір форми, корекція та фарбування. Природний результат, що пасує саме тобі.', duration: 45, price: 600, popular: true },
  { id: 'lamination', category: 'brows', name: 'Ламінування брів', description: 'Довготривале укладання з корекцією, фарбуванням і відновлювальним доглядом.', duration: 60, price: 900 },
  { id: 'lashes', category: 'brows', name: 'Ламінування вій', description: 'Виразний вигин, фарбування та кератиновий догляд за натуральними віями.', duration: 75, price: 1100 },
  { id: 'facial', category: 'care', name: 'Ритуал сяйва', description: 'Делікатне очищення, зволожувальна сироватка, масаж і маска за типом шкіри.', duration: 75, price: 1500 },
  { id: 'massage', category: 'care', name: 'Скульптурний масаж обличчя', description: 'М’яка ручна техніка для розслаблення, тонусу та свіжого вигляду.', duration: 45, price: 900 },
  { id: 'day-makeup', category: 'makeup', name: 'Денний макіяж', description: 'Свіжа шкіра, делікатні акценти й легкість. Для побачення, зйомки чи просто для себе.', duration: 60, price: 1200 },
  { id: 'evening-makeup', category: 'makeup', name: 'Вечірній макіяж', description: 'Виразний образ, стійкі текстури та увага до кожної деталі. Пучкові вії включено.', duration: 90, price: 1800 },
]

export interface Master {
  id: string
  name: string
  role: string
  categories: Category[]
  experience: string
  description: string
  image: string
  color: string
  motto: string
}

export const masters: Master[] = [
  { id: 'olena', name: 'Олена', role: 'Стилістка та колористка', categories: ['hair'], experience: '8 років досвіду', description: 'Любить живі текстури, природні відтінки та стрижки, які легко вкладати вдома. Завжди починає з розмови про тебе.', image: '/images/olena.jpg', color: 'peach', motto: '«Найкращий колір — той, у якому ти сяєш»' },
  { id: 'sofia', name: 'Софія', role: 'Майстриня манікюру', categories: ['nails'], experience: '6 років досвіду', description: 'Знає все про ідеальний нюд і тонкі лінії. Працює делікатно, а стерильність інструментів — її незмінний ритуал.', image: '/images/sofia.jpg', color: 'lavender', motto: '«Маленькі деталі створюють великий настрій»' },
  { id: 'marta', name: 'Марта', role: 'Бровістка та візажистка', categories: ['brows', 'makeup'], experience: '5 років досвіду', description: 'За природну красу, пухнасті брови й макіяж, що підкреслює індивідуальність. Допоможе знайти твої акценти.', image: '/images/marta.jpg', color: 'mint', motto: '«Твоя унікальність — найкращий тренд»' },
  { id: 'daryna', name: 'Дарина', role: 'Естетистка з догляду за обличчям', categories: ['care'], experience: '7 років досвіду', description: 'Поєднує професійний догляд із глибоким розслабленням. Уважно підбирає кожен засіб до потреб твоєї шкіри.', image: '/images/daryna.jpg', color: 'ochre', motto: '«Турбота починається з ніжності»' },
]

export const contact = {
  phone: '+380 44 000 00 00',
  email: 'hello@mriia.example',
  address: 'вул. Велика Васильківська, 30',
  city: 'Київ, Україна',
  map: 'https://www.google.com/maps/search/?api=1&query=Велика+Васильківська+30+Київ',
}

export const formatPrice = (price: number) => `${new Intl.NumberFormat('uk-UA').format(price)} ₴`
export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return hours ? `${hours} год${rest ? ` ${rest} хв` : ''}` : `${minutes} хв`
}

export const reviews = [
  { name: 'Анастасія К.', service: 'Стрижка та укладання', text: 'Нарешті знайшла місце, де мене чують. Олена зрозуміла, чого я хочу, буквально з півслова. І кава тут окрема любов!', initial: 'А', color: 'peach' },
  { name: 'Юлія М.', service: 'Манікюр із покриттям', text: 'Тут усе про турботу: від зустрічі до останньої краплі олійки. Манікюр ідеальний, а атмосфера така, що не хочеться йти.', initial: 'Ю', color: 'lavender' },
  { name: 'Катерина С.', service: 'Архітектура брів', text: 'Марта — чарівниця! Брови виглядають дуже природно, саме як я мріяла. Уже чекаю на свій наступний візит.', initial: 'К', color: 'mint' },
]
