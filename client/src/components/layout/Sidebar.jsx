import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CreditCard, Clock, BarChart3,
  Bot, Settings, LogOut, TrendingUp, DownloadCloud, Users
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Trang chủ' },
  { to: '/transactions', icon: CreditCard, label: 'Giao dịch' },
  { to: '/pending', icon: Clock, label: 'Chờ duyệt' },
  { to: '/reports', icon: BarChart3, label: 'Báo cáo' },
  { to: '/ai-studio', icon: Bot, label: 'AI Studio' },
  { to: '/settings', icon: Settings, label: 'Cài đặt' },
]

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"

export function Sidebar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const avatarLetter = user?.username?.[0]?.toUpperCase() || 'U'

  return (
    <aside className="w-60 shrink-0 flex flex-col h-full bg-card border-r border-border">
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3 py-4">
          Menu chính
        </div>
        
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {label}
              </>
            )}
          </NavLink>
        ))}

        {user?.role === 'Admin' && (
          <>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3 py-4 mt-4">
              Hệ thống
            </div>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Users className={cn("w-4 h-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  Tài khoản
                </>
              )}
            </NavLink>
            <NavLink
              to="/releases"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <DownloadCloud className={cn("w-4 h-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  Phiên bản
                </>
              )}
            </NavLink>
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-border bg-secondary/10">
        <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-background/50 border border-border/50 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base font-bold border border-primary/20">
            {avatarLetter}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold truncate text-foreground">{user?.username}</div>
            <div className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">Vai trò: {user?.role}</div>
          </div>
        </div>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>

      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Xác nhận đăng xuất</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn thoát khỏi hệ thống iFinance không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="secondary" onClick={() => setShowLogoutConfirm(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  )
}
