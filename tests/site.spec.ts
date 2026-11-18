import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const startBooking = async (page: Page) => {
  await page.goto('/booking?service=manicure')
  await page.getByRole('button', { name: 'Продовжити' }).click()
  const slot = page.getByRole('button', { name: /, вільно/ }).first()
  await expect(slot).toBeEnabled()
  const time = (await slot.innerText()).trim()
  await slot.click()
  await page.getByRole('button', { name: 'Продовжити' }).click()
  return time
}

const completeBooking = async (page: Page) => {
  await page.getByRole('textbox', { name: 'Твоє ім’я' }).fill('Тестова Марія')
  await page.getByRole('textbox', { name: 'Номер телефону' }).fill('+380 00 000 00 00')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Підтвердити демозапис' }).click()
  await expect(page.getByRole('heading', { name: 'Демозапис збережено!' })).toBeVisible()
  await expect(page.locator('.confirmation-demo-message')).toContainText('Запис нікуди не надіслано.')
}

test('all routes render, navigation works, and pages fit the viewport', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  for (const [path, heading] of [
    ['/', 'Бути собою — це красиво.'],
    ['/services', 'Турбота, яку ти обираєш.'],
    ['/team', 'Твоя краса — у хороших руках.'],
    ['/about', 'Місце, де красиво. І де добре.'],
    ['/contacts', 'Твоя мрія — ближче, ніж здається.'],
    ['/booking', 'Домовимось про красу?'],
    ['/privacy', 'Твої дані — під контролем.'],
    ['/demo', 'Це демоверсія. Усе прозоро.'],
    ['/missing', 'Ця сторінка ще тільки мрія.'],
  ]) {
    await page.goto(path, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
    expect(await page.locator('html').getAttribute('lang')).toBe('uk')
    await expect(page.locator('.demo-announcement')).toContainText('Демоверсія для портфоліо.')
  }
  await page.goto('/')
  if (testInfo.project.name.startsWith('mobile')) {
    await page.getByRole('button', { name: 'Відкрити меню' }).click()
    await page.getByRole('navigation', { name: 'Мобільна навігація' }).getByRole('link', { name: 'Послуги та ціни' }).click()
    await expect(page.getByRole('button', { name: 'Відкрити меню' })).toHaveAttribute('aria-expanded', 'false')
  } else {
    await page.getByRole('navigation', { name: 'Основна навігація' }).getByRole('link', { name: 'Послуги та ціни' }).click()
  }
  await expect(page).toHaveURL(/\/services$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Турбота')
  expect(errors).toEqual([])
})

test('catalog filters, search, empty state, and service booking links work', async ({ page }) => {
  await page.goto('/services')
  await expect(page.locator('[data-demo-notice="prices"]')).toContainText('не є актуальним прайсом')
  await expect(page.locator('.service-item')).toHaveCount(14)
  await page.getByRole('button', { name: 'Нігті', exact: true }).click()
  await expect(page.locator('.service-item')).toHaveCount(3)
  await expect(page).toHaveURL(/category=nails/)
  await page.getByRole('textbox', { name: 'Пошук послуги' }).fill('педикюр')
  await expect(page.locator('.service-item')).toHaveCount(1)
  await page.getByRole('textbox', { name: 'Пошук послуги' }).fill('абракадабра')
  await expect(page.getByText('Поки нічого не знайшли')).toBeVisible()
  await page.getByRole('button', { name: 'Показати всі послуги' }).click()
  await expect(page.locator('.service-item')).toHaveCount(14)
  await page.getByRole('link', { name: 'Записатися: Архітектура брів', exact: true }).click()
  await expect(page.getByLabel('Твоя послуга')).toHaveValue('brows')
  await expect(page.locator('.summary-total')).toContainText('600 ₴')
})

test('booking validates contacts, persists, prevents overlap, exports calendar, and cancels', async ({ page }, testInfo) => {
  const outgoingSubmissions: string[] = []
  page.on('request', request => { if (['POST', 'PUT', 'PATCH'].includes(request.method())) outgoingSubmissions.push(request.url()) })
  const selectedTime = await startBooking(page)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
  await page.screenshot({ path: `test-results/booking-${testInfo.project.name}.png`, fullPage: true })
  await expect(page.locator('[data-demo-notice="booking"]')).toContainText('дані нікуди не надсилаються')
  await page.getByRole('button', { name: 'Підтвердити демозапис' }).click()
  await expect(page.getByText('Введи ім’я літерами — щонайменше 2 символи.')).toBeVisible()
  await expect(page.getByText('Введи український номер: +380 та ще 9 цифр.')).toBeVisible()
  await page.getByRole('textbox', { name: 'Твоє ім’я' }).fill('Марія')
  await page.getByRole('textbox', { name: 'Номер телефону' }).fill('+48 123456789')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Підтвердити демозапис' }).click()
  await expect(page.getByText('Введи український номер: +380 та ще 9 цифр.')).toBeVisible()
  await completeBooking(page)
  await expect(page.locator('.saved-booking')).toHaveCount(1)
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Завантажити в календар' }).click()
  expect((await downloadPromise).suggestedFilename()).toMatch(/^mriia-demo-M-.*\.ics$/)
  await page.reload()
  await expect(page.locator('.saved-booking')).toHaveCount(1)
  await page.getByRole('button', { name: 'Продовжити' }).click()
  await expect(page.getByRole('button', { name: `${selectedTime}, недоступно`, exact: true })).toBeDisabled()
  await page.locator('.saved-booking').getByRole('button', { name: 'Скасувати', exact: true }).click()
  await page.getByRole('button', { name: 'Так, скасувати', exact: true }).click()
  await expect(page.locator('.saved-booking')).toHaveCount(0)
  await expect(page.getByRole('button', { name: `${selectedTime}, вільно`, exact: true })).toBeEnabled()
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('mriia.demo-bookings.v1') || '[]'))).toEqual([])
  expect(outgoingSubmissions).toEqual([])
})

