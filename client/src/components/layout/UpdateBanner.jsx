import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DownloadCloud, X, AlertCircle } from 'lucide-react'
import { releasesApi } from '../../api'
import { Button } from '../ui/button'

// Simple semver comparison: returns true if a > b
function isNewer(a, b) {
  if (!a || !b) return false
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] || 0) - (pb[i] || 0)
    if (diff > 0) return true
    if (diff < 0) return false
  }
  return false
}

export function UpdateBanner() {
  const [currentVersion, setCurrentVersion] = useState(null)
  const [progress, setProgress] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)
  const [hidden, setHidden] = useState(false)
  const isElectron = !!window.electronAPI

  const { data: currentRelease } = useQuery({
    queryKey: ['releases', 'current'],
    queryFn: releasesApi.getCurrent,
    refetchInterval: 1000 * 60 * 5,
    retry: false,
  })

  useEffect(() => {
    if (!isElectron) return

    if (window.electronAPI.getAppVersion) {
      window.electronAPI.getAppVersion().then(v => setCurrentVersion(v))
    }

    if (window.electronAPI.onUpdateProgress) {
      window.electronAPI.onUpdateProgress((_event, p) => {
        setProgress(p.percent)
      })
    }

    if (window.electronAPI.onUpdateError) {
      window.electronAPI.onUpdateError((_event, msg) => {
        setError(msg)
        setDownloading(false)
      })
    }
  }, [isElectron])

  // Don't show if: not Electron, no release info, no app version, or dismissed
  if (!isElectron || !currentRelease || !currentVersion || hidden) return null

  // Don't show if current version is already up to date
  if (!isNewer(currentRelease.version, currentVersion)) return null

  const handleUpdate = () => {
    setError(null)
    setDownloading(true)
    window.electronAPI.startUpdate()
  }

  return (
    <div className="bg-primary text-primary-foreground px-4 py-2.5 flex items-center justify-between gap-4 shadow-md z-50 relative shrink-0">
      <div className="flex items-center gap-3">
        {error ? (
          <AlertCircle className="w-4 h-4 shrink-0" />
        ) : (
          <DownloadCloud className="w-4 h-4 shrink-0" />
        )}
        <div>
          {error ? (
            <p className="text-xs font-medium">Lỗi cập nhật: {error}</p>
          ) : (
            <>
              <span className="font-semibold text-sm">Phiên bản mới v{currentRelease.version} đã sẵn sàng!</span>
              {currentRelease.release_notes && (
                <span className="text-xs opacity-80 ml-2">— {currentRelease.release_notes}</span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {downloading && !error ? (
          <div className="flex items-center gap-2">
            <div className="w-32 bg-primary-foreground/20 rounded-full h-1.5">
              <div
                className="bg-primary-foreground h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress || 0}%` }}
              />
            </div>
            <span className="text-xs font-medium w-10 text-right">{Math.round(progress || 0)}%</span>
          </div>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleUpdate}
            className="text-xs h-7 px-3"
            disabled={downloading}
          >
            {error ? 'Thử lại' : 'Cập nhật ngay'}
          </Button>
        )}
        <button
          onClick={() => setHidden(true)}
          className="p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
          title="Bỏ qua"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
