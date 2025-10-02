import { Building } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-xl font-bold text-foreground", className)}>
      <Building className="h-6 w-6 text-primary" />
      <span>UNAP Docs</span>
    </div>
  );
}
