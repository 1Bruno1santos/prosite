import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Castle,
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { api } from '../services/api';

interface DashboardMetrics {
  totalClients: number;
  activeClients: number;
  totalCastles: number;
  activeCastles: number;
  clientsGrowth: number;
  castlesGrowth: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
  clientsOverTime: Array<{
    date: string;
    count: number;
  }>;
  castlesPerClient: Array<{
    clientName: string;
    castles: number;
  }>;
}

export default function Dashboard() {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const response = await api.get('/admin/dashboard/metrics');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total de Clientes',
      value: metrics?.totalClients || 0,
      change: metrics?.clientsGrowth || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Clientes Ativos',
      value: metrics?.activeClients || 0,
      change: 0,
      icon: Activity,
      color: 'bg-green-500',
    },
    {
      name: 'Total de Castelos',
      value: metrics?.totalCastles || 0,
      change: metrics?.castlesGrowth || 0,
      icon: Castle,
      color: 'bg-purple-500',
    },
    {
      name: 'Castelos Ativos',
      value: metrics?.activeCastles || 0,
      change: 0,
      icon: Activity,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-600">
          Visão geral do sistema e métricas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              {stat.change !== 0 && (
                <div className="flex items-center gap-1">
                  {stat.change > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {Math.abs(stat.change)}%
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Clients over time chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Crescimento de Clientes
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={metrics?.clientsOverTime || []}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  fill="#93c5fd"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Castles per client chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Castelos por Cliente
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics?.castlesPerClient?.slice(0, 10) || []}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="clientName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="castles" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Atividade Recente
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {metrics?.recentActivity?.map((activity) => (
            <div key={activity.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(activity.timestamp).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {(!metrics?.recentActivity || metrics.recentActivity.length === 0) && (
            <div className="px-6 py-8 text-center text-gray-500">
              Nenhuma atividade recente
            </div>
          )}
        </div>
      </div>
    </div>
  );
}