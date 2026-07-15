import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { uploadCarImages } from '../../api/uploads'

interface CarImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
}

export function CarImageUpload({ images, onChange }: CarImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = async (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []).filter((f) =>
      f.type.startsWith('image/'),
    )
    if (!files.length) return

    setError('')
    setUploading(true)
    try {
      const urls = await uploadCarImages(files)
      onChange([...images, ...urls])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="sm:col-span-2">
      <p className="mb-2 text-sm font-semibold text-dark">Car images</p>
      <p className="mb-3 text-xs text-muted">
        Upload multiple photos (JPG, PNG, WebP). Max 5 MB each, up to 10 images.
      </p>

      {error && (
        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
          >
            <img src={url} alt={`Car ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-dark/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          disabled={uploading || images.length >= 10}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-muted transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <ImagePlus className="h-6 w-6" />
          )}
          <span className="text-xs font-semibold">
            {uploading ? 'Uploading…' : 'Add images'}
          </span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
