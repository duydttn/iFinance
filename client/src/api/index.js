import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const isElectron = window.navigator.userAgent.toLowerCase().includes('electron')
const BASE_URL = import.meta.env.VITE_API_URL || (isElectron ? 'https://ifinance.vz5dev.online/api' : '/api')

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 600000,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.hash = '#/login'
    }
    return Promise.reject(err)
  }
)

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data) => client.post('/auth/login', data).then(r => r.data),
  me: () => client.get('/auth/me').then(r => r.data),
  changePassword: (data) => client.post('/auth/change-password', data).then(r => r.data),
  updateTelegramChatId: (chatId) => client.post('/auth/telegram-chat-id', { telegram_chat_id: chatId }).then(r => r.data),
  getUsers: () => client.get('/auth/users').then(r => r.data),
  register: (data) => client.post('/auth/register', data).then(r => r.data),
  updateUserRole: (id, role) => client.put(`/auth/users/${id}/role`, { role }).then(r => r.data),
  updateUserNote: (id, note) => client.put(`/auth/users/${id}/note`, { note }).then(r => r.data),
  updateUserTeam: (id, team) => client.put(`/auth/users/${id}/team`, { team }).then(r => r.data),
  deleteUser: (id) => client.delete(`/auth/users/${id}`).then(r => r.data),
}

// ─── Transactions ──────────────────────────────────────────────────────────
export const transactionsApi = {
  getAll: (filters = {}) => client.get('/transactions', { params: filters }).then(r => r.data),
  getById: (id) => client.get(`/transactions/${id}`).then(r => r.data),
  create: (data) => client.post('/transactions', data).then(r => r.data),
  update: (id, data) => client.put(`/transactions/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/transactions/${id}`).then(r => r.data),
  confirm: (id) => client.post(`/transactions/${id}/confirm`).then(r => r.data),
  import: (transactions) => client.post('/transactions/import', { transactions }).then(r => r.data),
  getStats: (filters = {}) => client.get('/transactions/stats', { params: filters }).then(r => r.data),
  getAnomalies: (filters = {}) => client.get('/transactions/anomalies', { params: filters }).then(r => r.data),
  exportVNPurchase: (start, end) => `${BASE_URL}/transactions/export/vn-purchase?start_date=${start}&end_date=${end}`,
  exportVNSales: (start, end) => `${BASE_URL}/transactions/export/vn-sales?start_date=${start}&end_date=${end}`,
}

// ─── Categories ────────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: (scope = null) => client.get('/categories', { params: scope ? { scope } : {} }).then(r => r.data),
  create: (data) => client.post('/categories', data).then(r => r.data),
  update: (id, data) => client.put(`/categories/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/categories/${id}`).then(r => r.data),
}

// ─── Rules ─────────────────────────────────────────────────────────────────
export const rulesApi = {
  getAll: () => client.get('/rules').then(r => r.data),
  create: (data) => client.post('/rules', data).then(r => r.data),
  update: (id, data) => client.put(`/rules/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/rules/${id}`).then(r => r.data),
}

// ─── Audit Logs ────────────────────────────────────────────────────────────
export const auditLogsApi = {
  getAll: (filters = {}) => client.get('/audit-logs', { params: filters }).then(r => r.data),
}

// ─── AI ────────────────────────────────────────────────────────────────────
export const aiApi = {
  getStatus: () => client.get('/ai/status').then(r => r.data),
  getSpecs: () => client.get('/ai/specs').then(r => r.data),
  setupEngine: () => client.post('/ai/setup-engine').then(r => r.data),
  setupModel: () => client.post('/ai/setup-model').then(r => r.data),
  start: () => client.post('/ai/start').then(r => r.data),
  stop: () => client.post('/ai/stop').then(r => r.data),
  getSettings: () => client.get('/ai/settings').then(r => r.data),
  updateSettings: (data) => client.post('/ai/settings', data).then(r => r.data),
  autoClassify: () => client.post('/ai/auto-classify').then(r => r.data),
  analyzeAll: () => client.post('/ai/analyze-all').then(r => r.data),
  chat: (message, history = []) => client.post('/ai/chat', { message, history }).then(r => r.data),
  analyzePeriod: (start_date, end_date) => client.post('/ai/analyze-period', { start_date, end_date }).then(r => r.data),
  getBotInfo: () => client.get('/ai/bot-info').then(r => r.data),
}

// ─── Settings ──────────────────────────────────────────────────────────────
export const settingsApi = {
  get: () => client.get('/settings').then(r => r.data),
  update: (data) => client.post('/settings', data).then(r => r.data),
}

// ─── Backup ────────────────────────────────────────────────────────────────
export const backupApi = {
  sync: () => client.post('/backup/cloud').then(r => r.data),
  status: () => client.get('/backup/status').then(r => r.data),
}

// ─── Releases ──────────────────────────────────────────────────────────────  
export const releasesApi = {
  getAll: () => client.get('/releases').then(r => r.data),
  getCurrent: () => client.get('/releases/current').then(r => r.data),
  create: (data, onProgress) => client.post('/releases', data, {
    onUploadProgress: (progressEvent) => {
      if (onProgress) onProgress(progressEvent)
    }
  }).then(r => r.data),
  setCurrent: (id) => client.put(`/releases/${id}/current`).then(r => r.data),
  delete: (id) => client.delete(`/releases/${id}`).then(r => r.data),
}

// ─── File downloader helper ────────────────────────────────────────────────
export function downloadFile(url, filename) {
  const token = localStorage.getItem('token')
  fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    .then(r => r.blob())
    .then(blob => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
    })
}