'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { findUserByEmail, saveDocument, updateDocumentStatus, saveObservation, findDocumentsByEmisor } from '@/lib/data';
import { createSession, deleteSession } from '@/lib/auth';
import { getFormCompletionSuggestions } from '@/ai/flows/form-completion-suggestions';
import { Documento } from './definitions';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Por favor, ingrese un correo válido.' }),
  password: z.string().min(1, { message: 'La contraseña es obligatoria.' }),
});

export async function login(prevState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await findUserByEmail(email);

    if (!user || user.password !== password) {
      return { message: 'Credenciales inválidas.' };
    }

    await createSession(user.id);
  } catch (error) {
    return { message: 'Error al iniciar sesión.' };
  }

  redirect('/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}

const CreateDocumentSchema = z.object({
  tipoDocumento: z.string().min(1, 'El tipo de documento es requerido'),
  idUsuarioEmisor: z.coerce.number(),
  // All other fields are dynamic
}).catchall(z.any());

export async function createDocument(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    
    const validatedFields = CreateDocumentSchema.safeParse(rawData);

    if (!validatedFields.success) {
        throw new Error('Error de validación del documento.');
    }
    
    const { idUsuarioEmisor, tipoDocumento, ...datosFormulario } = validatedFields.data;

    await saveDocument({
        idUsuarioEmisor,
        tipoDocumento,
        datosFormulario,
        idUsuarioSupervisor: null
    });

    revalidatePath('/dashboard');
    redirect('/dashboard');
}

export async function approveDocument(documentId: number, supervisorId: number) {
    await updateDocumentStatus(documentId, 'Aprobado', supervisorId);
    revalidatePath(`/documents/${documentId}`);
    revalidatePath('/dashboard');
}

export async function rejectDocument(documentId: number, supervisorId: number) {
    await updateDocumentStatus(documentId, 'Rechazado', supervisorId);
    revalidatePath(`/documents/${documentId}`);
    revalidatePath('/dashboard');
}

const ObservationSchema = z.object({
    texto: z.string().min(1, 'La observación no puede estar vacía.'),
    idDocumento: z.coerce.number(),
    idUsuarioSupervisor: z.coerce.number(),
});

export async function addObservation(prevState: any, formData: FormData) {
    const validatedFields = ObservationSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Error de validación.',
        };
    }
    
    await saveObservation(validatedFields.data);

    revalidatePath(`/documents/${validatedFields.data.idDocumento}`);
    return { message: 'Observación agregada.' };
}


export async function getFormSuggestions(documentType: string, currentData: Record<string, any>, userId: number) {
  try {
    const previousDocs = await findDocumentsByEmisor(userId);
    const previousFormData = previousDocs
      .filter(doc => doc.tipoDocumento === documentType)
      .map(doc => doc.datosFormulario);

    const suggestions = await getFormCompletionSuggestions({
      documentType,
      formData: currentData,
      previousFormData: previousFormData.slice(0, 5), // Limit to last 5 for context window
    });
    
    return { success: true, suggestions };
  } catch (error) {
    console.error("AI suggestion error:", error);
    return { success: false, message: "No se pudieron obtener sugerencias." };
  }
}
