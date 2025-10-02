import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DocumentTable } from './document-table';
import { findDocumentsByStatus } from '@/lib/data';

export default async function SupervisorDashboard() {
  const documents = await findDocumentsByStatus('En Revisión');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos Pendientes de Revisión</CardTitle>
        <CardDescription>Documentos que requieren su aprobación o rechazo.</CardDescription>
      </CardHeader>
      <CardContent>
        <DocumentTable documents={documents} showEmisor={true}/>
      </CardContent>
    </Card>
  );
}
