
import { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useContacts } from "@/hooks/useContacts";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, Upload, FileText, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TagInput } from "@/components/ui/tag-input";
import { useCrmMode } from "@/contexts/CrmModeContext";

interface ImportContactsWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const SYSTEM_FIELDS = [
    { id: "name", label: "Nome Completo (Obrigatório)", required: true },
    { id: "phone", label: "Telefone", required: false },
    { id: "email", label: "Email", required: false },
    { id: "source", label: "Origem", required: false },
    { id: "tags", label: "Tags (separadas por ;)", required: false },
];

export default function ImportContactsWizard({
    open,
    onOpenChange,
}: ImportContactsWizardProps) {
    const { createContact, contacts } = useContacts({});
    const { profile } = useAuth();
    const { mode } = useCrmMode();

    // Deduce available tags
    const availableTags = Array.from(new Set(contacts?.flatMap(c => c.tags || []) || [])).sort();

    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [headers, setHeaders] = useState<string[]>([]);
    const [csvPreview, setCsvPreview] = useState<string[][]>([]);
    const [fullData, setFullData] = useState<string[][]>([]);

    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [batchTags, setBatchTags] = useState<string[]>([]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState({ success: 0, error: 0, total: 0 });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetState = () => {
        setStep(1);
        setFile(null);
        setHeaders([]);
        setCsvPreview([]);
        setFullData([]);
        setMapping({});
        setBatchTags([]);
        setProgress({ success: 0, error: 0, total: 0 });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        // Parse CSV
        const text = await selectedFile.text();
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");

        if (lines.length === 0) {
            toast.error("O arquivo está vazio.");
            return;
        }

        // Naive CSV Split (handles basic quotes?)
        // Better regex for splitter: /,(?=(?:(?:[^"]*"){2})*[^"]*$)/
        const parseLine = (line: string) => {
            const res = [];
            let current = '';
            let inQuote = false;
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    inQuote = !inQuote;
                } else if (char === ',' && !inQuote) {
                    res.push(current.trim().replace(/^"|"$/g, ''));
                    current = '';
                } else {
                    current += char;
                }
            }
            res.push(current.trim().replace(/^"|"$/g, ''));
            return res;
        };

        const parsedData = lines.map(parseLine);
        const headerRow = parsedData[0];
        const dataRows = parsedData.slice(1);

        setHeaders(headerRow);
        setCsvPreview(dataRows.slice(0, 5));
        setFullData(dataRows);

        // Auto-map logic
        const newMapping: Record<string, string> = {};
        SYSTEM_FIELDS.forEach(field => {
            const match = headerRow.find(h => h.toLowerCase().includes(field.id) || h.toLowerCase() === field.label.toLowerCase());
            if (match) newMapping[field.id] = match;
        });
        setMapping(newMapping);
    };

    const handleNext = () => {
        if (step === 1) {
            if (!file) {
                toast.error("Por favor selecione um arquivo.");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            // Validate mapping
            if (!mapping["name"]) {
                toast.error("O campo 'Nome' é obrigatório. Por favor faça o mapeamento.");
                return;
            }
            setStep(3);
        } else if (step === 3) {
            startImport();
        }
    };

    const startImport = async () => {
        setIsProcessing(true);
        if (!profile?.company_id) {
            toast.error("Erro: Identificação da empresa não encontrada. Recarregue a página.");
            setIsProcessing(false);
            return;
        }

        let success = 0;
        let error = 0;

        // Map CSV Index
        const mapIndices: Record<string, number> = {};
        Object.entries(mapping).forEach(([sysField, csvHeader]) => {
            const idx = headers.indexOf(csvHeader);
            if (idx !== -1) mapIndices[sysField] = idx;
        });

        for (const row of fullData) {
            try {
                const nameIdx = mapIndices["name"];
                const name = row[nameIdx];

                if (!name) {
                    error++;
                    continue;
                }

                const phone = mapIndices["phone"] !== undefined ? row[mapIndices["phone"]] : null;
                const email = mapIndices["email"] !== undefined ? row[mapIndices["email"]] : null;
                const source = mapIndices["source"] !== undefined ? row[mapIndices["source"]] : null;
                const tagsRaw = mapIndices["tags"] !== undefined ? row[mapIndices["tags"]] : null;

                let tags: string[] = [];
                if (tagsRaw) tags = tagsRaw.split(";").map(t => t.trim());
                if (batchTags.length > 0) tags.push(...batchTags);

                await createContact.mutateAsync({
                    name: name.trim(),
                    phone: phone?.trim() || null,
                    email: email?.trim() || null,
                    source: source?.trim() || "Importação",
                    company_id: profile.company_id,
                    tags: tags.length > 0 ? tags : null,
                    business_type: mode as any,
                });

                success++;
            } catch (err) {
                console.error("Import error", err);
                error++;
            }
            setProgress({ success, error, total: fullData.length });
        }

        setIsProcessing(false);
        toast.success(`Importação finalizada! ${success} salvos, ${error} erros or duplicados.`);
        onOpenChange(false);
        resetState();
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!isProcessing) { onOpenChange(val); if (!val) resetState(); } }}>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Importar Contatos</DialogTitle>
                    <DialogDescription>
                        Passo {step} de 3
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4">
                    {/* Step 1: Upload */}
                    {step === 1 && (
                        <div className="flex flex-col items-center justify-center space-y-4 h-full border-2 border-dashed rounded-lg p-10">
                            <FileText className="h-10 w-10 text-muted-foreground" />
                            <div className="text-center">
                                <p className="text-sm font-medium">Arraste seu arquivo CSV ou clique para selecionar</p>
                                <p className="text-xs text-muted-foreground mt-1">Limite 5MB</p>
                            </div>
                            <Input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                                Selecionar Arquivo
                            </Button>
                            {file && (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <Check className="h-4 w-4" /> {file.name}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Mapping */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="bg-muted p-3 rounded-md text-sm">
                                <p>Mapeie as colunas do seu arquivo CSV para os campos do sistema.</p>
                            </div>
                            <div className="space-y-4">
                                {SYSTEM_FIELDS.map((field) => (
                                    <div key={field.id} className="grid grid-cols-2 gap-4 items-center">
                                        <Label className={cn(field.required && "font-bold")}>
                                            {field.label} {field.required && "*"}
                                        </Label>
                                        <Select
                                            value={mapping[field.id] || ""}
                                            onValueChange={(val) => setMapping(prev => ({ ...prev, [field.id]: val }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Ignorar campo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {headers.map(h => (
                                                    <SelectItem key={h} value={h}>{h}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-primary/10 p-4 rounded-lg">
                                    <p className="text-2xl font-bold">{fullData.length}</p>
                                    <p className="text-xs text-muted-foreground">Contatos Encontrados</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Etiquetas de Importação (Opcional)</Label>
                                <TagInput
                                    value={batchTags}
                                    onChange={setBatchTags}
                                    suggestions={availableTags}
                                    placeholder="Ex: Importação Outubro 23"
                                />
                                <p className="text-xs text-muted-foreground">Estas tags serão adicionadas a todos os contatos importados.</p>
                            </div>

                            <div className="border rounded-md p-4">
                                <h4 className="font-semibold mb-2 text-sm">Pré-visualização (Primeiros 3)</h4>
                                <Table>
                                    <TableBody>
                                        {csvPreview.slice(0, 3).map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{mapping["name"] ? row[headers.indexOf(mapping["name"])] : "-"}</TableCell>
                                                <TableCell>{mapping["phone"] ? row[headers.indexOf(mapping["phone"])] : "-"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {isProcessing && (
                                <div className="space-y-2 animate-in fade-in">
                                    <Label>Processando... ({progress.success + progress.error} / {progress.total})</Label>
                                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-primary h-full transition-all duration-300"
                                            style={{ width: `${((progress.success + progress.error) / progress.total) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-4">
                    {!isProcessing && (
                        <>
                            {step > 1 && (
                                <Button variant="outline" onClick={() => setStep(step - 1)}>
                                    Voltar
                                </Button>
                            )}
                            {step < 3 ? (
                                <Button onClick={handleNext} disabled={!file}>
                                    Próximo
                                </Button>
                            ) : (
                                <Button onClick={startImport}>
                                    {isProcessing ? <Loader2 className="animate-spin h-4 w-4" /> : "Iniciar Importação"}
                                </Button>
                            )}
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
