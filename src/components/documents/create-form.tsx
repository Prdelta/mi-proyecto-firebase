'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createDocument, getFormSuggestions } from '@/lib/actions';
import { DocumentTypes } from '@/lib/definitions';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  tipoDocumento: z.string({
    required_error: 'Por favor seleccione un tipo de documento.',
  }),
}).catchall(z.any());

const formFieldsConfig: Record<string, string[]> = {
  'Solicitud de Vacaciones': ['Nombre Completo', 'Fecha de Inicio', 'Fecha de Fin', 'Motivo'],
  'Reporte de Horas Extra': ['Nombre Completo', 'Fecha', 'Horas Realizadas', 'Justificación'],
  'Solicitud de Permiso': ['Nombre Completo', 'Fecha', 'Razón'],
  'Informe de Gastos': ['Nombre Completo', 'Concepto', 'Monto', 'Fecha Gasto'],
  'Actualización de Datos Personales': ['Nombre Completo', 'Dirección', 'Teléfono', 'Email de Contacto'],
  'Solicitud de Capacitación': ['Nombre Completo', 'Nombre del Curso', 'Institución', 'Justificación'],
  'Evaluación de Desempeño': ['Nombre del Empleado', 'Período de Evaluación', 'Fortalezas', 'Áreas de Mejora'],
};


export function CreateDocumentForm({ userId }: { userId: number }) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [isAiPending, startAiTransition] = useTransition();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tipoDocumento: '',
    },
  });
  const { toast } = useToast();

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    form.setValue('tipoDocumento', type);
    // Reset other fields when type changes
    const currentValues = form.getValues();
    const newValues: Record<string, any> = { tipoDocumento: type };
    for (const key in currentValues) {
        if (key !== 'tipoDocumento') {
            newValues[key] = '';
        }
    }
    form.reset(newValues);
  };

  const handleGetSuggestions = () => {
    startAiTransition(async () => {
      const currentData = form.getValues();
      const result = await getFormSuggestions(selectedType, currentData, userId);
      if (result.success && result.suggestions) {
        // Only update fields that are empty
        const suggestedData = result.suggestions as Record<string, any>;
        Object.keys(suggestedData).forEach(key => {
            if (!form.getValues(key)) {
                form.setValue(key, suggestedData[key]);
            }
        });
        toast({ title: 'Sugerencias aplicadas', description: 'Se han completado algunos campos con ayuda de la IA.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  }

  const currentFields = formFieldsConfig[selectedType] || [];

  return (
    <Card>
      <Form {...form}>
        <form action={createDocument} className="space-y-6">
          <input type="hidden" name="idUsuarioEmisor" value={userId} />
          <CardHeader>
            <CardTitle>Detalles del Documento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="tipoDocumento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <Select onValueChange={handleTypeChange} defaultValue={field.value} name={field.name}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un tipo de documento..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DocumentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedType && (
              <>
                {currentFields.map(fieldName => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldName}</FormLabel>
                        <FormControl>
                          <Input placeholder={`Ingrese ${fieldName.toLowerCase()}`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
                type="button" 
                variant="outline"
                onClick={handleGetSuggestions}
                disabled={!selectedType || isAiPending}
            >
                {isAiPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Sugerencias con IA
            </Button>
            <Button type="submit" disabled={!selectedType}>Enviar Documento</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
