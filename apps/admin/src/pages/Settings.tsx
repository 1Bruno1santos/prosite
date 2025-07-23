import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import {
  Settings as SettingsIcon,
  Mail,
  Bell,
  Shield,
  Database,
  Server,
  Save,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';

interface SettingsForm {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
  };
  notifications: {
    emailOnNewClient: boolean;
    emailOnClientSuspension: boolean;
    emailOnSystemError: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireStrongPassword: boolean;
  };
  system: {
    maintenanceMode: boolean;
    debugMode: boolean;
    logRetentionDays: number;
  };
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('smtp');

  const { register, handleSubmit, formState: { errors } } = useForm<SettingsForm>({
    defaultValues: {
      smtp: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        user: '',
        pass: '',
      },
      notifications: {
        emailOnNewClient: true,
        emailOnClientSuspension: true,
        emailOnSystemError: true,
      },
      security: {
        sessionTimeout: 720, // 12 hours
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        requireStrongPassword: true,
      },
      system: {
        maintenanceMode: false,
        debugMode: false,
        logRetentionDays: 30,
      },
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: SettingsForm) => {
      await api.put('/admin/settings', data);
    },
  });

  const onSubmit = (data: SettingsForm) => {
    updateSettingsMutation.mutate(data);
  };

  const tabs = [
    { id: 'smtp', name: 'Email', icon: Mail },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'system', name: 'Sistema', icon: Server },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
        <p className="mt-1 text-sm text-gray-600">
          Gerencie as configurações do sistema
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {activeTab === 'smtp' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Configurações de Email (SMTP)
              </h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Host SMTP
                  </label>
                  <input
                    type="text"
                    {...register('smtp.host', { required: 'Host é obrigatório' })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.smtp?.host && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.smtp.host.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Porta
                  </label>
                  <input
                    type="number"
                    {...register('smtp.port', { required: 'Porta é obrigatória' })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Usuário
                  </label>
                  <input
                    type="text"
                    {...register('smtp.user')}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <input
                    type="password"
                    {...register('smtp.pass')}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('smtp.secure')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Usar conexão segura (TLS/SSL)
                </label>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Notificações por Email
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('notifications.emailOnNewClient')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Notificar quando um novo cliente se cadastrar
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('notifications.emailOnClientSuspension')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Notificar quando um cliente for suspenso
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('notifications.emailOnSystemError')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Notificar sobre erros críticos do sistema
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Configurações de Segurança
              </h3>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Timeout da sessão (minutos)
                  </label>
                  <input
                    type="number"
                    {...register('security.sessionTimeout')}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Máximo de tentativas de login
                  </label>
                  <input
                    type="number"
                    {...register('security.maxLoginAttempts')}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Comprimento mínimo da senha
                  </label>
                  <input
                    type="number"
                    {...register('security.passwordMinLength')}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('security.requireStrongPassword')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Exigir senha forte (letras, números e símbolos)
                </label>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Configurações do Sistema
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Retenção de logs (dias)
                </label>
                <input
                  type="number"
                  {...register('system.logRetentionDays')}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('system.maintenanceMode')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Modo de manutenção
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('system.debugMode')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Modo debug (não recomendado em produção)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Success/Error messages */}
          {updateSettingsMutation.isSuccess && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    Configurações salvas com sucesso!
                  </p>
                </div>
              </div>
            </div>
          )}

          {updateSettingsMutation.isError && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">
                    Erro ao salvar configurações. Tente novamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={updateSettingsMutation.isPending}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {updateSettingsMutation.isPending ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}