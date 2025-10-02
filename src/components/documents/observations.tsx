'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Observacion } from "@/lib/definitions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addObservation } from "@/lib/actions";
import { useToast } from '@/hooks/use-toast';
import { findUserById } from '@/lib/data';
import { User } from '@/lib/definitions';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Send } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Enviando..." : <><Send className="mr-2 h-4 w-4"/> Enviar</>}
        </Button>
    )
}

function ObservationItem({ observation }: { observation: Observacion & { supervisor?: User } }) {
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');
    
    return (
        <div className="flex gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={observation.supervisor?.avatarUrl} />
                <AvatarFallback>{observation.supervisor ? getInitials(observation.supervisor.nombre) : 'S'}</AvatarFallback>
            </Avatar>
            <div className='flex-1'>
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{observation.supervisor?.nombre}</p>
                    <p className="text-xs text-muted-foreground">{new Date(observation.fechaCreacion).toLocaleDateString()}</p>
                </div>
                <p className="text-sm bg-muted p-2 rounded-md mt-1">{observation.texto}</p>
            </div>
        </div>
    )
}

export default function Observations({ observations, documentId, canAddObservation, supervisorId }: { observations: Observacion[], documentId: number, canAddObservation: boolean, supervisorId: number }) {
  const [state, dispatch] = useFormState(addObservation, undefined);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [observationsWithUsers, setObservationsWithUsers] = React.useState<(Observacion & { supervisor?: User })[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
        const obsWithUsers = await Promise.all(observations.map(async (obs) => {
            const supervisor = await findUserById(obs.idUsuarioSupervisor);
            return { ...obs, supervisor };
        }));
        setObservationsWithUsers(obsWithUsers);
    };
    fetchUsers();
  }, [observations])

  useEffect(() => {
    if (state?.message && !state.errors) {
      toast({ title: 'Éxito', description: state.message });
      formRef.current?.reset();
    } else if (state?.errors) {
        toast({ variant: 'destructive', title: 'Error', description: state.message });
    }
  }, [state, toast]);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Observaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {observationsWithUsers.length > 0 ? (
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {observationsWithUsers.map(obs => (
                        <ObservationItem key={obs.id} observation={obs} />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">No hay observaciones para este documento.</p>
            )}

            {canAddObservation && (
                <form action={dispatch} ref={formRef} className="space-y-2 border-t pt-4">
                    <input type="hidden" name="idDocumento" value={documentId} />
                    <input type="hidden" name="idUsuarioSupervisor" value={supervisorId} />
                    <Textarea 
                        name="texto"
                        placeholder="Añadir una observación..."
                        rows={3}
                    />
                    {state?.errors?.texto && <p className="text-sm text-destructive">{state.errors.texto[0]}</p>}
                    <div className="flex justify-end">
                        <SubmitButton />
                    </div>
                </form>
            )}
        </CardContent>
    </Card>
  );
}
