'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/shared/date-range-picker';
import { Documento, DocumentoStatus } from '@/lib/definitions';
import { useEffect, useMemo, useState } from 'react';
import { findAllDocuments } from '@/lib/data';
import { subDays } from 'date-fns';

export default function GerenteDashboard() {
    const [allDocuments, setAllDocuments] = useState<Documento[]>([]);
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });

    useEffect(() => {
        const fetchDocs = async () => {
            const docs = await findAllDocuments();
            setAllDocuments(docs);
        }
        fetchDocs();
    }, []);

    const filteredDocuments = useMemo(() => {
        if (!date?.from || !date?.to) return [];
        return allDocuments.filter(doc => {
            const docDate = new Date(doc.fechaCreacion);
            return docDate >= date.from! && docDate <= date.to!;
        });
    }, [allDocuments, date]);
    
    const chartData = useMemo(() => {
        const dataByStatus: Record<DocumentoStatus, number> = {
            'Aprobado': 0,
            'Rechazado': 0,
            'En Revisión': 0,
        };

        filteredDocuments.forEach(doc => {
            if (dataByStatus[doc.estado] !== undefined) {
                dataByStatus[doc.estado]++;
            }
        });
        
        return [
            { name: 'Aprobado', count: dataByStatus['Aprobado'], fill: 'hsl(var(--chart-2))' },
            { name: 'En Revisión', count: dataByStatus['En Revisión'], fill: 'hsl(var(--chart-4))' },
            { name: 'Rechazado', count: dataByStatus['Rechazado'], fill: 'hsl(var(--chart-5))' }
        ];

    }, [filteredDocuments]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <CardTitle>Reporte de Documentos</CardTitle>
                <CardDescription>Análisis del estado de los documentos en el período seleccionado.</CardDescription>
            </div>
            <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </CardHeader>
      <CardContent>
        {filteredDocuments.length > 0 ? (
          <ChartContainer config={{}} className="h-[300px] w-full">
            <BarChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis allowDecimals={false}/>
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
            <div className="flex h-[300px] w-full items-center justify-center">
                <p className="text-muted-foreground">No hay datos para el período seleccionado.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
