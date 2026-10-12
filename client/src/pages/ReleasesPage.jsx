import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { DownloadCloud, CheckCircle, Plus, Trash2, FileUp } from 'lucide-react'
import { releasesApi } from '../api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { useToast } from '../hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog"

export function ReleasesPage() {
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newVersion, setNewVersion] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [installerFile, setInstallerFile] = useState(null)

  const { data: releases, refetch: refetchReleases } = useQuery({
    queryKey: ['releases'],
    queryFn: releasesApi.getAll,
  })

  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const createReleaseMutation = useMutation({
    mutationFn: (data) => {
      const formData = new FormData()
      formData.append('version', data.version)
      formData.append('release_notes', data.release_notes)
      if (data.file) {
        formData.append('installer', data.file)
      }
      setIsUploading(true)
      return releasesApi.create(formData, (progress) => {
        const percent = Math.round((progress.loaded * 100) / progress.total)
        setUploadProgress(percent)
      })
    },
    onSuccess: () => {
      toast.success('Thêm phiên bản thành công')
      setNewVersion('')
      setNewNotes('')
      setInstallerFile(null)
      setIsModalOpen(false)
      setIsUploading(false)
      setUploadProgress(0)
      refetchReleases()
    },
    onError: (err) => {
      setIsUploading(false)
      setUploadProgress(0)
      toast.error(err.response?.data?.error || err.message || 'Lỗi thêm phiên bản')
    }
  })

  const setReleaseMutation = useMutation({
    mutationFn: releasesApi.setCurrent,
    onSuccess: () => {
      toast.success('Đã set phiên bản hiện hành')
      refetchReleases()
    },
    onError: () => toast.error('Lỗi set phiên bản')
  })

  const deleteReleaseMutation = useMutation({
    mutationFn: releasesApi.delete,
    onSuccess: () => {
      toast.success('Đã xóa phiên bản')
      refetchReleases()
    },
    onError: () => toast.error('Lỗi xóa phiên bản')
  })

  const handleCreate = () => {
    if (!newVersion) return
    createReleaseMutation.mutate({ 
      version: newVersion, 
      release_notes: newNotes,
      file: installerFile 
    })
  }

  return (
    <div className="space-y-5 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Quản lý Phiên bản</h1>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              Đang chạy: v{__APP_VERSION__}
            </Badge>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" /> Tạo bản cập nhật
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm phiên bản mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin và tải lên bộ cài đặt để phát hành bản cập nhật mới.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="version">Số phiên bản (Ví dụ: 1.2.4)</Label>
                  <Input 
                    id="version" 
                    placeholder="1.x.x" 
                    value={newVersion} 
                    onChange={e => setNewVersion(e.target.value)} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Nội dung cập nhật (Markdown hỗ trợ)</Label>
                  <textarea 
                    id="notes"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Những thay đổi trong bản này..."
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>File cài đặt (.exe)</Label>
                  <div className="flex items-center gap-3 p-3 border border-dashed rounded-lg bg-secondary/10">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileUp className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <input 
                        type="file" 
                        accept=".exe"
                        className="hidden" 
                        id="file-upload"
                        onChange={e => setInstallerFile(e.target.files[0])}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="text-sm font-medium truncate">
                          {installerFile ? installerFile.name : 'Chọn file iFinance Setup...'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {installerFile ? `${(installerFile.size / 1024 / 1024).toFixed(1)} MB` : 'Dung lượng tối đa 2GB'}
                        </div>
                      </label>
                    </div>
                    {installerFile && (
                      <Button variant="ghost" size="sm" onClick={() => setInstallerFile(null)}>Hủy</Button>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isUploading}>Hủy</Button>
                <Button onClick={handleCreate} disabled={!newVersion || isUploading}>
                  {isUploading ? `Đang tải lên ${uploadProgress}%...` : 'Xác nhận Thêm'}
                </Button>
              </DialogFooter>
              {isUploading && (
                <div className="px-6 pb-6">
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
        
        <p className="text-muted-foreground text-sm">
          Hệ thống sẽ tự động lưu trữ file cài đặt vào máy chủ. Khi bạn kích hoạt phiên bản, người dùng sẽ nhận được thông báo cập nhật.
        </p>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Lịch sử các phiên bản
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {releases?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-10 italic">Chưa có phiên bản nào được ghi nhận.</p>
            )}
            {releases?.map(r => (
              <div key={r.id} className="group relative flex flex-col p-5 border border-border/60 rounded-xl bg-card/50 hover:bg-secondary/5 transition-all">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xl tracking-tight">v{r.version}</span>
                      {r.is_current === 1 ? (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-2 py-0.5">Đang dùng</Badge>
                      ) : null}
                    </div>
                    <div className="text-xs text-muted-foreground">Phát hành ngày: {new Date(r.created_at).toLocaleDateString('vi-VN')}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    {r.is_current !== 1 && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={() => setReleaseMutation.mutate(r.id)} 
                          disabled={setReleaseMutation.isPending}
                        >
                          Kích hoạt
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            if(confirm(`Bạn có chắc muốn xóa phiên bản ${r.version}? File cài đặt (nếu có) cũng sẽ bị xóa.`)) {
                              deleteReleaseMutation.mutate(r.id)
                            }
                          }}
                          disabled={deleteReleaseMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-foreground/80 line-clamp-2 italic">
                      {r.release_notes || 'Không có mô tả chi tiết cho bản này.'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 pl-4">
                    {r.installer?.exists ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] py-0">
                          File: {(r.installer.size / 1024 / 1024).toFixed(1)} MB
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Tải về file setup">
                          <a href={r.installer.path} download>
                            <DownloadCloud className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] py-0">
                        Thiếu file cài đặt
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
