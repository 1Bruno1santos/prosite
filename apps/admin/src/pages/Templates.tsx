import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Plus, Edit, Trash2, Copy, Eye } from 'lucide-react';
import { api } from '../services/api';

interface Template {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ['admin-templates'],
    queryFn: async () => {
      const response = await api.get('/admin/templates');
      return response.data;
    },
  });

  const filteredTemplates = templates?.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Templates</h2>
          <p className="mt-1 text-sm text-gray-600">
            Gerencie os templates de configuração
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Novo Template
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Buscar templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredTemplates?.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            Nenhum template encontrado
          </div>
        ) : (
          filteredTemplates?.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>Usado {template.usageCount} vezes</span>
                  <span>
                    {new Date(template.updatedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t flex items-center gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" />
                    Ver
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Copy className="w-4 h-4" />
                    Duplicar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}