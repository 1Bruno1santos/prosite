import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Calendar,
} from 'lucide-react';
import { api } from '../services/api';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  action: string;
  userId?: string;
  userEmail?: string;
  details: string;
  metadata?: Record<string, any>;
}

const levelIcons = {
  info: Info,
  warning: AlertCircle,
  error: XCircle,
  success: CheckCircle,
};

const levelColors = {
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  success: 'bg-green-100 text-green-800',
};

export default function Logs() {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const { data: logs, isLoading } = useQuery<LogEntry[]>({
    queryKey: ['admin-logs', selectedLevel, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedLevel !== 'all') params.append('level', selectedLevel);
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);
      
      const response = await api.get(`/admin/logs?${params.toString()}`);
      return response.data;
    },
  });

  const exportLogs = () => {
    // Implementation for exporting logs
    console.log('Exporting logs...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Logs do Sistema</h2>
          <p className="mt-1 text-sm text-gray-600">
            Monitore todas as ações do sistema
          </p>
        </div>
        <button
          onClick={exportLogs}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Exportar
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos os níveis</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-500">até</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Logs list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="px-6 py-8 text-center">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          ) : logs?.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              Nenhum log encontrado
            </div>
          ) : (
            logs?.map((log) => {
              const Icon = levelIcons[log.level];
              const colorClass = levelColors[log.level];

              return (
                <div key={log.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 p-2 rounded-lg ${colorClass}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {log.action}
                        </p>
                        <time className="text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString('pt-BR')}
                        </time>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {log.details}
                      </p>
                      {log.userEmail && (
                        <p className="mt-1 text-sm text-gray-500">
                          Usuário: {log.userEmail}
                        </p>
                      )}
                      {log.metadata && (
                        <details className="mt-2">
                          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                            Detalhes adicionais
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}