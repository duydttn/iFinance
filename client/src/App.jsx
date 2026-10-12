import './index.css'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from './components/layout/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { PendingPage } from './pages/PendingPage'
import { ReportsPage } from './pages/ReportsPage'
import { AIStudioPage } from './pages/AIStudioPage'
import { SettingsPage } from './pages/SettingsPage'
import { ReleasesPage } from './pages/ReleasesPage'
import { UsersPage } from './pages/UsersPage'
import { Toaster } from './components/ui/toaster'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/pending" element={<PendingPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/ai-studio" element={<AIStudioPage />} />
            <Route path="/releases" element={<ReleasesPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Toaster />
      </HashRouter>
    </QueryClientProvider>
  )
}
