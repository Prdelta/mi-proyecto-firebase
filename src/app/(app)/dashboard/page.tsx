import { getSession } from "@/lib/auth";
import { findDocumentsByEmisor, findDocumentsByStatus, findAllDocuments } from "@/lib/data";
import EmisorDashboard from "@/components/dashboard/emisor-dashboard";
import SupervisorDashboard from "@/components/dashboard/supervisor-dashboard";
import GerenteDashboard from "@/components/dashboard/gerente-dashboard";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardSkeleton() {
    return (
        <Card>
            <CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader>
            <CardContent>
                <Skeleton className="h-40 w-full" />
            </CardContent>
        </Card>
    );
}

export default async function DashboardPage() {
    const { user } = await getSession();

    if (!user) {
        return redirect('/login');
    }

    const renderDashboard = () => {
        switch (user.rol) {
            case 'Oficina Emisora':
                return <EmisorDashboard userId={user.id} />;
            case 'Supervisor':
                return <SupervisorDashboard />;
            case 'Gerente':
                return <GerenteDashboard />;
            default:
                return <div>Rol no reconocido.</div>;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard de {user.rol}</h1>
            <Suspense fallback={<DashboardSkeleton />}>
                {renderDashboard()}
            </Suspense>
        </div>
    );
}

