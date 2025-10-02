import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Documento, DocumentoStatus } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';
import { findUserById } from '@/lib/data';

const statusVariant: { [key in DocumentoStatus]: 'default' | 'secondary' | 'destructive' } = {
  'Aprobado': 'default',
  'En Revisión': 'secondary',
  'Rechazado': 'destructive',
};

const statusColors: { [key in DocumentoStatus]: string } = {
    'Aprobado': 'bg-green-100 text-green-800 border-green-200',
    'En Revisión': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Rechazado': 'bg-red-100 text-red-800 border-red-200',
}

export async function DocumentTable({ documents, showEmisor = false }: { documents: Documento[], showEmisor?: boolean }) {
  
  const documentsWithEmisor = showEmisor ? await Promise.all(documents.map(async (doc) => {
    const emisor = await findUserById(doc.idUsuarioEmisor);
    return { ...doc, emisorName: emisor?.nombre || 'Desconocido' };
  })) : documents.map(d => ({ ...d, emisorName: '' }));

  if (documents.length === 0) {
      return <p className="text-muted-foreground mt-4">No se encontraron documentos.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Tipo</TableHead>
          {showEmisor && <TableHead>Emisor</TableHead>}
          <TableHead>Fecha Creación</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documentsWithEmisor.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="font-medium">DOC-{doc.id.toString().padStart(4, '0')}</TableCell>
            <TableCell>{doc.tipoDocumento}</TableCell>
            {showEmisor && <TableCell>{doc.emisorName}</TableCell>}
            <TableCell>{new Date(doc.fechaCreacion).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[doc.estado]} className={cn('text-xs', statusColors[doc.estado])}>
                {doc.estado}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button asChild variant="outline" size="sm">
                <Link href={`/documents/${doc.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> Ver
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
