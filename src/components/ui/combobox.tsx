
import * as React from "react"
import { CheckIcon, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  items: { value: string; label: string }[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  emptyMessage?: string
}

export function Combobox({
  items = [], // Default to empty array to avoid undefined
  value,
  onValueChange,
  placeholder = "Select an option",
  className,
  disabled = false,
  emptyMessage = "No items found."
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  // Ensure items is always a valid array
  const safeItems = React.useMemo(() => {
    return Array.isArray(items) ? items : [];
  }, [items]);

  const selected = React.useMemo(() => {
    return safeItems.find(item => item.value === value);
  }, [safeItems, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
          disabled={disabled}
        >
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 max-h-[300px] w-full bg-popover z-50">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-[220px] overflow-auto">
            {safeItems.map(item => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={() => {
                  onValueChange(item.value === value ? "" : item.value)
                  setOpen(false)
                }}
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
