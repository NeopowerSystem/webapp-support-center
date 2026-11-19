import { useEffect, useId, useRef, useState } from 'react'
import {
  ArrowLeft, CheckCircle2, ChevronRight, Flame, Info, Layers, Mail, MessageCircleQuestion,
} from 'lucide-react'
import { actionIds, categories, popularQuestions, questions } from '../../data/catalog'
import ContactReport from '../../components/SupportCenter/ContactReport'

export default function SupportCenter({
  initialQuestionId,
  supportEmail = 'neopowertechinfo@gmail.com',
  supportPhone,
  actions = {},
  context,
  loadReportContext,
  onReturnToSource,
  openEmailDraft,
  onSubmitReport,
}) {
  const [route, setRoute] = useState(() => questions.some(({ id }) => id === initialQuestionId)
    ? { name: 'answer', questionId: initialQuestionId }
    : { name: 'home' })
  const titleRef = useRef(null)
  const lastRoute = useRef(route)
  const titleId = useId()
  const category = categories.find(({ id }) => id === route.categoryId)
  const question = questions.find(({ id }) => id === route.questionId)
  const stopQuestion = question?.id === 'charge.stop_failed'

  useEffect(() => {
    if (lastRoute.current === route) return
    lastRoute.current = route
    const target = route.focusId
      ? document.getElementById(titleId + route.focusId) ?? titleRef.current
      : titleRef.current
    target?.focus()
    if (!route.focusId) target?.scrollIntoView({ block: 'start' })
  }, [route, titleId])

  function openQuestion(questionId, from = route, focusId = questionId) {
    setRoute({ name: 'answer', questionId, from, returnFocusId: focusId })
  }

  function goBack() {
    setRoute({ ...(route.from ?? { name: 'home' }), focusId: route.returnFocusId })
  }

  function openContact(focusId) {
    setRoute({ name: 'contact', questionId: question?.id, from: route, returnFocusId: focusId })
  }

  return (
    <section className="sh-support" aria-labelledby={titleId}>
      <div className="sh-shell">
        {route.name === 'home' ? (
          <>
            <div className="sh-intro">
              <h1 id={titleId} ref={titleRef} tabIndex={-1}>
                <MessageCircleQuestion aria-hidden="true" />智能客服中心
              </h1>
              <p>您好，請選擇您遇到的問題，我們會提供處理方式。<br className="sh-intro-break" />
                若仍無法解決，可整理問題資料並透過 Email 聯絡我們。</p>
              <div className="sh-notice"><Info aria-hidden="true" />此頁提供自助指引，非即時真人對話。</div>
            </div>
            <div className="sh-home-grid">
              <section>
                <h2><Flame aria-hidden="true" />熱門問題</h2>
                <ul className="sh-list">
                  {popularQuestions.map(({ id, title, Icon }) => (
                    <li key={id}>
                      <button id={titleId + id} type="button" className="sh-row"
                        onClick={() => openQuestion(id)}>
                        <Icon aria-hidden="true" /><span>{title}</span><ChevronRight aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h2><Layers aria-hidden="true" />問題分類</h2>
                <ul className="sh-categories">
                  {categories.map(({ id, title, summary, Icon }) => (
                    <li key={id}>
                      <button id={titleId + id} type="button" className="sh-card"
                        onClick={() => setRoute({
                          name: 'category', categoryId: id, from: route, returnFocusId: id,
                        })}>
                        <Icon aria-hidden="true" />
                        <span><strong>{title}</strong><small>{summary}</small></span>
                        <ChevronRight aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
            <button id={titleId + 'contact'} type="button" className="sh-card sh-contact"
              onClick={() => openContact('contact')}>
              <Mail aria-hidden="true" />
              <span><strong>找不到您的問題？聯絡客服</strong>
                <small>填寫問題資料，我們會協助您進一步確認。</small></span>
              <ChevronRight aria-hidden="true" />
            </button>
          </>
        ) : (
          <div className="sh-detail">
            <button type="button" className="sh-back" onClick={goBack}>
              <ArrowLeft aria-hidden="true" />
              {route.name === 'contact' ? '返回上一頁'
                : route.from?.name === 'category' ? '返回問題列表'
                : route.from?.name === 'answer' ? '返回問題' : '返回客服中心'}
            </button>
            {route.name === 'category' && (
              <>
                <h1 id={titleId} ref={titleRef} tabIndex={-1}>{category.title}</h1>
                <ul className="sh-list">
                  {questions.filter(({ categoryId }) => categoryId === category.id)
                    .map(({ id, title }) => (
                      <li key={id}><button id={titleId + id} type="button" className="sh-row"
                        onClick={() => openQuestion(id)}>
                        <span>{title}</span><ChevronRight aria-hidden="true" />
                      </button></li>
                    ))}
                </ul>
              </>
            )}
            {route.name === 'answer' && (
              <>
                <h1 id={titleId} ref={titleRef} tabIndex={-1}>{question.title}</h1>
                <div className="sh-panel sh-answer">
                  {question.answer.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                  {stopQuestion && (
                    <button id={titleId + 'related'} className="sh-back" type="button"
                      onClick={() => openQuestion('charge.connector_locked', route, 'related')}>
                      充電結束後無法拔下充電槍
                    </button>
                  )}
                </div>
                <div className="sh-actions">
                  {question.actions.filter((label) => actionIds[label] && actions[actionIds[label]]).map((label) => (
                    <button key={label} className="sh-button" type="button"
                      onClick={() => actions[actionIds[label]]({ questionId: question.id, context })}>
                      {label}
                    </button>
                  ))}
                  <button id={titleId + 'contact'} className="sh-button" type="button"
                    onClick={() => openContact('contact')}>
                    {question.id === 'other.general' ? '整理問題資料' : '聯絡客服'}
                  </button>
                </div>
                <div className="sh-actions sh-resolution">
                  <button className="sh-button sh-primary" type="button"
                    onClick={() => setRoute({ name: 'resolved' })}>已解決</button>
                  <button id={titleId + 'unresolved'} className="sh-button" type="button"
                    onClick={() => openContact('unresolved')}>仍未解決</button>
                </div>
              </>
            )}
            {route.name === 'resolved' && (
              <div className="sh-panel sh-resolved">
                <CheckCircle2 aria-hidden="true" />
                <h1 id={titleId} ref={titleRef} tabIndex={-1}>已解決</h1>
                <p>很高興能協助您，祝您使用順利。</p>
                <div className="sh-actions">
                  <button type="button" className="sh-button sh-primary"
                    onClick={() => setRoute({ name: 'home' })}>返回客服中心</button>
                  {onReturnToSource && <button type="button" className="sh-button"
                    onClick={onReturnToSource}>返回來源頁</button>}
                </div>
              </div>
            )}
            {route.name === 'contact' && (
              <ContactReport question={question} titleId={titleId} titleRef={titleRef}
                contact={{ email: supportEmail, phone: supportPhone }}
                reportContext={{ context, loadReportContext }}
                openEmailDraft={openEmailDraft}
                onSubmitReport={onSubmitReport} />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
