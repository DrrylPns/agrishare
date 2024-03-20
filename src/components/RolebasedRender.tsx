'use client'
import { useSession } from "next-auth/react";


interface RoleBasedRenderProps {
  children: React.ReactNode;
  traderFallback?: React.ReactNode;
}

export function RoleBasedRender({ children, traderFallback }: RoleBasedRenderProps) {
  const { data: session } = useSession();

  if (session?.user?.role === 'DONATOR') {
    return traderFallback ? traderFallback : <div>Not Found</div>;
  }

  return <>{children}</>;
}