import { CircleHelp, CreditCard, MapPin, ReceiptText, UserRound, Zap } from 'lucide-react'

export { default as questions } from './questions.json'

export const actionIds = {
  查看未完成交易: 'viewOutstanding',
  返回充電頁: 'backToCharging',
  重新掃碼: 'scanAgain',
  查看場站: 'viewStation',
  查看結算進度: 'viewSettlement',
  查看交易: 'viewTransaction',
  '重新付款（符合條件時顯示）': 'retryPayment',
  更新付款結果: 'refreshPaymentResult',
  查看交易明細: 'viewTransactionDetails',
  查看付款紀錄: 'viewPayments',
  查看交易紀錄: 'viewTransactions',
  前往載具設定: 'openCarrierSettings',
  前往場站地圖: 'openStationMap',
  重新查看場站: 'refreshStation',
  返回登入入口: 'returnToLogin',
}

export const categories = [
  { id: 'charging', title: '充電問題', summary: '無法啟動、停止充電、拔槍、結算等', Icon: Zap },
  { id: 'payment', title: '付款與費用', summary: '付款失敗、金額疑問、重複扣款、退款等', Icon: CreditCard },
  { id: 'invoice', title: '發票與載具', summary: '發票查詢、交易紀錄、手機條碼設定', Icon: ReceiptText },
  { id: 'station', title: '站點查詢', summary: '尋找漫遊站點、場站狀態異常等', Icon: MapPin },
  { id: 'account', title: '登入問題', summary: '無法登入、登入失效等', Icon: UserRound },
  { id: 'other', title: '其他問題', summary: '找不到問題、聯絡客服', Icon: CircleHelp },
]

export const popularQuestions = [
  { id: 'charge.start_failed', title: '插槍後無法開始充電', Icon: Zap },
  { id: 'charge.stop_failed', title: '無法停止充電／拔不下充電槍', Icon: Zap },
  { id: 'payment.paid_pending', title: '已付款，但畫面仍顯示未完成', Icon: CreditCard },
  { id: 'payment.duplicate_or_refund', title: '充電失敗卻扣款／疑似重複扣款', Icon: CreditCard },
  { id: 'invoice.missing', title: '發票、收據與交易紀錄在哪裡查看？', Icon: ReceiptText },
]
