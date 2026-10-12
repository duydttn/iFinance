import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, BarChart3, TrendingUp, TrendingDown, Sparkles } from 'lucide-react'
import { transactionsApi, aiApi } from '../api'
import { downloadFile } from '../api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { formatCurrency, getToday, getMonthAgo } from '../lib/utils'
import { useToast } from '../hooks/use-toast'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts'
import { useAuthStore } from '../store/authStore'

export function ReportsPage() {
  const { toast } = useToast()
  const { token } = useAuthStore()
  const [startDate, setStartDate] = useState(getMonthAgo())
  const [endDate, setEndDate] = useState(getToday())
  const [catTab, setCatTab] = useState('all')

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['stats', startDate, endDate],
    queryFn: () => transactionsApi.getStats({ start_date: startDate, end_date: endDate }),
  })

  const { data: aiInsight, isLoading: isAIPlanning } = useQuery({
    queryKey: ['ai-insight', startDate, endDate],
    queryFn: () => aiApi.analyzePeriod(startDate, endDate),
    enabled: !!statsData, // Only run once we have some data
  })

  const stats = statsData?.stats
  const categoryStats = (statsData?.categoryStats || []).filter(c => {
    if (catTab === 'income') return c.type === 'income'
    if (catTab === 'expense') return c.type === 'expense'
    return true
  })

  const chartData = categoryStats.slice(0, 8).map(c => ({
    name: (c.category_name || 'Khác').slice(0, 10),
    value: c.total,
    type: c.type,
  }))

  const handleExport = async (type) => {
    if (!startDate || !endDate) { toast.warning('Vui lòng chọn khoảng thời gian'); return }
    toast({ title: '⏳ Đang tạo file Excel...' })
    try {
      const url = type === 'purchase'
        ? transactionsApi.exportVNPurchase(startDate, endDate)
        : transactionsApi.exportVNSales(startDate, endDate)
      const filename = type === 'purchase'
        ? `Bang_ke_mua_vao_${startDate}_${endDate}.xlsx`
        : `Bang_ke_ban_ra_${startDate}_${endDate}.xlsx`
      downloadFile(url, filename)
      toast.success('✅ Đang tải file xuống...')
    } catch {
      toast.error('Lỗi xuất file')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Báo cáo</h1>
        <p className="text-muted-foreground text-sm mt-1">Phân tích tài chính theo khoảng thời gian</p>
      </div>

      {/* Date range filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-40" />
        <span className="text-muted-foreground">đến</span>
        <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-40" />
      </div>

      {/* AI Insight */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className={`w-4 h-4 text-primary ${isAIPlanning ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Nhận xét thông minh</p>
              {isAIPlanning ? (
                <div className="space-y-2 mt-2">
                  <div className="h-3 bg-primary/10 rounded w-[80%] animate-pulse" />
                  <div className="h-3 bg-primary/10 rounded w-[60%] animate-pulse" />
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-foreground/90 italic">
                  "{aiInsight?.insight || 'Không có nhận xét cho giai đoạn này.'}"
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-income/10"><TrendingUp className="w-5 h-5 text-income" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Tổng Thu</p>
                <div className="text-xl font-bold text-income">{formatCurrency(stats?.total_income || 0)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-expense/10"><TrendingDown className="w-5 h-5 text-expense" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Tổng Chi</p>
                <div className="text-xl font-bold text-expense">{formatCurrency(stats?.total_expense || 0)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10"><BarChart3 className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Số dư</p>
                <div className={`text-xl font-bold ${(stats?.total_income || 0) >= (stats?.total_expense || 0) ? 'text-income' : 'text-expense'}`}>
                  {formatCurrency((stats?.total_income || 0) - (stats?.total_expense || 0))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /> Thống kê danh mục</span>
              <div className="flex gap-1">
                {['all', 'income', 'expense'].map(t => (
                  <Button key={t} size="sm" variant={catTab === t ? 'default' : 'ghost'} className="h-7 text-xs px-2" onClick={() => setCatTab(t)}>
                    {t === 'all' ? 'Tất cả' : t === 'income' ? 'Thu' : 'Chi'}
                  </Button>
                ))}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 16%)" />
                  <XAxis type="number" tickFormatter={v => `${(v / 1e6).toFixed(1)}M`} tick={{ fontSize: 11, fill: 'hsl(240 5% 64.9%)' }} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: 'hsl(240 5% 64.9%)' }} />
                  <Tooltip 
                    formatter={(v) => formatCurrency(v)} 
                    contentStyle={{ background: 'hsl(240 10% 6%)', border: '1px solid hsl(240 4% 16%)', borderRadius: '8px' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.type === 'income' ? 'hsl(142 76% 45%)' : 'hsl(0 84% 60%)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground py-8 text-sm">Chưa có dữ liệu</div>
            )}
          </CardContent>
        </Card>

        {/* VN Tax Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              Xuất Báo Cáo Thuế VN
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Xuất dữ liệu theo mẫu <strong className="text-foreground">Thông tư 132/2018/TT-BTC</strong> dành cho doanh nghiệp siêu nhỏ tại Việt Nam.
            </p>
            <div className="space-y-3">
              <Button
                className="w-full justify-start gap-3" variant="secondary"
                onClick={() => handleExport('purchase')}
              >
                <span className="text-base">📄</span>
                <div className="text-left">
                  <div className="font-medium">Bảng kê Mua vào</div>
                  <div className="text-xs text-muted-foreground">Chi phí mua hàng hóa / dịch vụ</div>
                </div>
              </Button>
              <Button
                className="w-full justify-start gap-3" variant="secondary"
                onClick={() => handleExport('sales')}
              >
                <span className="text-base">📈</span>
                <div className="text-left">
                  <div className="font-medium">Bảng kê Bán ra</div>
                  <div className="text-xs text-muted-foreground">Doanh thu hàng hóa / dịch vụ bán</div>
                </div>
              </Button>
            </div>
            <div className="rounded-lg border border-dashed border-border/70 p-3 bg-primary/5">
              <p className="text-xs text-muted-foreground">
                💡 Chỉ xuất giao dịch <strong className="text-foreground">Công ty</strong> đã <strong className="text-foreground">xác nhận</strong> trong khoảng thời gian đã chọn.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