test('master links preselect specialization and deleting all removes contact data', async ({ page }) => {
  await page.goto('/team')
  await page.getByRole('button', { name: 'Брови та вії', exact: true }).click()
  await expect(page.locator('.master-card')).toHaveCount(1)
  await page.getByRole('link', { name: 'Записатися до майстрині', exact: true }).click()
  await expect(page.getByRole('radio', { name: /Марта/ })).toBeChecked()
  await page.getByLabel('Твоя послуга').selectOption('brows')
  await page.getByRole('button', { name: 'Продовжити' }).click()
  await page.getByRole('button', { name: /, вільно/ }).first().click()
  await page.getByRole('button', { name: 'Продовжити' }).click()
  await completeBooking(page)
  await page.getByRole('button', { name: 'Видалити всі демозаписи' }).click()
  await page.getByRole('button', { name: 'Так, видалити все' }).click()
  await expect(page.locator('.saved-booking')).toHaveCount(0)
  await expect(page.getByText('Поки що тут чистий аркуш.')).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('mriia.demo-bookings.v1'))).toBe('[]')
})

test('clay illustrations render, faq expands, and home has no placeholder links', async ({ page }, testInfo) => {
  await page.goto('/')
  await expect(page.locator('.hero-clay img')).toBeVisible()
  await expect(page.locator('.category-clay img')).toHaveCount(3)
  await expect.poll(() => page.locator('.hero-clay img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  await page.locator('summary').first().click()
  await expect(page.locator('details').first()).toHaveAttribute('open', '')
  expect(await page.locator('a[href="#"], a:not([href])').count()).toBe(0)
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); window.scrollTo({ top: 0, behavior: 'instant' }) })
  await page.screenshot({ path: `test-results/home-${testInfo.project.name}.png`, fullPage: true })
  await page.screenshot({ path: `test-results/home-first-screen-${testInfo.project.name}.png` })
})

test('calendar excludes past dates and long appointments cannot exceed working hours', async ({ page }) => {
  await page.goto('/booking?service=balayage')
  await page.getByRole('button', { name: 'Продовжити' }).click()
  if (await page.getByRole('button', { name: 'Попередній місяць' }).isEnabled()) {
    await page.getByRole('button', { name: 'Попередній місяць' }).click()
  }
  await expect(page.getByRole('button', { name: 'Попередній місяць' })).toBeDisabled()
  const times = await page.locator('.time-grid button').allTextContents()
  expect(times[times.length - 1]).toBe('16:00')
  await expect(page.getByRole('button', { name: '16:00, вільно', exact: true })).toBeEnabled()
  await page.getByRole('button', { name: 'Продовжити' }).click()
  await expect(page.getByText('Обери вільний час для свого візиту.')).toBeVisible()
  await page.getByRole('button', { name: 'Наступний місяць' }).click()
  await expect(page.getByRole('button', { name: 'Попередній місяць' })).toBeEnabled()
})

test('key layouts fit narrow phones, tablets, and small laptops', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith('mobile'), 'Desktop context covers additional responsive widths.')
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ['/', '/services', '/team', '/contacts', '/booking', '/demo']) {
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      const overflow = await page.locator('body *').evaluateAll(elements => elements.filter(element => {
        const bounds = element.getBoundingClientRect()
        return bounds.width > 0 && (bounds.right > window.innerWidth + 1 || bounds.left < -1)
      }).map(element => `${element.tagName}.${element.className}`).slice(0, 12))
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${path} at ${width}px: ${overflow.join(', ')}`).toBeTruthy()
    }
  }
})
