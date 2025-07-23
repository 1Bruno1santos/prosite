import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { castleSettingsSchema, type CastleSettingsInput } from '@prosite/shared';
import { api } from '@/lib/api';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

interface CastleDetails {
  id: string;
  name: string;
  settings: CastleSettingsInput;
  updatedAt: Date;
}

export function CastlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const { data: castle, isLoading, error } = useQuery({
    queryKey: ['castle', id],
    queryFn: async () => {
      const response = await api.get<{ data: CastleDetails }>(`/castles/${id}`);
      return response.data.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CastleSettingsInput>({
    resolver: zodResolver(castleSettingsSchema),
    values: castle?.settings,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CastleSettingsInput) => {
      await api.put(`/castles/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['castle', id] });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const onSubmit = (data: CastleSettingsInput) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !castle) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">Erro ao carregar castelo</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-primary hover:underline mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </button>

      <h1 className="text-3xl font-bold mb-8">{castle.name}</h1>

      {success && (
        <div className="mb-6 rounded-lg border border-green-500/50 bg-green-500/10 p-4">
          <p className="text-sm text-green-600">Configurações salvas com sucesso!</p>
        </div>
      )}

      {updateMutation.isError && (
        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">Erro ao salvar configurações</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Configurações Gerais</h2>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('autoFight')}
                className="rounded border-input"
              />
              <span>Auto Fight</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('autoUpgrade')}
                className="rounded border-input"
              />
              <span>Auto Upgrade</span>
            </label>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('autoCollect')}
                className="rounded border-input"
              />
              <span>Auto Collect</span>
            </label>
          </div>

          <div>
            <label htmlFor="maxTroops" className="block text-sm font-medium mb-1">
              Máximo de Tropas
            </label>
            <input
              type="number"
              {...register('maxTroops', { valueAsNumber: true })}
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {errors.maxTroops && (
              <p className="mt-1 text-sm text-destructive">{errors.maxTroops.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="defenseStrategy" className="block text-sm font-medium mb-1">
              Estratégia de Defesa
            </label>
            <select
              {...register('defenseStrategy')}
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="aggressive">Agressiva</option>
              <option value="defensive">Defensiva</option>
              <option value="balanced">Balanceada</option>
            </select>
            {errors.defenseStrategy && (
              <p className="mt-1 text-sm text-destructive">{errors.defenseStrategy.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isDirty || updateMutation.isPending}
          className="flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="mr-2 h-4 w-4" />
          {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}