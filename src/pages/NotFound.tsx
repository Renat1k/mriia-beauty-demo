import { ButtonLink, Clay, Eyebrow } from '../components/UI'

export default function NotFound() {
  return <section className="container not-found"><div><Eyebrow>404 · трішки заблукали</Eyebrow><h1>Ця сторінка<br />ще тільки мрія.</h1><p>А твій час для себе — зовсім поруч. Повернімося туди, де все починається.</p><ButtonLink to="/">На головну</ButtonLink></div><Clay kind="flower" /></section>
}
