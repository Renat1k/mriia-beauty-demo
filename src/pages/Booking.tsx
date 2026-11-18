import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, CalendarPlus, Check, CheckCheck, ChevronLeft, ChevronRight, Clock3, LockKeyhole, MapPin, RotateCcw, ShieldCheck, Sparkles, Trash2, UserRound } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { categories, contact, formatDuration, formatPrice, masters, services } from '../data'
import { addDays, availableMasters, candidateTimes, dateKey, downloadCalendar, formatDate, normalizePhone, readBookings, todayInKyiv, writeBookings, STORAGE_KEY } from '../booking'
import type { DemoBooking } from '../booking'
import { Eyebrow } from '../components/UI'
import { Flower } from '../components/Flower'
import DemoNotice from '../components/DemoNotice'

function Calendar({ value, onChange }: { value: string; onChange: (date: string) => void }) {
  const today = todayInKyiv()
  const maxDate = addDays(today, 60)
  const [month, setMonth] = useState(() => new Date(`${value.slice(0, 7)}-01T12:00:00`))
  const firstDay = (month.getDay() + 6) % 7
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const monthKey = dateKey(month).slice(0, 7)
  const moveMonth = (direction: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + direction, 1, 12))

  return (
    <div className="booking-calendar">
      <div className="calendar-header"><h3>{new Intl.DateTimeFormat('uk-UA', { month: 'long', year: 'numeric' }).format(month)}</h3><div><button type="button" aria-label="Попередній місяць" disabled={monthKey <= today.slice(0, 7)} onClick={() => moveMonth(-1)}><ChevronLeft size={18} /></button><button type="button" aria-label="Наступний місяць" disabled={monthKey >= maxDate.slice(0, 7)} onClick={() => moveMonth(1)}><ChevronRight size={18} /></button></div></div>
      <div className="calendar-weekdays" aria-hidden="true">{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map(day => <span key={day}>{day}</span>)}</div>
      <div className="calendar-grid">
        {Array.from({ length: firstDay }, (_, i) => <span key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = `${monthKey}-${String(i + 1).padStart(2, '0')}`
          return <button type="button" key={date} className={`${value === date ? 'selected' : ''} ${today === date ? 'is-today' : ''}`} disabled={date < today || date > maxDate} aria-label={formatDate(date, true)} aria-pressed={value === date} onClick={() => onChange(date)}>{i + 1}</button>
        })}
      </div>
      <div className="calendar-legend"><span><i />Обрана дата</span><span>Деморозклад · Київ</span></div>
    </div>
  )
}

