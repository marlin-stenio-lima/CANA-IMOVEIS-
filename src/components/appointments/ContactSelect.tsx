import * as React from "react"
import { Check, ChevronsUpDown, Search, User } from "lucide-react"
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
import { supabase } from "@/integrations/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ContactSelectProps {
    value: string;
    onChange: (value: string, contact: any) => void;
}

export function ContactSelect({ value, onChange }: ContactSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [contacts, setContacts] = React.useState<any[]>([])
    const [search, setSearch] = React.useState("")
    const [selectedLabel, setSelectedLabel] = React.useState("")

    React.useEffect(() => {
        const fetchContacts = async () => {
            // Only fetch if we have a search term or initial load (limit 10)
            let query = supabase.from('contacts').select('id, name, phone').limit(10);

            if (search) {
                query = supabase.from('contacts').select('id, name, phone')
                    .or(`name.ilike.%${search}%,phone.ilike.%${search}%`)
                    .limit(20);
            }

            const { data, error } = await query;
            if (data) {
                setContacts(data);
                // If value exists, try to set label if found in search, else silent (we might need to fetch specific ID if not in list)
                if (value) {
                    const found = data.find((c: any) => c.id === value);
                    if (found) setSelectedLabel(found.name);
                }
            }
        }
        fetchContacts();
    }, [search, value]) // Re-run on search or value change (to sync label)

    // Fetch specific contact if value is set but label is missing (initial state)
    React.useEffect(() => {
        if (value && !selectedLabel) {
            const fetchOne = async () => {
                const { data } = await supabase.from('contacts').select('name').eq('id', value).single();
                if (data) setSelectedLabel(data.name);
            }
            fetchOne();
        }
    }, [value, selectedLabel]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedLabel ? (
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 opacity-50" />
                            {selectedLabel}
                        </div>
                    ) : (
                        "Selecione um cliente..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command shouldFilter={false}> {/* Server-side filtering */}
                    <CommandInput
                        placeholder="Buscar por nome ou telefone..."
                        onValueChange={setSearch}
                        value={search}
                    />
                    <CommandList>
                        <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                        <CommandGroup>
                            {contacts.map((contact) => (
                                <CommandItem
                                    key={contact.id}
                                    value={contact.id} // We use ID as value for key but selection logic uses onClick
                                    onSelect={() => {
                                        onChange(contact.id, contact)
                                        setSelectedLabel(contact.name)
                                        setOpen(false)
                                    }}
                                    className="cursor-pointer"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === contact.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback className="text-[10px]">{contact.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{contact.name}</span>
                                            <span className="text-xs text-muted-foreground">{contact.phone}</span>
                                        </div>
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
