import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Shield, User as UserIcon, Key } from 'lucide-react'
import { authApi } from '../api'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger
} from '../components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../components/ui/select'
import { Label } from '../components/ui/label'
import { useToast } from '../hooks/use-toast'
import { formatDate } from '../lib/utils'

export function UsersPage() {
  const qc = useQueryClient()
  const { toast } = useToast()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'Accountant', note: '', team: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: authApi.getUsers,
  })

  const createMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('✅ Đã tạo tài khoản mới')
      setIsAddOpen(false)
      setNewUser({ username: '', password: '', role: 'Accountant', note: '', team: '' })
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Lỗi khi tạo tài khoản'),
  })

  const deleteMutation = useMutation({
    mutationFn: authApi.deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('🗑️ Đã xóa tài khoản')
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Lỗi khi xóa'),
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) => authApi.updateUserRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('🛡️ Đã cập nhật quyền hạn')
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Lỗi khi cập nhật'),
  })

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, note }) => authApi.updateUserNote(id, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('📝 Đã cập nhật ghi chú')
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Lỗi khi cập nhật ghi chú'),
  })

  const updateTeamMutation = useMutation({
    mutationFn: ({ id, team }) => authApi.updateUserTeam(id, team),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('👥 Đã cập nhật nhóm')
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Lỗi khi cập nhật nhóm'),
  })

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newUser.username || !newUser.password) {
      toast.warning('Vui lòng nhập đầy đủ thông tin')
      return
    }
    createMutation.mutate(newUser)
  }

  const handleDelete = (id, username) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${username}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  const users = data?.users || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Tài khoản</h1>
          <p className="text-muted-foreground text-sm mt-1">Quản lý quyền truy cập hệ thống iFinance</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Thêm tài khoản
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Tạo tài khoản mới</DialogTitle>
              <DialogDescription>
                Cấp quyền truy cập cho nhân viên hoặc người quản lý mới.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  placeholder="VD: ketoan01"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="note">Ghi chú</Label>
                <Input
                  id="note"
                  placeholder="VD: Kế toán chi nhánh HN"
                  value={newUser.note}
                  onChange={(e) => setNewUser({ ...newUser, note: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="team">Nhóm (Group)</Label>
                <Input
                  id="team"
                  placeholder="VD: Ban tiếp khách, Nhóm chạy ads..."
                  value={newUser.team}
                  onChange={(e) => setNewUser({ ...newUser, team: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Vai trò</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(v) => setNewUser({ ...newUser, role: v })}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">🛡️ Quản trị viên (Admin)</SelectItem>
                    <SelectItem value="Accountant">👤 Kế toán (Accountant)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Đang tạo...' : 'Tạo tài khoản'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/20">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">Người dùng</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">Nhóm</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">Ghi chú</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">Vai trò</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">Ngày tạo</th>
                  <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="py-10 text-center">
                      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-10 text-center text-muted-foreground">Không có tài khoản nào khác</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {u.username[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold">{u.username}</div>
                            <div className="text-[10px] text-muted-foreground">ID: #{u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Input
                          defaultValue={u.team || ''}
                          placeholder="Chưa gán nhóm..."
                          className="h-8 text-xs font-bold bg-transparent border-none hover:bg-secondary/20 focus:bg-background transition-all"
                          onBlur={(e) => {
                            if (e.target.value !== (u.team || '')) {
                              updateTeamMutation.mutate({ id: u.id, team: e.target.value })
                            }
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Input
                          defaultValue={u.note || ''}
                          placeholder="Thêm ghi chú..."
                          className="h-8 text-xs italic bg-transparent border-none hover:bg-secondary/20 focus:bg-background transition-all"
                          onBlur={(e) => {
                            if (e.target.value !== (u.note || '')) {
                              updateNoteMutation.mutate({ id: u.id, note: e.target.value })
                            }
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Select
                          value={u.role}
                          onValueChange={(v) => updateRoleMutation.mutate({ id: u.id, role: v })}
                          disabled={updateRoleMutation.isPending}
                        >
                          <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Accountant">Accountant</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(u.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(u.id, u.username)}
                            title="Xóa tài khoản"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
        <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <p className="font-bold text-primary mb-1 text-sm">Lưu ý bảo mật:</p>
          <li>Quyền **Admin** có toàn quyền quản lý tài chính, hệ thống và các tài khoản khác.</li>
          <li>Quyền **Accountant** có thể xem, thêm, sửa giao dịch và sử dụng **AI Studio**. Không thể truy cập Hệ thống.</li>
          <li>Bạn không thể tự xóa tài khoản của chính mình khi đang đăng nhập.</li>
        </div>
      </div>
    </div>
  )
}
