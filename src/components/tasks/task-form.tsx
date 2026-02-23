import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '../ui/button'
import { TAGS, TAG_LABELS, TAG_COLORS } from '../../utils/constants'

export function TaskForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [tag, setTag] = useState<'work' | 'study' | 'sport' | 'leisure'>('work')
  const [targetMinutes, setTargetMinutes] = useState(60)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    
    // TODO: Submit to database
    console.log('Creating task:', { name, tag, targetMinutes })
    
    // Reset form
    setName('')
    setTag('work')
    setTargetMinutes(60)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        新增任务
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      <div className="relative z-50 w-full max-w-md">
        <form 
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">新增任务</h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                任务名称
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="输入任务名称"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TAGS.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTag(t)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      tag === t
                        ? 'border-transparent text-white'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    style={{
                      backgroundColor: tag === t ? 
                        TAG_COLORS[t] : 'transparent'
                    }}
                  >
                    {TAG_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                目标时长（分钟）
              </label>
              <input
                type="number"
                min="5"
                max="480"
                step="5"
                value={targetMinutes}
                onChange={e => setTargetMinutes(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                建议设置25分钟的倍数（番茄钟时长）
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              取消
            </Button>
            <Button type="submit">
              确定
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}