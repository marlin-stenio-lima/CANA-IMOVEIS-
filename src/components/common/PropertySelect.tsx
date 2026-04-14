
import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useProperties, Property } from "@/hooks/useProperties"

interface PropertySelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function PropertySelect({ value, onValueChange, placeholder = "Selecione o imóvel..." }: PropertySelectProps) {
  const [open, setOpen] = React.useState(false)
  const { properties = [] } = useProperties()

  const selectedProperty = properties.find((p) => p.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selectedProperty ? (
            <span className="truncate">
              {selectedProperty.internal_id || selectedProperty.code} - {selectedProperty.title}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput placeholder="Buscar por código ou nome..." className="border-none focus:ring-0" />
          </div>
          <CommandEmpty>Nenhum imóvel encontrado.</CommandEmpty>
          <CommandList className="max-h-[300px]">
            <CommandGroup>
              <CommandItem
                value="none"
                onSelect={() => {
                  onValueChange("")
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    !value ? "opacity-100" : "opacity-0"
                  )}
                />
                Nenhum
              </CommandItem>
              {properties.map((property) => (
                <CommandItem
                  key={property.id}
                  value={`${property.internal_id} ${property.title}`}
                  onSelect={() => {
                    onValueChange(property.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === property.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{property.internal_id || property.code} - {property.title}</span>
                    <span className="text-xs text-muted-foreground">{property.city}, {property.neighborhood}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
