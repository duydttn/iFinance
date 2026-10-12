import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, AlertTriangle, Search, Bot, Sparkles } from 'lucide-react'
import { transactionsApi, categoriesApi, aiApi } from '../api'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { formatCurrency, formatDate } from '../lib/utils'
import { useToast } from '../hooks/use-toast'

export function PendingPage() {
  const qc = useQueryClient()
  const { toast } = useToast()
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', 'pending'],
    queryFn: () => transactionsApi.getAll({ status: 'pending', limit: 100 }),
  })

  const confirmMutation = useMutation({
    mutationFn: transactionsApi.confirm,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); toast.success('✅ Đã xác nhận') },
    onError: () => toast.error('Lỗi khi xác nhận'),
  })

  const deleteMutation = useMutation({
    mutationFn: transactionsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      toast.success('🗑️ Đã xóa giao dịch')
    },
    onError: () => toast.error('Lỗi khi xóa giao dịch'),
  })

  const autoClassifyMutation = useMutation({
    mutationFn: aiApi.autoClassify,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['transactions'] })
      toast.success(`✨ Đã tự động phân loại ${data.updated} giao dịch`)
    },
    onError: () => toast.error('AI chưa sẵn sàng. Hãy kiểm tra AI Studio.'),
  })

  const txs = (data?.transactions || []).filter(t =>
    !search || t.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chờ xác nhận</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {txs.length} giao dịch cần được xem xét
          </p>
        </div>
        <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/5" onClick={() => autoClassifyMutation.mutate()} disabled={autoClassifyMutation.isPending}>
          <Bot className={`w-4 h-4 mr-2 ${autoClassifyMutation.isPending ? 'animate-bounce' : ''}`} />
          {autoClassifyMutation.isPending ? 'Đang phân loại...' : 'AI Phân loại Tự động'}
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm..." className="pl-9"
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : txs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Check className="w-12 h-12 text-income mb-3" />
            <p className="text-lg font-medium">Tất cả đã được xác nhận!</p>
            <p className="text-muted-foreground text-sm mt-1">Không có giao dịch nào đang chờ duyệt.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {txs.map((tx) => (
            <Card key={tx.id} className="border-yellow-500/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="pending">⏳ Chờ duyệt</Badge>
                      <Badge variant={tx.scope}>{tx.scope === 'business' ? 'Công ty' : 'Cá nhân'}</Badge>
                    </div>
                    <div className="font-medium truncate">{tx.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">{formatDate(tx.date)}</div>
                    {tx.suggested_category_name && (
                      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                        <Bot className="w-3 h-3 text-primary" />
                        AI đề xuất: <span className="font-medium text-primary">{tx.suggested_category_name}</span>
                        {tx.confidence_score && (
                          <span className="text-muted-foreground/70">({Math.round(tx.confidence_score * 100)}%)</span>
                        )}
                      </div>
                    )}
                    {tx.ai_explanation && (
                      <div className="mt-2 text-xs bg-yellow-500/5 border border-yellow-500/20 rounded-md px-3 py-2 text-yellow-300">
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        {tx.ai_explanation}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-lg font-bold ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <Button
                        size="sm"
                        onClick={() => confirmMutation.mutate(tx.id)}
                        disabled={confirmMutation.isPending}
                      >
                        <Check className="w-3 h-3 mr-1" /> Xác nhận
                      </Button>
                      <Button
                        size="sm" variant="outline"
                        className="text-destructive hover:bg-destructive/10 border-destructive/30"
                        onClick={() => deleteMutation.mutate(tx.id)}
                        disabled={deleteMutation.isPending}
                      >
                        Xóa bỏ
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
