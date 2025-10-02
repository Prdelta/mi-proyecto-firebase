import { notFound, redirect } from 'next/navigation';
import { findDocumentById, findUserById, findObservationsByDocument } from '@/lib/data';
import { getSession } from '@/lib/auth';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import DocumentDetails from '@/components/documents/document-details';
import ApprovalActions from '@/components/documents/approval-actions';
import Observations from '@/components/documents/observations';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function DetailsSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-1/4" />
            <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        </div>
    )
}

export default async function DocumentPage({ params }: { params: { id: string } }) {
  const { user } = await getSession();
  if (!user) redirect('/login');

  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const document = await findDocumentById(id);
  if (!document) notFound();

  const emisor = await findUserById(document.idUsuarioEmisor);
  const supervisor = document.idUsuarioSupervisor ? await findUserById(document.idUsuarioSupervisor) : null;
  const observations = await findObservationsByDocument(id);

  const canTakeAction = user.rol === 'Supervisor' && document.estado === 'En Revisión';

  return (
    <Suspense fallback={<DetailsSkeleton />}>
        <div className="space-y-6">
        <Breadcrumb>
            <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbPage>Documento DOC-{document.id.toString().padStart(4, '0')}</BreadcrumbPage>
            </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
                <DocumentDetails document={document} emisor={emisor} supervisor={supervisor} />
                {canTakeAction && <ApprovalActions documentId={document.id} supervisorId={user.id} />}
            </div>
            <div className="space-y-6">
                <Observations 
                    documentId={document.id}
                    observations={observations}
                    canAddObservation={canTakeAction}
                    supervisorId={user.id}
                />
            </div>
        </div>
        </div>
    </Suspense>
  );
}
