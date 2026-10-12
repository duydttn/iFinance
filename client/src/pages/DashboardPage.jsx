import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, DollarSign, Clock, AlertTriangle, BarChart3, Sparkles } from 'lucide-react'
import { transactionsApi, aiApi } from '../api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { formatCurrency, formatDate, getToday, getMonthAgo } from '../lib/utils'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const today = getToday()
const monthAgo = getMonthAgo()

function StatCard({ title, value, subtitle, icon: Icon, trend, color = "default", onClick }) {
  return (
    <Card className={onClick ? 'cursor-pointer hover:border-primary/50 transition-colors' : ''} onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <div className={`text-2xl font-bold ${color === 'income' ? 'text-income' : color === 'expense' ? 'text-expense' : 'text-foreground'}`}>
              {value}
            </div>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className={`p-2.5 rounded-xl ${color === 'income' ? 'bg-income/10 text-income' :
            color === 'expense' ? 'bg-expense/10 text-expense' :
              'bg-primary/10 text-primary'
            }`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-1 text-xs">
            {trend >= 0 ? (
              <TrendingUp className="w-3 h-3 text-income" />
            ) : (
              <TrendingDown className="w-3 h-3 text-expense" />
            )}
            <span className={trend >= 0 ? 'text-income' : 'text-expense'}>
              {Math.abs(trend)}% so với tháng trước
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const COLORS = ['hsl(252,87%,67%)', 'hsl(142,76%,45%)', 'hsl(0,84%,60%)', 'hsl(199,89%,48%)', 'hsl(38,92%,50%)']

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['stats', monthAgo, today],
    queryFn: () => transactionsApi.getStats({ start_date: monthAgo, end_date: today, scope: 'business' }),
  })

  const { data: pendingData } = useQuery({
    queryKey: ['transactions', 'pending'],
    queryFn: () => transactionsApi.getAll({ status: 'pending', limit: 5 }),
  })

  const { data: recentData } = useQuery({
    queryKey: ['transactions', 'recent'],
    queryFn: () => transactionsApi.getAll({ limit: 8, start_date: monthAgo, end_date: today, scope: 'business' }),
  })

  const { data: anomalyData } = useQuery({
    queryKey: ['transactions', 'anomalies', monthAgo, today],
    queryFn: () => transactionsApi.getAnomalies({ start_date: monthAgo, end_date: today }),
  })

  const { data: aiInsight } = useQuery({
    queryKey: ['ai-insight', monthAgo, today],
    queryFn: () => aiApi.analyzePeriod(monthAgo, today),
    enabled: !!statsData,
  })

  const stats = statsData?.stats
  const categoryStats = statsData?.categoryStats || []
  const pendingTxs = pendingData?.transactions || []
  const recentTxs = recentData?.transactions || []
  const anomalyTxs = anomalyData?.anomalies || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  const balance = (stats?.total_income || 0) - (stats?.total_expense || 0)

  const expenseCategories = categoryStats
    .filter(c => c.type === 'expense')
    .slice(0, 5)
    .map((c, i) => ({ name: c.category_name || 'Khác', value: c.total, fill: COLORS[i % COLORS.length] }))

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Tổng quan tài chính tháng này</p>
        </div>
        {aiInsight && (
          <div className="hidden md:flex items-center gap-2 bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-lg max-w-sm animate-in fade-in slide-in-from-right-4">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
            <p className="text-[10px] italic line-clamp-2 leading-tight">
              {aiInsight.insight}
            </p>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng thu nhập"
          value={formatCurrency(stats?.total_income || 0)}
          icon={TrendingUp}
          color="income"
          subtitle="Tháng này"
        />
        <StatCard
          title="Tổng chi tiêu"
          value={formatCurrency(stats?.total_expense || 0)}
          icon={TrendingDown}
          color="expense"
          subtitle="Tháng này"
        />
        <StatCard
          title="Số dư"
          value={formatCurrency(balance)}
          icon={DollarSign}
          color={balance >= 0 ? 'income' : 'expense'}
          subtitle="Thu - Chi"
        />
        <StatCard
          title="Bất thường"
          value={anomalyTxs.length}
          icon={AlertTriangle}
          color={anomalyTxs.length > 0 ? 'expense' : 'default'}
          subtitle="Cần kiểm tra"
          onClick={() => navigate('/transactions?filter=anomalies')}
        />
        <StatCard
          title="Chờ xác nhận"
          value={pendingTxs.length}
          icon={Clock}
          subtitle="Giao dịch"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Expense by category chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Chi theo danh mục
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenseCategories.length > 0 ? (
              <div>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {expenseCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {expenseCategories.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.fill }} />
                        <span className="text-muted-foreground truncate max-w-[120px]">{cat.name}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(cat.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8 text-sm">Chưa có dữ liệu</div>
            )}
          </CardContent>
        </Card>

        {/* Recent transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Giao dịch gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTxs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">Chưa có giao dịch</div>
            ) : (
              <div className="space-y-2">
                {recentTxs.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{tx.description}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{formatDate(tx.date)}</span>
                        {tx.category_name && (
                          <Badge variant="outline" className="text-xs py-0">{tx.category_name}</Badge>
                        )}
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ml-2 ${tx.type === 'income' ? 'text-income' : 'text-expense'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending transactions */}
      {pendingTxs.length > 0 && (
        <Card className="border-yellow-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-4 h-4" />
              Giao dịch chờ xác nhận ({pendingTxs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingTxs.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{tx.description}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(tx.date)}</div>
                  </div>
                  <Badge variant="pending">Chờ duyệt</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
