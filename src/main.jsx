import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { X } from 'lucide-react'
import { SupportCenter } from './index.js'

const questionId = new URLSearchParams(window.location.search).get('questionId')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <header className="sh-demo-header">
      {questionId && <a href="./" aria-label="返回客服首頁"><X aria-hidden="true" /></a>}
      <span>WebApp</span>
    </header>
    <SupportCenter initialQuestionId={questionId} />
  </StrictMode>,
)
