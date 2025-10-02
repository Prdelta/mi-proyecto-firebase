import { approveDocument, rejectDocument } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

export default function ApprovalActions({ documentId, supervisorId }: { documentId: number, supervisorId: number }) {
  const approveAction = approveDocument.bind(null, documentId, supervisorId);
  const rejectAction = rejectDocument.bind(null, documentId, supervisorId);
  
  return (
    <Card>
        <CardHeader>
            <CardTitle>Acciones de Revisión</CardTitle>
            <CardDescription>Aprobar o rechazar el documento. Esta acción es final.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
            <form action={approveAction} className="flex-1">
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Aprobar
                </Button>
            </form>
            <form action={rejectAction} className="flex-1">
                <Button type="submit" variant="destructive" className="w-full">
                    <XCircle className="mr-2 h-4 w-4" />
                    Rechazar
                </Button>
            </form>
        </CardContent>
    </Card>
  );
}
