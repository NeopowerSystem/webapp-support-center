import { useEffect, useState } from 'react'
import { categories, questions } from '../../data/catalog'

const optionalFields = [
  { name: 'phone', label: '聯絡手機' },
  { name: 'occurredAt', label: '發生時間（台灣時間）' },
  { name: 'stationName', label: '場站名稱' },
  { name: 'connector', label: '槍號' },
  { name: 'sessionId', label: 'Session 編號' },
  { name: 'cdrId', label: '交易編號' },
  { name: 'paymentDetails', label: '顯示金額／付款時間' },
  { name: 'errorDetails', label: '錯誤碼／reqId' },
  { name: 'attemptedSteps', label: '已嘗試的處理方式' },
]

export default function ContactReport({
  question, titleId, titleRef, contact, reportContext, openEmailDraft, onSubmitReport,
}) {
  const { email: supportEmail, phone: supportPhone } = contact
  const { context, loadReportContext } = reportContext
  const [form, setForm] = useState({
    categoryId: question?.categoryId ?? 'other',
    questionId: question?.id ?? 'other.general',
    description: '',
    errorDetails: [context?.errorCode, context?.reqId].filter(Boolean).join('／'),
  })
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [contextStatus, setContextStatus] = useState('')
  const [submission, setSubmission] = useState('idle')

  useEffect(() => {
    if (!loadReportContext) return
    let isCurrent = true

    async function fetchReportContext() {
      try {
        const details = await loadReportContext({ questionId: question?.id, context })
        if (!isCurrent || !details) return
        setForm((current) => {
          const next = { ...current }
          for (const { name } of optionalFields) {
            if (name !== 'phone' && current[name] == null && typeof details[name] === 'string') {
              next[name] = details[name]
            }
          }
          return next
        })
      } catch {
        if (isCurrent) setContextStatus('暫時無法取得最新狀態，您仍可手動填寫。')
      }
    }

    fetchReportContext()
    return () => { isCurrent = false }
  }, [context, loadReportContext, question?.id])

  useEffect(() => {
    titleRef.current?.focus()
    titleRef.current?.scrollIntoView({ block: 'start' })
  }, [preview, titleRef])

  function updateForm(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === 'categoryId' ? { questionId: '' } : {}),
    }))
    setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const category = categories.find(({ id }) => id === form.categoryId)
    const selectedQuestion = questions.find(({ id }) => id === form.questionId)
    if (!category || selectedQuestion?.categoryId !== category.id || !form.description.trim()) {
      setError('請選擇問題類別、問題選項，並填寫問題說明。')
      return
    }
    const rows = [
      `問題類別：${category.title}`,
      `問題選項：${selectedQuestion.title}`,
      `問題說明：${form.description.trim()}`,
      ...optionalFields.map(({ name, label }) => `${label}：${form[name]?.trim() || '未提供'}`),
    ]
    const details = Object.fromEntries(optionalFields.flatMap(({ name }) => {
      const value = form[name]?.trim()
      return value ? [[name, value]] : []
    }))
    setPreview({
      report: {
        ...details,
        categoryId: category.id,
        questionId: selectedQuestion.id,
        description: form.description.trim(),
      },
      subject: `[EMSP 問題回報] ${category.title}－${selectedQuestion.title}`,
      body: ['客服您好：', '', ...rows, '', '如需截圖，我會自行附在此封郵件中。'].join('\n'),
    })
    setSubmission('idle')
    setStatus('')
  }

  async function handleSubmitReport() {
    if (submission === 'pending' || submission === 'sent') return
    setSubmission('pending')
    try {
      await onSubmitReport(preview.report)
      setSubmission('sent')
    } catch {
      setSubmission('failed')
    }
  }

  async function copyText(value, label) {
    try {
      await navigator.clipboard.writeText(value)
      setStatus(`已複製${label}。`)
    } catch {
      setStatus('複製失敗，請手動選取文字。')
    }
  }

  async function handleOpenEmail() {
    try {
      const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(preview.subject)}`
        + `&body=${encodeURIComponent(preview.body)}`
      if (openEmailDraft) {
        const { subject, body } = preview
        const opened = await openEmailDraft({ subject, body, to: supportEmail, mailto })
        if (opened === false) throw new Error('Mail client unavailable')
      } else {
        window.location.href = mailto
      }
      setStatus('已嘗試開啟郵件程式，請確認內容並自行寄出。')
    } catch {
      setStatus('無法開啟郵件程式，請複製客服信箱與問題內容後自行寄出。')
    }
  }

  return (
    <>
      <h1 id={titleId} ref={titleRef} tabIndex={-1}>
        {preview ? (onSubmitReport ? '回報預覽' : '郵件預覽') : '聯絡客服'}
      </h1>
      {preview ? (
        <div className="sh-panel">
          <dl className="sh-email-meta">
            <dt>收件人</dt><dd>{supportEmail}</dd>
            <dt>主旨</dt><dd>{preview.subject}</dd>
          </dl>
          <pre className="sh-email-body">{preview.body}</pre>
          <div className="sh-actions">
            {onSubmitReport && (
              <button className="sh-button sh-primary" type="button" onClick={handleSubmitReport}
                disabled={submission === 'pending' || submission === 'sent'}>
                {submission === 'pending' ? '送出中…' : '送出回報'}
              </button>
            )}
            <button className={onSubmitReport ? 'sh-button' : 'sh-button sh-primary'}
              type="button" onClick={handleOpenEmail}>
              開啟郵件程式
            </button>
            <button className="sh-button" type="button" onClick={() => copyText(
              supportEmail, '客服信箱',
            )}>複製客服信箱</button>
            <button className="sh-button" type="button" onClick={() => copyText(
              `${preview.subject}\n\n${preview.body}`, '問題內容',
            )}>複製問題內容</button>
            <button className="sh-button" type="button" disabled={submission === 'pending'}
              onClick={() => setPreview(null)}>
              返回修改
            </button>
          </div>
          {submission === 'sent' && <p className="sh-status" role="status">問題回報已送出。</p>}
          {submission === 'failed' && (
            <p className="sh-status sh-error" role="alert">送出失敗，請重試或使用 Email 回報。</p>
          )}
          <p className="sh-status" role="status">{status}</p>
        </div>
      ) : (
        <form className="sh-panel sh-form" onSubmit={handleSubmit}>
          <p>請確認以下資訊，並補充您遇到的問題。我們會協助整理郵件內容。</p>
          {contextStatus && <p role="status">{contextStatus}</p>}
          <div className="sh-fields">
            <label>問題類別 <span>必填</span>
              <select required value={form.categoryId}
                onChange={(event) => updateForm('categoryId', event.target.value)}>
                {categories.map(({ id, title }) => <option key={id} value={id}>{title}</option>)}
              </select>
            </label>
            <label>問題選項 <span>必填</span>
              <select required value={form.questionId}
                onChange={(event) => updateForm('questionId', event.target.value)}>
                <option value="">請選擇問題</option>
                {questions.filter(({ categoryId }) => categoryId === form.categoryId)
                  .map(({ id, title }) => <option key={id} value={id}>{title}</option>)}
              </select>
            </label>
          </div>
          <label>問題說明 <span>必填</span>
            <textarea required rows={4} maxLength={3000} value={form.description}
              onChange={(event) => updateForm('description', event.target.value)} />
          </label>
          <p className="sh-form-note">請勿填寫完整卡號、安全碼、密碼或驗證碼。</p>
          <label>聯絡手機 <span>選填</span>
            <input type="tel" autoComplete="tel" maxLength={32} value={form.phone ?? ''}
              onChange={(event) => updateForm('phone', event.target.value)} />
          </label>
          <p className="sh-form-note">如希望客服回電，可留下手機號碼。</p>
          <details>
            <summary>補充交易與錯誤資訊（選填）</summary>
            <div className="sh-fields">
              {optionalFields.slice(1).map(({ name, label }) => (
                <label key={name}>{label}
                  <input maxLength={250} value={form[name] ?? ''}
                    onChange={(event) => updateForm(name, event.target.value)} />
                </label>
              ))}
            </div>
          </details>
          {error && <p className="sh-error" role="alert">{error}</p>}
          <div className="sh-actions">
            <button className="sh-button sh-primary" type="submit">
              {onSubmitReport ? '預覽回報' : '預覽郵件'}
            </button>
            {supportPhone && <a className="sh-button" href={`tel:${supportPhone}`}>
              撥打客服 {supportPhone}
            </a>}
          </div>
        </form>
      )}
    </>
  )
}
