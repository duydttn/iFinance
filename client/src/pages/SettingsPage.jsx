import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Save, Cloud, CloudOff, Key, Link, User, Lock, MessageSquare, Cpu } from 'lucide-react'
import { settingsApi, backupApi, authApi, aiApi } from '../api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { useToast } from '../hooks/use-toast'
import { useAuthStore } from '../store/authStore'

function SettingsSection({ title, icon: Icon, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="w-4 h-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

export function SettingsPage() {
  const { toast } = useToast()
  const { user } = useAuthStore()

  // Cloud Sync settings
  const [cloudUrl, setCloudUrl] = useState('')
  const [cloudSecret, setCloudSecret] = useState('')

  // Password change
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })

  // Telegram
  const [chatId, setChatId] = useState('')


  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  })

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.me,
  })

  // Sync state when data arrives
  useEffect(() => {
    if (settingsData) {
      setCloudUrl(settingsData.cloud_sync_url || '')
      setCloudSecret(settingsData.cloud_sync_secret || '')
    }
  }, [settingsData])

  useEffect(() => {
    if (meData?.user?.telegram_chat_id) {
      setChatId(meData.user.telegram_chat_id)
    }
  }, [meData])

  const { data: botInfo } = useQuery({
    queryKey: ['bot-info'],
    queryFn: aiApi.getBotInfo,
  })

  const saveSettingsMutation = useMutation({
    mutationFn: () => settingsApi.update({ cloud_sync_url: cloudUrl, cloud_sync_secret: cloudSecret }),
    onSuccess: () => toast.success('✅ Đã lưu cài đặt'),
    onError: () => toast.error('Lỗi khi lưu'),
  })

  const syncMutation = useMutation({
    mutationFn: backupApi.sync,
    onSuccess: () => toast.success('☁️ Đồng bộ thành công!'),
    onError: (err) => toast.error(err.response?.data?.error || 'Lỗi đồng bộ'),
  })

  const changePwMutation = useMutation({
    mutationFn: () => authApi.changePassword(pwForm),
    onSuccess: () => { toast.success('✅ Đổi mật khẩu thành công'); setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' }) },
    onError: (err) => toast.error(err.response?.data?.error || 'Lỗi đổi mật khẩu'),
  })

  const telegramMutation = useMutation({
    mutationFn: () => authApi.updateTelegramChatId(chatId),
    onSuccess: () => toast.success('✅ Đã cập nhật Telegram Chat ID'),
    onError: () => toast.error('Lỗi cập nhật'),
  })

  const handleChangePw = (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.warning('Mật khẩu xác nhận không khớp'); return }
    changePwMutation.mutate()
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Cài đặt</h1>
        <p className="text-muted-foreground text-sm mt-1">Quản lý cấu hình hệ thống</p>
      </div>

      {/* Cloud Sync */}
      <SettingsSection title="Đồng bộ Đám mây" icon={Cloud}>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><Link className="w-3.5 h-3.5" /> Cloud API URL</Label>
            <Input
              value={cloudUrl} onChange={e => setCloudUrl(e.target.value)}
              placeholder="https://your-server.com/api/backup"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5" /> Secret Key</Label>
            <Input
              type="password" value={cloudSecret} onChange={e => setCloudSecret(e.target.value)}
              placeholder="Secret key để mã hóa backup"
            />
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground">
            🔐 Dữ liệu được mã hóa <strong className="text-foreground">AES-256-CBC</strong> trước khi tải lên. Máy chủ của bạn không thể đọc được nội dung.
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => saveSettingsMutation.mutate()} disabled={saveSettingsMutation.isPending}>
              <Save className="w-4 h-4" /> Lưu cài đặt
            </Button>
            {cloudUrl && (
              <Button variant="secondary" onClick={() => syncMutation.mutate()} disabled={syncMutation.isPending}>
                <Cloud className="w-4 h-4" />{syncMutation.isPending ? 'Đang đồng bộ...' : 'Thử đồng bộ ngay'}
              </Button>
            )}
          </div>
        </div>
      </SettingsSection>

      {/* Telegram */}
      <SettingsSection title="Telegram Bot" icon={MessageSquare}>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nhập dữ liệu tài chính qua Telegram bot. Chat với bot bằng định dạng tự nhiên:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="bg-secondary/50 p-2.5 rounded-lg border border-border/50">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Ví dụ chi tiêu</span>
                <code className="text-xs text-expense font-semibold">chi 50k ăn trưa</code>
              </div>
              <div className="bg-secondary/50 p-2.5 rounded-lg border border-border/50">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Ví dụ thu nhập</span>
                <code className="text-xs text-income font-semibold">thu 10tr lương tháng 3</code>
              </div>
            </div>
          </div>

          {botInfo?.username && (
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <MessageSquare className="w-5 h-5" />
                </div>
                  <div>
                    <p className="text-sm font-medium">{botInfo.name || 'Link Bot của bạn'}</p>
                    <p className="text-xs text-muted-foreground">@{botInfo.username}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://t.me/${botInfo.username}`} target="_blank" rel="noreferrer">Mở Chat</a>
                </Button>
            </div>
          )}

          <div className="space-y-1.5 pt-2">
            <Label className="flex items-center gap-2">
              Telegram Chat ID
              <Badge variant="outline" className="text-[10px] font-normal py-0">Bắt buộc để liên kết</Badge>
            </Label>
            <div className="flex gap-2">
              <Input
                value={chatId} onChange={e => setChatId(e.target.value)}
                placeholder="VD: 123456789"
              />
              <Button onClick={() => telegramMutation.mutate()} disabled={telegramMutation.isPending}>
                <Save className="w-4 h-4" /> {telegramMutation.isPending ? 'Lưu...' : 'Lưu'}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 italic">
              💡 Cách lấy Chat ID: Mở chat với bot bên trên, gửi lệnh <code className="bg-secondary px-1 rounded text-primary">/start</code>. Bot sẽ gửi lại Chat ID cho bạn.
            </p>
          </div>
        </div>
      </SettingsSection>

      {/* Change Password */}
      <SettingsSection title="Đổi mật khẩu" icon={Lock}>
        <form onSubmit={handleChangePw} className="space-y-3">
          <div className="space-y-1.5">
            <Label>Mật khẩu hiện tại</Label>
            <Input type="password" value={pwForm.oldPassword} onChange={e => setPwForm(p => ({ ...p, oldPassword: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Mật khẩu mới</Label>
            <Input type="password" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Xác nhận mật khẩu mới</Label>
            <Input type="password" value={pwForm.confirmPassword} onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))} />
          </div>
          <Button type="submit" disabled={changePwMutation.isPending}>
            {changePwMutation.isPending ? 'Đang lưu...' : 'Đổi mật khẩu'}
          </Button>
        </form>
      </SettingsSection>


      {/* User info */}
      <SettingsSection title="Thông tin tài khoản" icon={User}>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Tên đăng nhập</span>
            <span className="font-medium">{user?.username}</span>
          </div>
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-muted-foreground">Phân quyền</span>
            <span className="font-medium">{user?.role}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Phiên bản</span>
            <span className="font-medium text-muted-foreground">iFinance v{__APP_VERSION__}</span>
          </div>
        </div>
      </SettingsSection>
    </div>
  )
}
