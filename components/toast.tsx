"use client"

import { useState, useEffect } from "react"
import { CheckCircle, X, AlertCircle, Info } from "lucide-react"

export interface Toast {
  id: string
  type: "success" | "error" | "info"
  title: string
  message?: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastComponent({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, toast.duration || 3000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  }

  const Icon = icons[toast.type]

  return (
    <div
      className={`${colors[toast.type]} border rounded-lg p-4 shadow-lg animate-in slide-in-from-right-full duration-300`}
    >
      <div className="flex items-start">
        <Icon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium">{toast.title}</h4>
          {toast.message && <p className="text-sm mt-1">{toast.message}</p>}
        </div>
        <button onClick={() => onRemove(toast.id)} className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handleToast = (event: CustomEvent<Toast>) => {
      const newToast = { ...event.detail, id: Date.now().toString() }
      setToasts((prev) => [...prev, newToast])
    }

    window.addEventListener("show-toast" as any, handleToast)
    return () => window.removeEventListener("show-toast" as any, handleToast)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  )
}

export function showToast(toast: Omit<Toast, "id">) {
  window.dispatchEvent(new CustomEvent("show-toast", { detail: toast }))
}
