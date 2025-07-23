import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Castle as CastleIcon, Shield, AlertCircle } from 'lucide-react';

interface Castle {
  id: string;
  name: string;
  updatedAt: Date;
}

export function DashboardPage() {
  const { data: castles, isLoading, error } = useQuery({
    queryKey: ['castles'],
    queryFn: async () => {
      const response = await api.get<{ data: Castle[] }>('/castles');
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">Erro ao carregar castelos</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Meus Castelos</h1>

      {castles?.length === 0 ? (
        <div className="text-center py-12">
          <CastleIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Nenhum castelo encontrado</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {castles?.map((castle) => (
            <Link
              key={castle.id}
              to={`/castle/${castle.id}`}
              className="block rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <CastleIcon className="h-8 w-8 text-primary" />
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{castle.name}</h3>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Ativo</span>
                <span>
                  Atualizado: {new Date(castle.updatedAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}