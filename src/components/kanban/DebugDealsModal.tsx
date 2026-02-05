import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function DebugDealsModal({ deals, filters, pipelineId }: { deals: any[], filters: any, pipelineId: string | null }) {
    const { user, profile } = useAuth();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground border-dashed">
                    <Bug className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Debug Info</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted rounded">
                            <h3 className="font-bold">Summary</h3>
                            <p>Pipeline ID: {pipelineId}</p>
                            <p>Total Deals Fetched: {deals.length}</p>
                        </div>
                        <div className="p-4 bg-muted rounded">
                            <h3 className="font-bold">Active Filters</h3>
                            <pre className="text-xs">{JSON.stringify(filters, null, 2)}</pre>
                        </div>
                        <div className="p-4 bg-muted rounded col-span-2">
                            <h3 className="font-bold">User Context</h3>
                            <p className="text-xs">User ID: {user?.id}</p>
                            <p className="text-xs">Email: {user?.email}</p>
                            <p className="text-xs">Company ID: {profile?.company_id}</p>
                            <p className="text-xs">Role: {profile?.job_title}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold mb-2">Last 3 Deals (Raw JSON)</h3>
                        {deals.slice(0, 3).map(deal => (
                            <div key={deal.id} className="mb-4 p-2 border rounded bg-slate-50 dark:bg-slate-900 text-xs font-mono overflow-auto">
                                <pre>{JSON.stringify(deal, null, 2)}</pre>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
