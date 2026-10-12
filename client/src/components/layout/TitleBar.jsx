import { useState, useEffect } from 'react'
import { Minus, Square, X, Maximize2 } from 'lucide-react'

const isElectron = typeof window !== 'undefined' && window.electronAPI

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    if (!isElectron) return
    window.electronAPI.windowIsMaximized().then(setIsMaximized)
  }, [])

  const handleMinimize = () => isElectron && window.electronAPI.windowMinimize()
  const handleMaximize = async () => {
    if (!isElectron) return
    await window.electronAPI.windowMaximize()
    const maximized = await window.electronAPI.windowIsMaximized()
    setIsMaximized(maximized)
  }
  const handleClose = () => isElectron && window.electronAPI.windowClose()

  return (
    <div
      className="flex items-center justify-between select-none shrink-0"
      style={{ height: '38px', background: 'hsl(240 10% 4%)', WebkitAppRegion: 'drag' }}
    >
      {/* Left — App identity */}
      <div className="flex items-center gap-2.5 pl-4" style={{ WebkitAppRegion: 'no-drag' }}>
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-primary-foreground text-[11px] font-black leading-none">Vz</span>
        </div>
        <div className="flex flex-col -space-y-0.5">
          <span className="text-sm font-bold text-foreground tracking-tight">iFinance</span>
          <span className="text-[9px] text-muted-foreground/60 font-medium">Financial Manager</span>
        </div>
        <span className="text-[10px] text-muted-foreground/50">v{__APP_VERSION__}</span>
      </div>

      {/* Center drag zone - empty */}
      <div className="flex-1" style={{ WebkitAppRegion: 'drag' }} />

      {/* Right — Window controls */}
      <div className="flex items-center h-full" style={{ WebkitAppRegion: 'no-drag' }}>
        <button
          onClick={handleMinimize}
          className="flex items-center justify-center h-full w-11 text-muted-foreground/60 hover:text-foreground hover:bg-white/5 transition-colors"
          title="Thu nhỏ"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="flex items-center justify-center h-full w-11 text-muted-foreground/60 hover:text-foreground hover:bg-white/5 transition-colors"
          title={isMaximized ? 'Khôi phục' : 'Phóng to'}
        >
          {isMaximized
            ? <Square className="w-3 h-3" style={{ strokeWidth: 1.5 }} />
            : <Maximize2 className="w-3 h-3" />
          }
        </button>
        <button
          onClick={handleClose}
          className="flex items-center justify-center h-full w-11 text-muted-foreground/60 hover:text-white hover:bg-red-600 transition-colors"
          title="Đóng"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
