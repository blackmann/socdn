import './index.css'
import './extras.css'
import { render } from 'preact'
import { App } from './app.tsx'
import { HashRouter } from 'react-router-dom'

render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('app')!
)
