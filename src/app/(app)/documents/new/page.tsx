import { CreateDocumentForm } from "@/components/documents/create-form";
import { getSession } from "@/lib/auth";

export default async function NewDocumentPage() {
  const { user } = await getSession();

  if (!user) return null;

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Documento</h1>
        <CreateDocumentForm userId={user.id} />
    </div>
  );
}
