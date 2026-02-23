import { AlertCircle } from 'lucide-react'
import { Button } from './button'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '确认',
  cancelText = '取消',
  variant = 'default',
}: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-50 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <div className="flex items-start space-x-4">
            <div className={`flex-shrink-0 p-2 rounded-full ${
              variant === 'destructive' ? 'bg-red-100' : 'bg-amber-100'
            }`}>
              <AlertCircle className={`h-6 w-6 ${
                variant === 'destructive' ? 'text-red-600' : 'text-amber-600'
              }`} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 mb-6">{description}</p>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-6"
                >
                  {cancelText}
                </Button>
                
                <Button
                  variant={variant === 'destructive' ? 'destructive' : 'default'}
                  onClick={() => {
                    onConfirm()
                    onClose()
                  }}
                  className="px-6"
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}