import * as React from 'react'
import { XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

const DialogContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

function Dialog({
  children,
  className,
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<'div'> & {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = React.useState(false)

  // Use external state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  // Close dialog when clicking outside or pressing Escape
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, setOpen])

  if (!isOpen) return null

  return (
    <DialogContext.Provider value={{ open: isOpen, setOpen }}>
      <div
        data-slot="dialog"
        className="fixed inset-0 z-50 flex items-center justify-center"
        {...props}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setOpen(false)}
        />

        {/* Dialog Content */}
        {children}
      </div>
    </DialogContext.Provider>
  )
}

function DialogTrigger({
  children,
  className,
  onClick,
  ...props
}: React.ComponentProps<'button'>) {
  const dialogContext = React.useContext(DialogContext)

  return (
    <button
      type="button"
      data-slot="dialog-trigger"
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      onClick={(e) => {
        onClick?.(e)
        dialogContext?.setOpen(true)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

function DialogPortal({ children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="dialog-portal" {...props}>
      {children}
    </div>
  )
}

function DialogClose({
  children,
  className,
  onClick,
  ...props
}: React.ComponentProps<'button'>) {
  const dialogContext = React.useContext(DialogContext)

  return (
    <button
      type="button"
      data-slot="dialog-close"
      className={cn(
        'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none',
        className,
      )}
      onClick={(e) => {
        onClick?.(e)
        dialogContext?.setOpen(false)
      }}
      {...props}
    >
      {children || <XIcon className="h-4 w-4" />}
    </button>
  )
}

function DialogOverlay({ className, ...props }: React.ComponentProps<'div'>) {
  const dialogContext = React.useContext(DialogContext)

  if (!dialogContext?.open) return null

  return (
    <div
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
        className,
      )}
      onClick={() => dialogContext?.setOpen(false)}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const dialogContext = React.useContext(DialogContext)
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Close dialog when clicking outside content
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        dialogContext?.setOpen(false)
      }
    }

    if (dialogContext?.open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dialogContext?.open, dialogContext?.setOpen])

  if (!dialogContext?.open) return null

  return (
    <div
      ref={contentRef}
      data-slot="dialog-content"
      className={cn(
        'relative z-50 bg-background shadow-lg duration-200',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        'flex flex-col space-y-1.5 text-center sm:text-left',
        className,
      )}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className,
      )}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn(
        'text-lg font-semibold leading-none tracking-tight',
        className,
      )}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="dialog-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
