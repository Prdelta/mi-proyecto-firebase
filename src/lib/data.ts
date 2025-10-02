import type { User, Role, Documento, Observacion, DocumentoStatus } from '@/lib/definitions';
import { PlaceHolderImages } from './placeholder-images';

const roles: Role[] = ['Oficina Emisora', 'Supervisor', 'Gerente'];

const users: User[] = [
  { id: 1, nombre: 'Ana Gómez', email: 'emisor@unap.cl', password: 'password123', rol: 'Oficina Emisora', avatarUrl: PlaceHolderImages.find(p => p.id === 'user1')?.imageUrl ?? '' },
  { id: 2, nombre: 'Carlos Diaz', email: 'supervisor@unap.cl', password: 'password123', rol: 'Supervisor', avatarUrl: PlaceHolderImages.find(p => p.id === 'user2')?.imageUrl ?? '' },
  { id: 3, nombre: 'Beatriz Peña', email: 'gerente@unap.cl', password: 'password123', rol: 'Gerente', avatarUrl: PlaceHolderImages.find(p => p.id === 'user3')?.imageUrl ?? '' },
  { id: 4, nombre: 'David Lara', email: 'emisor2@unap.cl', password: 'password123', rol: 'Oficina Emisora', avatarUrl: PlaceHolderImages.find(p => p.id === 'user4')?.imageUrl ?? '' },
];

let documents: Documento[] = [
  {
    id: 1,
    tipoDocumento: 'Solicitud de Vacaciones',
    estado: 'Aprobado',
    datosFormulario: { 'Nombre Completo': 'Ana Gómez', 'Fecha de Inicio': '2025-11-01', 'Fecha de Fin': '2025-11-10', 'Motivo': 'Vacaciones anuales' },
    fechaCreacion: '2025-10-15T09:00:00Z',
    fechaRevision: '2025-10-16T11:30:00Z',
    idUsuarioEmisor: 1,
    idUsuarioSupervisor: 2,
  },
  {
    id: 2,
    tipoDocumento: 'Reporte de Horas Extra',
    estado: 'En Revisión',
    datosFormulario: { 'Nombre Completo': 'David Lara', 'Fecha': '2025-10-20', 'Horas Realizadas': 5, 'Justificación': 'Cierre de mes' },
    fechaCreacion: '2025-10-21T14:00:00Z',
    fechaRevision: null,
    idUsuarioEmisor: 4,
    idUsuarioSupervisor: 2,
  },
  {
    id: 3,
    tipoDocumento: 'Solicitud de Permiso',
    estado: 'Rechazado',
    datosFormulario: { 'Nombre Completo': 'Ana Gómez', 'Fecha': '2025-10-25', 'Razón': 'Asunto personal urgente' },
    fechaCreacion: '2025-10-22T10:00:00Z',
    fechaRevision: '2025-10-22T15:00:00Z',
    idUsuarioEmisor: 1,
    idUsuarioSupervisor: 2,
  },
  {
    id: 4,
    tipoDocumento: 'Informe de Gastos',
    estado: 'En Revisión',
    datosFormulario: { 'Nombre Completo': 'Ana Gómez', 'Concepto': 'Viaje a conferencia', 'Monto': 350.75, 'Fecha Gasto': '2025-10-18' },
    fechaCreacion: '2025-10-23T11:00:00Z',
    fechaRevision: null,
    idUsuarioEmisor: 1,
    idUsuarioSupervisor: 2,
  },
];

let observations: Observacion[] = [
    { id: 1, texto: 'Falta adjuntar el ticket de embarque.', fechaCreacion: '2025-10-22T15:00:00Z', idDocumento: 3, idUsuarioSupervisor: 2 },
];


// --- User Functions ---
export async function findUserByEmail(email: string): Promise<User | undefined> {
  return users.find(user => user.email === email);
}

export async function findUserById(id: number): Promise<User | undefined> {
  return users.find(user => user.id === id);
}

// --- Document Functions ---
export async function findDocumentsByEmisor(userId: number): Promise<Documento[]> {
  return documents.filter(doc => doc.idUsuarioEmisor === userId).sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
}

export async function findDocumentsByStatus(status: DocumentoStatus): Promise<Documento[]> {
    return documents.filter(doc => doc.estado === status).sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime());
}

export async function findDocumentById(docId: number): Promise<Documento | undefined> {
    return documents.find(doc => doc.id === docId);
}

export async function findAllDocuments(): Promise<Documento[]> {
    return [...documents].sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
}

export async function saveDocument(documento: Omit<Documento, 'id' | 'fechaCreacion' | 'fechaRevision' | 'estado'>): Promise<Documento> {
    const newId = documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1;
    const newDocument: Documento = {
        ...documento,
        id: newId,
        estado: 'En Revisión',
        fechaCreacion: new Date().toISOString(),
        fechaRevision: null,
    };
    documents.push(newDocument);
    return newDocument;
}

export async function updateDocumentStatus(docId: number, estado: DocumentoStatus, supervisorId: number): Promise<Documento | undefined> {
    const docIndex = documents.findIndex(d => d.id === docId);
    if (docIndex > -1) {
        documents[docIndex].estado = estado;
        documents[docIndex].fechaRevision = new Date().toISOString();
        documents[docIndex].idUsuarioSupervisor = supervisorId;
        return documents[docIndex];
    }
    return undefined;
}


// --- Observation Functions ---
export async function findObservationsByDocument(docId: number): Promise<Observacion[]> {
    return observations.filter(obs => obs.idDocumento === docId).sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime());
}

export async function saveObservation(observacion: Omit<Observacion, 'id' | 'fechaCreacion'>): Promise<Observacion> {
    const newId = observations.length > 0 ? Math.max(...observations.map(o => o.id)) + 1 : 1;
    const newObservation: Observacion = {
        ...observacion,
        id: newId,
        fechaCreacion: new Date().toISOString(),
    };
    observations.push(newObservation);
    return newObservation;
}
