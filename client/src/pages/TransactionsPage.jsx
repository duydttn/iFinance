import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Filter, Trash2, Pencil, Check, Sparkles, AlertTriangle, TrendingUp as TrendingUpIcon } from 'lucide-react'
import { transactionsApi, categoriesApi, aiApi } from '../api'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '../components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../components/ui/select'
import { Label } from '../components/ui/label'
import { formatCurrency, formatDate, getToday, getMonthAgo } from '../lib/utils'
import { useToast } from '../hooks/use-toast'

const SCOPE_LABELS = { business: 'Công ty', personal: 'Cá nhân' }
const TYPE_LABELS = { income: 'Thu nhập', expense: 'Chi tiêu' }
const TAX_RATES = ['0', '5', '8', '10']

function TxFormDialog({ open, onOpenChange, initial = null, categories = [] }) {
  const qc = useQueryClient()
  const { toast } = useToast()
  const isEdit = !!initial

  const [form, setForm] = useState(() => initial ? {
    date: initial.date, description: initial.description,
    amount: String(initial.amount), type: initial.type,
    scope: initial.scope, category_id: String(initial.category_id || ''),
    source: initial.source || '', invoice_no: initial.invoice_no || '',
    partner_name: initial.partner_name || '', tax_rate: String(initial.tax_rate || 0),
  } : {
    date: getToday(), description: '', amount: '', type: 'expense',
    scope: 'business', category_id: '', source: '',
    invoice_no: '', partner_name: '', tax_rate: '0',
  })

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const taxAmount = form.amount
    ? Math.round(Number(form.amount) - Number(form.amount) / (1 + Number(form.tax_rate) / 100))
    : 0

  const mutation = useMutation({
    mutationFn: (data) => isEdit
      ? transactionsApi.update(initial.id, data)
      : transactionsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
      toast.success(isEdit ? '✅ Đã cập nhật giao dịch' : '✅ Đã thêm giao dịch')
      onOpenChange(false)
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Lỗi khi lưu'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const amount = Number(form.amount)
    if (!amount || amount <= 0) { toast.warning('Vui lòng nhập số tiền hợp lệ'); return }
    mutation.mutate({
      ...form,
      amount,
      category_id: form.category_id || null,
      tax_rate: Number(form.tax_rate),
      tax_amount: taxAmount,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? '✏️ Sửa giao dịch' : '➕ Thêm giao dịch mới'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin chi tiết cho giao dịch này.' : 'Nhập thông tin giao dịch để ghi nhận vào hệ thống.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Ngày</Label>
              <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Loại</Label>
              <Select value={form.type} onValueChange={v => set('type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">💚 Thu nhập</SelectItem>
                  <SelectItem value="expense">🔴 Chi tiêu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Mô tả</Label>
            <Input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Nhập mô tả giao dịch" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Số tiền (VNĐ)</Label>
              <Input
                type="number" value={form.amount}
                onChange={e => set('amount', e.target.value)}
                placeholder="0" required min="1"
              />
              {form.amount > 0 && (
                <p className={`text-xs font-medium ${form.type === 'income' ? 'text-income' : 'text-expense'}`}>
                  ≈ {formatCurrency(Number(form.amount))}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Phạm vi</Label>
              <Select value={form.scope} onValueChange={v => set('scope', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">🏢 Công ty</SelectItem>
                  <SelectItem value="personal">👤 Cá nhân</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Danh mục</Label>
              <Select value={form.category_id || 'none'} onValueChange={v => set('category_id', v === 'none' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="— Không chọn —" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Không chọn —</SelectItem>
                  {categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Nguồn / Ghi chú</Label>
              <Input value={form.source} onChange={e => set('source', e.target.value)} placeholder="Tuỳ chọn" />
            </div>
          </div>

          {/* Tax section */}
          <div className="rounded-lg border border-border/50 p-3 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Thông tin thuế (tuỳ chọn)</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Số hóa đơn</Label>
                <Input value={form.invoice_no} onChange={e => set('invoice_no', e.target.value)} placeholder="VD: 0001234" />
              </div>
              <div className="space-y-1.5">
                <Label>Đối tác</Label>
                <Input value={form.partner_name} onChange={e => set('partner_name', e.target.value)} placeholder="Tên công ty / cá nhân" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Thuế suất (%)</Label>
                <Select value={form.tax_rate} onValueChange={v => set('tax_rate', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TAX_RATES.map(r => <SelectItem key={r} value={r}>{r}%</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Tiền thuế (tự tính)</Label>
                <Input value={taxAmount > 0 ? formatCurrency(taxAmount) : '0 ₫'} readOnly className="bg-muted/50 text-muted-foreground" />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Thêm giao dịch')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function TransactionsPage() {
  const qc = useQueryClient()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [scopeFilter, setScopeFilter] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [startDate, setStartDate] = useState(getMonthAgo())
  const [endDate, setEndDate] = useState(getToday())
  const [page, setPage] = useState(0)
  const pageSize = 50
  const [searchParams] = useSearchParams()
  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [teamFilter, setTeamFilter] = useState('')
  const [onlyAnomalies, setOnlyAnomalies] = useState(searchParams.get('filter') === 'anomalies')
  const [anomalyTarget, setAnomalyTarget] = useState(null)
  const [anomalyReason, setAnomalyReason] = useState('')

  const handleToggleAnomaly = (tx) => {
    if (tx.is_anomaly) {
      toggleAnomalyMutation.mutate({ id: tx.id, isAnomaly: false, note: null })
    } else {
      setAnomalyTarget(tx)
      setAnomalyReason('Số tiền quá lớn / Sai danh mục')
    }
  }

  useEffect(() => {
    if (searchParams.get('filter') === 'anomalies') {
      setOnlyAnomalies(true)
    }
  }, [searchParams])

  const { user } = useAuthStore()
  const filters = { search, type: typeFilter, scope: scopeFilter, category_id: catFilter, start_date: startDate, end_date: endDate, limit: pageSize, offset: page * pageSize, team: teamFilter }

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', filters, onlyAnomalies],
    queryFn: () => onlyAnomalies
      ? transactionsApi.getAnomalies({ start_date: startDate, end_date: endDate, team: teamFilter })
      : transactionsApi.getAll(filters),
    placeholderData: (previousData) => previousData,
  })

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  })

  const deleteMutation = useMutation({
    mutationFn: transactionsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); toast.success('Đã xóa giao dịch') },
    onError: () => toast.error('Lỗi khi xóa'),
  })

  const confirmMutation = useMutation({
    mutationFn: transactionsApi.confirm,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); toast.success('✅ Đã xác nhận giao dịch') },
    onError: () => toast.error('Lỗi khi xác nhận'),
  })

  const analyzeMutation = useMutation({
    mutationFn: aiApi.analyzeAll,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      toast.success(`✨ Đã hoàn thành phân tích ${data.count} giao dịch`)
    },
    onError: () => toast.error('Lỗi khi phân tích AI'),
  })

  const toggleAnomalyMutation = useMutation({
    mutationFn: ({ id, isAnomaly, note }) => transactionsApi.update(id, { is_anomaly: isAnomaly, anomaly_note: note }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
      toast.success('✅ Đã cập nhật trạng thái giao dịch')
    },
    onError: () => toast.error('Lỗi khi cập nhật'),
  })

  const txs = (onlyAnomalies ? data?.anomalies : data?.transactions) || []
  const total = onlyAnomalies ? txs.length : (data?.total || 0)
  const totalPages = Math.ceil(total / pageSize)
  const categories = catData?.categories || []

  const handleDelete = (id) => {
    if (window.confirm('Xóa giao dịch này?')) deleteMutation.mutate(id)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Giao dịch</h1>
          <p className="text-muted-foreground text-sm mt-1">Quản lý toàn bộ thu chi</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => analyzeMutation.mutate()} disabled={analyzeMutation.isPending}>
            <Sparkles className={`w-4 h-4 mr-2 text-primary ${analyzeMutation.isPending ? 'animate-pulse' : ''}`} />
            {analyzeMutation.isPending ? 'Đang phân tích...' : 'Phân tích AI'}
          </Button>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4" /> Thêm giao dịch
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm mô tả..."
                className="pl-9"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0) }}
              />
            </div>
            {user?.role === 'Admin' && (
              <div className="w-40">
                <Input
                  placeholder="Lọc theo nhóm..."
                  value={teamFilter}
                  onChange={e => { setTeamFilter(e.target.value); setPage(0) }}
                />
              </div>
            )}
            <Select value={typeFilter || 'all'} onValueChange={v => { setTypeFilter(v === 'all' ? '' : v); setPage(0) }}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Tất cả loại" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="income">💰 Thu nhập</SelectItem>
                <SelectItem value="expense">💸 Chi tiêu</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scopeFilter || 'all'} onValueChange={v => { setScopeFilter(v === 'all' ? '' : v); setPage(0) }}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Phạm vi" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="business">🏢 Công ty</SelectItem>
                <SelectItem value="personal">👤 Cá nhân</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setPage(0) }} className="w-36" />
            <Input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setPage(0) }} className="w-36" />
            <Button
              variant={onlyAnomalies ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setOnlyAnomalies(!onlyAnomalies); setPage(0) }}
              className={onlyAnomalies ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              <AlertTriangle className="w-4 h-4 mr-1.5" /> Bất thường
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setSearch(''); setTypeFilter(''); setScopeFilter('business'); setStartDate(getMonthAgo()); setEndDate(getToday()); setPage(0); setOnlyAnomalies(false) }}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-7 h-7 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : txs.length === 0 ? (
            <div className="text-center py-14 text-muted-foreground">
              <Filter className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Không tìm thấy giao dịch nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ngày</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Mô tả</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Danh mục</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phạm vi</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Loại</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Số tiền</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {txs.map((tx) => (
                    <tr key={tx.id} className="group border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{formatDate(tx.date)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium max-w-[200px] truncate" title={tx.description}>{tx.description}</div>
                          {tx.ai_explanation?.startsWith('Cảnh báo') && <AlertTriangle className="w-3.5 h-3.5 text-expense animate-pulse" />}
                          {tx.ai_explanation?.startsWith('Tăng trưởng') && <TrendingUpIcon className="w-3.5 h-3.5 text-income" />}
                        </div>
                        {tx.partner_name && <div className="text-xs text-muted-foreground">{tx.partner_name}</div>}
                        {tx.ai_explanation && (
                          <div className="text-[10px] text-primary mt-1 flex items-start gap-1 leading-tight max-w-[220px]">
                            <Sparkles className="w-2.5 h-2.5 mt-0.5 shrink-0" />
                            <span>{tx.ai_explanation}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {tx.category_name ? <Badge variant="outline">{tx.category_name}</Badge> : <span className="text-muted-foreground text-sm">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={tx.scope}>{SCOPE_LABELS[tx.scope]}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={tx.type}>{tx.type === 'income' ? '↑ Thu' : '↓ Chi'}</Badge>
                      </td>
                      <td className={`px-4 py-3 text-sm font-bold text-right whitespace-nowrap ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {tx.status === 'pending' && (
                            <button
                              className="h-7 w-7 flex items-center justify-center rounded-md text-green-500 hover:bg-green-500/10 transition-colors"
                              onClick={() => confirmMutation.mutate(tx.id)}
                              title="Xác nhận"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            className={`h-7 w-7 flex items-center justify-center rounded-md transition-colors ${tx.is_anomaly ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground hover:text-red-500 hover:bg-red-500/10'}`}
                            onClick={() => handleToggleAnomaly(tx)}
                            title={tx.is_anomaly ? "Gỡ bỏ báo cáo bất thường" : "Báo cáo bất thường"}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                            onClick={() => setEditTarget(tx)}
                            title="Chỉnh sửa"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            onClick={() => handleDelete(tx.id)}
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border text-sm">
              <span className="text-muted-foreground">Tổng: {total} giao dịch</span>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>‹</Button>
                <span className="px-3 text-muted-foreground">{page + 1} / {totalPages}</span>
                <Button size="sm" variant="outline" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>›</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <TxFormDialog open={addOpen} onOpenChange={setAddOpen} categories={categories} />
      {editTarget && (
        <TxFormDialog open={!!editTarget} onOpenChange={(o) => { if (!o) setEditTarget(null) }} initial={editTarget} categories={categories} />
      )}
      {/* Anomaly Report Dialog */}
      <Dialog open={!!anomalyTarget} onOpenChange={(open) => !open && setAnomalyTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              Báo cáo bất thường
            </DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do tại sao bạn cho rằng giao dịch này là bất thường.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Lý do báo cáo</Label>
              <Input
                value={anomalyReason}
                onChange={e => setAnomalyReason(e.target.value)}
                placeholder="VD: Số tiền quá lớn / Sai danh mục / Nghi ngờ gian lận"
                autoFocus
              />
            </div>
            {anomalyTarget && (
              <div className="bg-secondary/30 p-3 rounded-lg text-xs space-y-1">
                <p><strong>Giao dịch:</strong> {anomalyTarget.description}</p>
                <p><strong>Số tiền:</strong> {formatCurrency(anomalyTarget.amount)}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setAnomalyTarget(null)}>Hủy</Button>
            <Button
              variant="destructive"
              onClick={() => {
                toggleAnomalyMutation.mutate({
                  id: anomalyTarget.id,
                  isAnomaly: true,
                  note: anomalyReason
                })
                setAnomalyTarget(null)
              }}
              disabled={!anomalyReason.trim() || toggleAnomalyMutation.isPending}
            >
              {toggleAnomalyMutation.isPending ? 'Đang gửi...' : 'Gửi báo cáo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
