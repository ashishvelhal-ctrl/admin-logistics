import * as React from 'react'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface SelectOptionProps {
  value: string
  children: React.ReactNode
}

function SelectOption({ value, children }: SelectOptionProps) {
  return (
    <div
      data-slot="select-option"
      data-value={value}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      )}
    >
      {children}
    </div>
  )
}

interface SelectProps {
  className?: string
  children?: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

function Select({
  className,
  children,
  value,
  defaultValue,
  onValueChange,
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(
    value || defaultValue || '',
  )
  const selectRef = React.useRef<HTMLDivElement>(null)

  const handleSelect = (selectedValue: string) => {
    setSelectedValue(selectedValue)
    onValueChange?.(selectedValue)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  return (
    <SelectContext.Provider
      value={{ isOpen, setIsOpen, selectedValue, handleSelect }}
    >
      <div
        data-slot="select"
        className={cn('relative w-full', className)}
        ref={selectRef}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    </SelectContext.Provider>
  )
}

function SelectGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="select-group"
      role="group"
      className={cn('w-full space-y-1', className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<'button'> & {
  size?: 'sm' | 'default'
}) {
  const selectContext = React.useContext(SelectContext)

  return (
    <button
      type="button"
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        'border-input data-[placeholder]:text-muted-foreground flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] focus:border-ring focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      onClick={() => selectContext?.setIsOpen(!selectContext?.isOpen)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-4 opacity-50" />
    </button>
  )
}

function SelectContent({
  className,
  children,
  position = 'item-aligned',
  align = 'center',
  ...props
}: React.ComponentProps<'div'> & {
  position?: 'item-aligned' | 'popper'
  align?: 'start' | 'center' | 'end'
}) {
  const selectContext = React.useContext(SelectContext)

  if (!selectContext?.isOpen) return null

  return (
    <div
      data-slot="select-content"
      className={cn(
        'bg-popover text-popover-foreground absolute top-full left-0 right-0 z-50 max-h-60 min-w-full overflow-x-hidden overflow-y-auto rounded-md border shadow-md p-1 mt-1',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 50,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

function SelectLabel({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot="select-label"
      className={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<'div'> & {
  value: string
}) {
  const selectContext = React.useContext(SelectContext)

  return (
    <div
      data-slot="select-item"
      data-value={value}
      className={cn(
        'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground',
        className,
      )}
      onClick={() => selectContext?.handleSelect(value)}
      {...props}
    >
      {selectContext?.selectedValue === value && (
        <span
          data-slot="select-item-indicator"
          className="absolute right-2 flex size-3.5 items-center justify-center"
        >
          <CheckIcon className="size-4" />
        </span>
      )}
      <span>{children}</span>
    </div>
  )
}

function SelectSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="select-separator"
      className={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      data-slot="select-scroll-up-button"
      className={cn(
        'flex cursor-default items-center justify-center py-1',
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </button>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      data-slot="select-scroll-down-button"
      className={cn(
        'flex cursor-default items-center justify-center py-1',
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </button>
  )
}

function SelectValue({
  className,
  placeholder,
  ...props
}: React.ComponentProps<'span'> & {
  placeholder?: string
}) {
  const selectContext = React.useContext(SelectContext)

  return (
    <span
      data-slot="select-value"
      className={cn('block truncate', className)}
      {...props}
    >
      {selectContext?.selectedValue || placeholder || 'Select...'}
    </span>
  )
}

const SelectContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  selectedValue: string
  handleSelect: (value: string) => void
} | null>(null)

export {
  Select,
  SelectOption,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
