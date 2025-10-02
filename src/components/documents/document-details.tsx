import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Documento, User } from "@/lib/definitions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const statusColors = {
    'Aprobado': 'bg-green-100 text-green-800 border-green-200',
    'En Revisión': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Rechazado': 'bg-red-100 text-red-800 border-red-200',
}

function UserDisplay({ user, role }: { user: User | null | undefined, role: string}) {
    if (!user) return <p className="text-sm text-muted-foreground">No asignado</p>;
    
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

    return (
        <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatarUrl} alt={user.nombre} />
                <AvatarFallback>{getInitials(user.nombre)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{user.nombre}</p>
                <p className="text-sm text-muted-foreground">{role}</p>
            </div>
        </div>
    )
}

export default function DocumentDetails({ document, emisor, supervisor }: { document: Documento, emisor?: User, supervisor?: User | null }) {
    
  return (
    <>
    <Card>
        <CardHeader>
            <div className="flex items-start justify-between">
                <div>
                    <CardTitle>{document.tipoDocumento}</CardTitle>
                    <CardDescription>ID: DOC-{document.id.toString().padStart(4, '0')}</CardDescription>
                </div>
                <Badge className={cn("text-sm", statusColors[document.estado])}>{document.estado}</Badge>
            </div>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Emisor</h4>
                    <UserDisplay user={emisor} role="Oficina Emisora" />
                </div>
                 <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Supervisor</h4>
                    <UserDisplay user={supervisor} role="Supervisor" />
                </div>
            </div>
             <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Fecha de Creación</p>
                    <p>{new Date(document.fechaCreacion).toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Última Revisión</p>
                    <p>{document.fechaRevision ? new Date(document.fechaRevision).toLocaleString() : 'N/A'}</p>
                </div>
            </div>
        </CardContent>
    </Card>
    <Card>
        <CardHeader>
            <CardTitle>Datos del Formulario</CardTitle>
        </CardHeader>
        <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                {Object.entries(document.datosFormulario).map(([key, value]) => (
                    <div key={key} className="border-b pb-2">
                        <dt className="text-sm font-medium text-muted-foreground">{key}</dt>
                        <dd className="mt-1 text-md text-foreground">{String(value)}</dd>
                    </div>
                ))}
            </dl>
        </CardContent>
    </Card>
    </>
  );
}
