import { IntegrationManager } from "@/components/settings/IntegrationManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WhatsApp() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">WhatsApp</h1>
                <p className="text-muted-foreground">Gerencie as conexões e instâncias do WhatsApp da sua equipe.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Conexões Ativas</CardTitle>
                    <CardDescription>Escaneie o QR Code para conectar novos números.</CardDescription>
                </CardHeader>
                <CardContent>
                    <IntegrationManager />
                </CardContent>
            </Card>
        </div>
    );
}
