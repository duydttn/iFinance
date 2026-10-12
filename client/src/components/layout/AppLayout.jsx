import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Toaster } from '../ui/toaster'
import { useAuthStore } from '../../store/authStore'
import { UpdateBanner } from './UpdateBanner'
import { TitleBar } from './TitleBar'

export function AppLayout() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TitleBar />
      <UpdateBanner />
      <div className="flex flex-1 overflow-hidden bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 min-h-full animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}