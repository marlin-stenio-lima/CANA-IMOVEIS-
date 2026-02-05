
import * as React from "react";
import { X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandEmpty,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TagInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    suggestions?: string[];
    placeholder?: string;
    className?: string;
}

export function TagInput({
    value = [],
    onChange,
    suggestions = [],
    placeholder = "Selecionar tags...",
    className,
}: TagInputProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    const handleUnselect = (tag: string) => {
        onChange(value.filter((t) => t !== tag));
    };

    const handleSelect = (tag: string) => {
        if (value.includes(tag)) {
            handleUnselect(tag);
        } else {
            onChange([...value, tag]);
        }
        setInputValue("");
        setOpen(false);
    };

    const filteredSuggestions = suggestions.filter(
        (s) => !value.includes(s) && s.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div className={cn("flex flex-wrap gap-2 w-full", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div className="flex flex-wrap gap-1 items-center border rounded-md px-3 py-2 text-sm min-h-[40px] w-full cursor-text bg-background ring-offset-background cursor-pointer focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        {value.map((tag) => (
                            <Badge key={tag} variant="secondary" className="mr-1 mb-1">
                                {tag}
                                <button
                                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleUnselect(tag);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleUnselect(tag)}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        ))}
                        <input
                            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
                            placeholder={value.length > 0 ? "" : placeholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onClick={() => setOpen(true)}
                        />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                        {/* We hide the command input and use our own external input/trigger logic mostly, 
                but keeping CommandInput hidden ensures the filter logic works if we wanted standard command behavior. 
                However, for custom creation, we rely on state. 
             */}
                        <CommandList>
                            {inputValue.length > 0 && !suggestions.includes(inputValue) && !value.includes(inputValue) && (
                                <CommandGroup heading="Criar nova tag">
                                    <CommandItem
                                        onSelect={() => handleSelect(inputValue)}
                                        className="cursor-pointer"
                                    >
                                        <Check className="mr-2 h-4 w-4 opacity-0" />
                                        Criar "{inputValue}"
                                    </CommandItem>
                                </CommandGroup>
                            )}

                            <CommandGroup heading="Sugestões">
                                {filteredSuggestions.map((suggestion) => (
                                    <CommandItem
                                        key={suggestion}
                                        onSelect={() => handleSelect(suggestion)}
                                        className="cursor-pointer"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value.includes(suggestion) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {suggestion}
                                    </CommandItem>
                                ))}
                                {filteredSuggestions.length === 0 && inputValue.length === 0 && (
                                    <div className="text-sm text-muted-foreground p-2 text-center">Digite para buscar ou criar...</div>
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
