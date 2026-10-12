import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Bot, Send, Cpu, Play, Square, Download, Zap } from 'lucide-react'
import { aiApi } from '../api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { useToast } from '../hooks/use-toast'

function MarkdownText({ text }) {
  // Simple markdown renderer for bold, italic, code
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-secondary px-1 rounded text-xs">$1</code>')
    .replace(/\n/g, '<br>')
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

export function AIStudioPage() {
  const { toast } = useToast()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const chatEndRef = useRef(null)

  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ['ai-status'],
    queryFn: aiApi.getStatus,
    refetchInterval: 5000,
  })

  const { data: specs } = useQuery({
    queryKey: ['ai-specs'],
    queryFn: aiApi.getSpecs,
  })

  const startMutation = useMutation({
    mutationFn: aiApi.start,
    onSuccess: () => { toast.success('🤖 AI Engine đang khởi động...'); refetchStatus() },
    onError: () => toast.error('Lỗi khởi động'),
  })

  const stopMutation = useMutation({
    mutationFn: aiApi.stop,
    onSuccess: () => { toast({ title: '⏹ AI Engine đã dừng', variant: 'default' }); refetchStatus() },
  })

  const chatMutation = useMutation({
    mutationFn: ({ message, history }) => aiApi.chat(message, history),
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'AI không phản hồi')
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ AI không phản hồi. Vui lòng thử lại.', error: true }])
    },
  })

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input }
    const history = messages.slice(-10)
    setMessages(prev => [...prev, userMsg])
    setInput('')
    chatMutation.mutate({ message: input, history })
  }

  const isRunning = status?.isRunning
  const modelExists = status?.modelExists
  const engineExists = status?.engineExists

  const suggestedQuestions = [
    'Tháng này tôi chi bao nhiêu?',
    'Danh mục nào tốn nhiều nhất?',
    'So sánh thu chi 3 tháng gần đây',
    'Tôi có giao dịch bất thường không?',
  ]

  return (
    <div className="space-y-5 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI Studio</h1>
          <p className="text-muted-foreground text-sm mt-1">Trò chuyện với AI kế toán thông minh</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isRunning ? 'confirmed' : 'secondary'}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isRunning ? 'bg-income animate-pulse' : 'bg-muted-foreground'}`} />
            {isRunning ? 'Đang chạy' : 'Chưa khởi động'}
          </Badge>
          {isRunning ? (
            <Button size="sm" variant="outline" onClick={() => stopMutation.mutate()}>
              <Square className="w-3 h-3" /> Dừng
            </Button>
          ) : (
            <Button size="sm" onClick={() => startMutation.mutate()} disabled={!engineExists || !modelExists}>
              <Play className="w-3 h-3" /> Khởi động AI
            </Button>
          )}
        </div>
      </div>

      {/* Setup progress */}
      {(!engineExists || !modelExists) && (
        <Card className="border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-400">Cần cài đặt AI trước khi sử dụng</p>
                <div className="flex gap-2 mt-3">
                  {!engineExists && (
                    <Button size="sm" variant="secondary" onClick={() => aiApi.setupEngine().then(() => toast.success('Đang tải Engine...'))}>
                      <Download className="w-3 h-3" /> Tải llama.cpp Engine
                    </Button>
                  )}
                  {!modelExists && (
                    <Button size="sm" variant="secondary" onClick={() => aiApi.setupModel().then(() => toast.success('Đang tải Model...'))}>
                      <Download className="w-3 h-3" /> Tải AI Model (Qwen 2.5)
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat */}
      <Card className="flex flex-col" style={{ height: 'calc(100vh - 280px)' }}>
        <CardHeader className="border-b border-border py-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            Chat với AI kế toán
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Bot className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="font-medium">Xin chào! Tôi là AI kế toán iFinance</p>
                <p className="text-muted-foreground text-sm mt-1">Hỏi tôi bất cứ điều gì về tình hình tài chính của bạn</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(q); }}
                    className="text-left text-xs border border-border rounded-lg px-3 py-2 hover:bg-secondary hover:border-primary/50 transition-all text-muted-foreground hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}>
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className={`rounded-xl px-4 py-2.5 text-sm max-w-[75%] ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : msg.error
                      ? 'bg-destructive/10 text-destructive border border-destructive/20 rounded-tl-sm'
                      : 'bg-secondary rounded-tl-sm'
                }`}>
                  <MarkdownText text={msg.content} />
                </div>
              </div>
            ))
          )}
          {chatMutation.isPending && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0">🤖</div>
              <div className="bg-secondary rounded-xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </CardContent>
        <div className="p-4 border-t border-border">
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); handleSend() }}>
            <Input
              placeholder={isRunning ? 'Nhập câu hỏi...' : 'Khởi động AI trước để chat'}
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={!isRunning || chatMutation.isPending}
              className="flex-1"
            />
            <Button type="submit" disabled={!isRunning || !input.trim() || chatMutation.isPending} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
