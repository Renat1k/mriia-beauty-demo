import ReactDOM from 'react-dom/client'
import ClayScene from '../src/components/ClayScene'
import '../src/styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <div style={{ display: 'grid', gap: 32, padding: 32 }}>
    {(['hero', 'hair', 'nails', 'brows', 'flower'] as const).map(kind => <div key={kind} data-kind={kind} style={{ width: kind === 'hero' ? 750 : 600, height: kind === 'hero' ? 600 : kind === 'flower' ? 480 : 330 }}><ClayScene kind={kind} /></div>)}
  </div>,
)
