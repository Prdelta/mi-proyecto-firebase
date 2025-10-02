import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { FilePlus } from 'lucide-react';
import { DocumentTable } from './document-table';
import { findDocumentsByEmisor } from '@/lib/data';

export default async function EmisorDashboard({ userId }: { userId: number }) {
  const documents = await findDocumentsByEmisor(userId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Mis Documentos Enviados</CardTitle>
          <CardDescription>Historial de sus documentos y su estado actual.</CardDescription>
        </div>
        <Button asChild>
          <Link href="/documents/new">
            <FilePlus className="mr-2 h-4 w-4" />
            Crear Documento
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <DocumentTable documents={documents} />
      </CardContent>
    </Card>
  );
}