export default function Booking() {
  const [params] = useSearchParams()
  const initialMaster = masters.find(master => master.id === params.get('master'))
  const initialService = services.find(service => service.id === params.get('service'))
  const [serviceId, setServiceId] = useState(initialService?.id || '')
  const [masterId, setMasterId] = useState(initialMaster && (!initialService || initialMaster.categories.includes(initialService.category)) ? initialMaster.id : 'any')
  const [category, setCategory] = useState<string>(initialService?.category || initialMaster?.categories[0] || 'all')
  const [step, setStep] = useState(1)
  const [date, setDate] = useState(() => addDays(todayInKyiv(), 1))
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [bookings, setBookings] = useState<DemoBooking[]>([])
  const [storageError, setStorageError] = useState('')
  const [confirmation, setConfirmation] = useState<DemoBooking | null>(null)
  const [cancelId, setCancelId] = useState('')
  const [deletingAll, setDeletingAll] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const submitLock = useRef(false)
  const formRef = useRef<HTMLDivElement>(null)
  const confirmationRef = useRef<HTMLDivElement>(null)
  const service = services.find(s => s.id === serviceId)
  const eligibleMasters = useMemo(() => masters.filter(m => service ? m.categories.includes(service.category) : category === 'all' || m.categories.some(c => c === category)), [service, category])
  const master = masters.find(m => m.id === masterId)
  const times = service ? candidateTimes(service) : []
  const availableTimes = service ? times.filter(t => availableMasters(service, masterId, date, t, bookings).length) : []

  useEffect(() => {
    const load = () => {
      try { setBookings(readBookings()); setStorageError('') }
      catch { setStorageError('Браузер не дозволив прочитати збережені записи. Перевір доступ до сховища сайту.') }
    }
    load()
    const sync = (event: StorageEvent) => { if (event.key === STORAGE_KEY || event.key === null) load() }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  useEffect(() => {
    if (confirmation) { confirmationRef.current?.focus(); confirmationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  }, [confirmation])

  const focusStep = () => requestAnimationFrame(() => {
    formRef.current?.focus({ preventScroll: true })
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })

  const changeService = (value: string) => {
    setServiceId(value)
    setTime('')
    setErrors({})
    const next = services.find(s => s.id === value)
    if (next && masterId !== 'any' && !masters.find(m => m.id === masterId)?.categories.includes(next.category)) setMasterId('any')
  }

  const chooseCategory = (value: string) => {
    setCategory(value)
    if (service && value !== 'all' && service.category !== value) changeService('')
    if (master && value !== 'all' && !master.categories.some(c => c === value)) setMasterId('any')
  }

  const goNext = () => {
    if (step === 1 && !service) { setErrors({ service: 'Обери послугу, щоб продовжити.' }); document.getElementById('booking-service')?.focus(); return }
    if (step === 2 && (!service || !time || !availableMasters(service, masterId, date, time, bookings).length)) { setErrors({ time: 'Обери вільний час для свого візиту.' }); return }
    setErrors({})
    setStep(step + 1)
    focusStep()
  }

  const save = (next: DemoBooking[]) => {
    try { writeBookings(next); setBookings(next); setStorageError(''); return true }
    catch { setStorageError('Не вдалося зберегти зміни. Дозволь локальне сховище в налаштуваннях браузера та спробуй ще раз.'); return false }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (step !== 3) { goNext(); return }
    if (submitLock.current) return
    const nextErrors: Record<string, string> = {}
    if (name.trim().length < 2 || !/^[\p{L}\p{M}\s’'ʼ-]+$/u.test(name.trim())) nextErrors.name = 'Введи ім’я літерами — щонайменше 2 символи.'
    if (!/^\+380\d{9}$/.test(normalizePhone(phone))) nextErrors.phone = 'Введи український номер: +380 та ще 9 цифр.'
    if (!consent) nextErrors.consent = 'Підтвердь, що розумієш умови демозапису.'
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      requestAnimationFrame(() => document.getElementById(`booking-${Object.keys(nextErrors)[0]}`)?.focus())
      return
    }
    if (!service) { setStep(1); return }
    submitLock.current = true
    setSubmitting(true)
    try {
      const latest = readBookings()
      const assigned = availableMasters(service, masterId, date, time, latest)[0]
      if (!assigned) { setBookings(latest); setStep(2); setTime(''); setErrors({ time: 'Цей час уже недоступний. Обери інший вільний час.' }); focusStep(); return }
      const id = `M-${crypto.getRandomValues(new Uint32Array(1))[0].toString(16).padStart(8, '0').toUpperCase()}`
      const booking: DemoBooking = { id, serviceId, masterId: assigned.id, date, time, name: name.trim(), phone: normalizePhone(phone), notes: notes.trim(), createdAt: new Date().toISOString() }
      if (save([...latest, booking])) {
        setConfirmation(booking)
        setErrors({})
        setName('')
        setPhone('')
        setNotes('')
        setConsent(false)
        setAnnouncement('Демозапис збережено лише в браузері. Запис нікуди не надіслано.')
      }
    } catch { setStorageError('Не вдалося зберегти демозапис у браузері. Перевір доступ до локального сховища та спробуй ще раз.') }
    finally { submitLock.current = false; setSubmitting(false) }
  }

  const startAgain = () => {
    setConfirmation(null)
    setStep(1)
    setServiceId('')
    setMasterId('any')
    setCategory('all')
    setTime('')
    setErrors({})
    setDate(addDays(todayInKyiv(), 1))
    focusStep()
  }

  const cancelBooking = (id: string) => {
    try {
      if (save(readBookings().filter(b => b.id !== id))) {
        setCancelId('')
        if (confirmation?.id === id) startAgain()
        setAnnouncement('Демозапис скасовано, дані видалено.')
      }
    } catch { setStorageError('Не вдалося видалити демозапис. Спробуй ще раз.') }
  }

  const clearBookings = () => {
    if (save([])) {
      setDeletingAll(false)
      if (confirmation) startAgain()
      setAnnouncement('Усі демозаписи й контактні дані видалено з цього браузера.')
    }
  }

  const confirmedService = services.find(s => s.id === confirmation?.serviceId)
  const confirmedMaster = masters.find(m => m.id === confirmation?.masterId)

  return (
    <>
      <section className="container booking-heading"><Eyebrow>спробуй демозапис</Eyebrow><h1>Домовимось про красу?</h1><p>Пройди всі кроки демонстраційної форми. Реальний візит не бронюється, а дані нікуди не надсилаються.</p></section>
      <section className="container">
        <DemoNotice kind="booking" />
        {storageError && <div className="form-alert" role="alert">{storageError}</div>}
        <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
        {confirmation && confirmedService && confirmedMaster ? (
          <div className="booking-confirmation" ref={confirmationRef} tabIndex={-1}>
            <div className="confirmation-icon"><Flower /><Check size={29} /></div>
            <span className="eyebrow">демоверсія · {confirmation.id}</span>
            <h2>Демозапис збережено!</h2>
            <p>{confirmation.name}, це лише демонстрація роботи форми.</p>
            <p className="confirmation-demo-message"><strong>Запис нікуди не надіслано.</strong> Реальний візит не заброньовано, салон не отримав заявку. Дані залишилися лише в цьому браузері.</p>
            <div className="confirmation-receipt">
              <div><span>Приклад послуги</span><strong>{confirmedService.name}</strong></div>
              <div><span>Вигадана майстриня</span><strong>{confirmedMaster.name}</strong></div>
              <div><span>Демодата і час</span><strong>{formatDate(confirmation.date)}, {confirmation.time} <small>(Київ)</small></strong></div>
              <div><span>Тривалість</span><strong>{formatDuration(confirmedService.duration)}</strong></div>
              <div><span>Умовна вартість</span><strong>{formatPrice(confirmedService.price)}</strong></div>
            </div>
            <div className="confirmation-actions"><button className="button button-primary" onClick={() => downloadCalendar(confirmation)}><CalendarPlus size={18} />Завантажити в календар</button><button className="button button-secondary" onClick={startAgain}><RotateCcw size={17} />Створити ще демозапис</button></div>
            <span className="confirmation-fine"><CheckCheck size={16} />Подія в календарі також позначена як ДЕМО. Оплата не стягується.</span>
          </div>
        ) : (
          <div className="booking-layout">
            <div className="booking-form-card" ref={formRef} tabIndex={-1}>
              <nav className="booking-steps" aria-label="Кроки запису">
                {['Послуга', 'Дата й час', 'Твої дані'].map((label, index) => <button type="button" key={label} disabled={index + 1 > step} className={step === index + 1 ? 'current' : step > index + 1 ? 'done' : ''} aria-current={step === index + 1 ? 'step' : undefined} onClick={() => { setStep(index + 1); setErrors({}) }}><span>{step > index + 1 ? <Check size={16} /> : `0${index + 1}`}</span><span>{label}</span></button>)}
              </nav>
              <form onSubmit={handleSubmit} noValidate>
                {step === 1 && <div className="booking-step-content">
                  <div className="step-title"><span>01 / почнемо з бажання</span><h2>Чого хочеться сьогодні?</h2><p>Обери приклад послуги та майстриню з нашої вигаданої команди.</p></div>
                  <div className="category-tabs booking-tabs" aria-label="Категорії послуг для запису">{[{ id: 'all', name: 'Усі' }, ...categories].map(c => <button type="button" key={c.id} className={category === c.id ? 'active' : ''} aria-pressed={category === c.id} onClick={() => chooseCategory(c.id)}>{c.name}</button>)}</div>
                  <div className="form-field">
                    <label htmlFor="booking-service">Твоя послуга <span>*</span></label>
                    <select id="booking-service" value={serviceId} aria-invalid={!!errors.service} aria-describedby={errors.service ? 'service-error' : undefined} onChange={e => changeService(e.target.value)}><option value="">Обери, чим себе потішити</option>{categories.filter(c => category === 'all' || category === c.id).map(c => <optgroup key={c.id} label={c.name}>{services.filter(s => s.category === c.id).map(s => <option value={s.id} key={s.id}>{s.name} · {formatPrice(s.price)} (демо)</option>)}</optgroup>)}</select>
                    {errors.service && <p className="field-error" id="service-error" role="alert">{errors.service}</p>}
                  </div>
                  {service && <div className="selected-service-info"><Sparkles size={20} /><div><p>{service.description}</p><span>{formatDuration(service.duration)}<i />{formatPrice(service.price)} · демоціна<i />Без оплати</span></div></div>}
                  <fieldset className="master-picker">
                    <legend>Твоя майстриня <span>обери свою або довір вибір нам</span></legend>
                    <div className="master-options">
                      <label className={`master-option ${masterId === 'any' ? 'selected' : ''}`}><input type="radio" name="master" value="any" checked={masterId === 'any'} onChange={() => { setMasterId('any'); setTime('') }} /><span className="any-master-icon"><Sparkles size={23} /></span><span><strong>Довіряю вам</strong><small>Будь-яка вільна майстриня</small></span><span className="radio-indicator">{masterId === 'any' && <Check size={12} />}</span></label>
                      {eligibleMasters.map(m => <label key={m.id} className={`master-option ${masterId === m.id ? 'selected' : ''}`}><input type="radio" name="master" value={m.id} checked={masterId === m.id} onChange={() => { setMasterId(m.id); setTime('') }} /><img src={m.image} alt="" /><span><strong>{m.name}</strong><small>{m.role}</small></span><span className="radio-indicator">{masterId === m.id && <Check size={12} />}</span></label>)}
                    </div>
                  </fieldset>
                </div>}

                {step === 2 && <div className="booking-step-content">
                  <div className="step-title"><span>02 / знайдемо момент</span><h2>Коли тобі зручно?</h2><p>Обери дату та час у демонстраційному розкладі. Час — за Києвом.</p></div>
                  <Calendar value={date} onChange={value => { setDate(value); setTime(''); setErrors({}) }} />
                  <fieldset className="time-picker">
                    <legend>Вільний демочас на {formatDate(date)}</legend>
                    <div className="time-grid">{times.map(t => { const enabled = availableTimes.includes(t); return <button type="button" key={t} className={time === t ? 'selected' : ''} disabled={!enabled} aria-pressed={time === t} aria-label={`${t}${enabled ? ', вільно' : ', недоступно'}`} onClick={() => { setTime(t); setErrors({}) }}>{t}</button> })}</div>
                    {!availableTimes.length && <p className="no-slots"><Clock3 size={18} />На цю дату вільного демочасу немає. Спробуй інший день.</p>}
                    {errors.time && <p className="field-error" role="alert">{errors.time}</p>}
                    <p className="time-footnote"><span />Вільно<span className="unavailable-dot" />Зайнято або недоступно</p>
                  </fieldset>
                </div>}

                {step === 3 && <div className="booking-step-content">
                  <div className="step-title"><span>03 / завершуємо демозапис</span><h2>Як до тебе звертатись?</h2><p>Вкажи вигадане ім’я та тестовий номер. Дані не надсилаються салону.</p></div>
                  <div className="form-field"><label htmlFor="booking-name">Твоє ім’я <span>*</span></label><input id="booking-name" autoComplete="given-name" placeholder="Наприклад, Марія" maxLength={80} value={name} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })) }} />{errors.name && <p className="field-error" id="name-error" role="alert">{errors.name}</p>}</div>
                  <div className="form-field"><label htmlFor="booking-phone">Номер телефону <span>*</span></label><input id="booking-phone" type="tel" autoComplete="tel" placeholder="+380 00 000 00 00" maxLength={25} value={phone} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'} onChange={e => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: '' })) }} />{errors.phone ? <p className="field-error" id="phone-error" role="alert">{errors.phone}</p> : <p className="field-hint" id="phone-hint">Для тесту: +380 00 000 00 00. Дзвінків та SMS не буде.</p>}</div>
                  <div className="form-field"><label htmlFor="booking-notes">Побажання <span className="optional">необов’язково</span></label><textarea id="booking-notes" rows={3} placeholder="Приклад побажання для демонстрації форми ♡" maxLength={500} value={notes} onChange={e => setNotes(e.target.value)} /><span className="character-count">{notes.length} / 500</span></div>
                  <div className="consent-field"><label><input id="booking-consent" type="checkbox" checked={consent} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'consent-error' : undefined} onChange={e => { setConsent(e.target.checked); setErrors(prev => ({ ...prev, consent: '' })) }} /><span>Розумію, що це демоверсія: запис нікуди не надсилається, реального бронювання немає. Погоджуюсь зі збереженням демоданих лише в цьому браузері.</span></label><Link to="/privacy" target="_blank" rel="noreferrer">Як зберігаються дані <ArrowUpRight size={13} /></Link>{errors.consent && <p className="field-error" id="consent-error" role="alert">{errors.consent}</p>}</div>
                </div>}

                <div className="booking-form-bottom">
                  {step > 1 ? <button type="button" className="back-button" onClick={() => { setStep(step - 1); setErrors({}); focusStep() }}><ArrowLeft size={17} />Назад</button> : <span><LockKeyhole size={15} />Демо · без оплати</span>}
                  <button type="submit" disabled={submitting} className="button button-primary">{step === 3 ? submitting ? 'Зберігаємо…' : 'Підтвердити демозапис' : 'Продовжити'}{step === 3 ? <Check size={18} /> : <ArrowRight size={18} />}</button>
                </div>
              </form>
            </div>

            <aside className="booking-summary">
              <div className="summary-top"><span>твій демонстраційний план</span><Flower /></div><h2>Час для себе.</h2><p>Приклад майбутнього візиту.<br />Не є реальним бронюванням.</p>
              <div className="summary-items">
                <div><Sparkles size={19} /><span><small>Послуга</small><strong>{service?.name || 'Обери щось для себе'}</strong></span></div>
                <div><UserRound size={19} /><span><small>Майстриня</small><strong>{master?.name || 'Довіряю команді'}</strong></span></div>
                <div><CalendarDays size={19} /><span><small>Демодата й час</small><strong>{formatDate(date)}{time ? ` о ${time}` : ' · час ще не обрано'}</strong></span></div>
                {service && <div><Clock3 size={19} /><span><small>Тривалість</small><strong>{formatDuration(service.duration)}</strong></span></div>}
              </div>
              <div className="summary-total"><span>Разом · демо</span><strong>{service ? formatPrice(service.price) : '— ₴'}</strong></div>
              <span className="summary-price-note">Умовна ціна для портфоліо, не реальна пропозиція. Оплата не стягується.</span>
              <div className="summary-location"><MapPin size={16} /><span>Приклад адреси: {contact.address}<br />Київ · демографік 09:00–20:00</span></div>
              <div className="summary-safe"><ShieldCheck size={17} />Твої дані нікуди не надсилаються</div>
            </aside>
          </div>
        )}
      </section>

      <section className="container my-bookings">
        <div className="my-bookings-heading"><div><Eyebrow>тільки в цьому браузері</Eyebrow><h2>Мої демозаписи <span>{bookings.length}</span></h2></div>{bookings.length > 0 && !deletingAll && <button className="delete-all" onClick={() => setDeletingAll(true)}><Trash2 size={16} />Видалити всі демозаписи</button>}</div>
        {deletingAll && <div className="delete-confirmation" role="alert"><span>Видалити всі демозаписи та контактні дані з цього браузера?</span><div><button className="button button-primary" onClick={clearBookings}>Так, видалити все</button><button className="button button-secondary" onClick={() => setDeletingAll(false)}>Залишити</button></div></div>}
        {bookings.length ? <div className="saved-bookings">
          {[...bookings].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).map(booking => {
            const s = services.find(item => item.id === booking.serviceId)!
            const m = masters.find(item => item.id === booking.masterId)!
            return (
              <article className="saved-booking" key={booking.id}>
                <div className="saved-booking-date"><CalendarDays size={21} /><strong>{formatDate(booking.date)}</strong><span>{booking.time} · Київ</span></div>
                <div className="saved-booking-info"><span className="demo-mini">ДЕМО · {booking.id}</span><h3>{s.name}</h3><p>{m.name} · {formatDuration(s.duration)} · {formatPrice(s.price)} (умовно)</p><span className="saved-contact">{booking.name} · {booking.phone}</span></div>
                <div className="saved-booking-actions">{cancelId === booking.id ? <><span>Скасувати демозапис?</span><button className="cancel-yes" onClick={() => cancelBooking(booking.id)}>Так, скасувати</button><button onClick={() => setCancelId('')}>Залишити</button></> : <><button onClick={() => downloadCalendar(booking)}><CalendarPlus size={16} />У календар</button><button onClick={() => setCancelId(booking.id)}><Trash2 size={15} />Скасувати</button></>}</div>
              </article>
            )
          })}
        </div> : <div className="no-bookings"><CalendarDays size={28} /><div><h3>Поки що тут чистий аркуш.</h3><p>Створи свій перший демозапис — він з’явиться тут.</p></div><Flower /></div>}
        <p className="booking-data-note"><LockKeyhole size={14} />Це локальні демодані. Вони не надсилаються салону та не синхронізуються між пристроями. Видалити їх можна будь-коли.</p>
      </section>
    </>
  )
}
