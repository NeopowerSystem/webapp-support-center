import type { ReactElement } from 'react'

export interface SupportContext {
  sessionId?: string
  cdrId?: string
  locationId?: string
  errorCode?: string
  reqId?: string
}

export interface SupportActionInput {
  questionId?: string
  context?: SupportContext
}

export type SupportActionId =
  | 'viewOutstanding' | 'backToCharging' | 'scanAgain' | 'viewStation'
  | 'viewSettlement' | 'viewTransaction' | 'retryPayment' | 'refreshPaymentResult'
  | 'viewTransactionDetails' | 'viewPayments' | 'viewTransactions' | 'openCarrierSettings'
  | 'openStationMap' | 'refreshStation' | 'returnToLogin'

export interface SupportReportContext {
  occurredAt?: string
  stationName?: string
  connector?: string
  sessionId?: string
  cdrId?: string
  paymentDetails?: string
  errorDetails?: string
  attemptedSteps?: string
}

export interface SupportEmailDraft {
  to: string
  subject: string
  body: string
  mailto: string
}

export interface SupportReport extends SupportReportContext {
  categoryId: string
  questionId: string
  description: string
  phone?: string
}

export interface SupportCenterProps {
  initialQuestionId?: string | null
  supportEmail?: string
  supportPhone?: string
  actions?: Partial<Record<SupportActionId, (input: SupportActionInput) => void>>
  context?: SupportContext
  loadReportContext?: (input: SupportActionInput) =>
    SupportReportContext | null | Promise<SupportReportContext | null>
  onReturnToSource?: () => void
  openEmailDraft?: (draft: SupportEmailDraft) => boolean | void | Promise<boolean | void>
  onSubmitReport?: (report: SupportReport) => Promise<void>
}

export function SupportCenter(props: SupportCenterProps): ReactElement
