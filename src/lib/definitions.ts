export type Role = 'Oficina Emisora' | 'Supervisor' | 'Gerente';

export type User = {
  id: number;
  nombre: string;
  email: string;
  password: string; // This would be a hash in a real app
  rol: Role;
  avatarUrl: string;
};

export type DocumentoStatus = 'En Revisión' | 'Aprobado' | 'Rechazado';

export type Documento = {
  id: number;
  tipoDocumento: string;
  estado: DocumentoStatus;
  datosFormulario: Record<string, any>;
  fechaCreacion: string;
  fechaRevision: string | null;
  idUsuarioEmisor: number;
  idUsuarioSupervisor: number | null;
};

export type Observacion = {
  id: number;
  texto: string;
  fechaCreacion: string;
  idDocumento: number;
  idUsuarioSupervisor: number;
};

export const DocumentTypes = [
  'Solicitud de Vacaciones',
  'Reporte de Horas Extra',
  'Solicitud de Permiso',
  'Informe de Gastos',
  'Actualización de Datos Personales',
  'Solicitud de Capacitación',
  'Evaluación de Desempeño',
];
