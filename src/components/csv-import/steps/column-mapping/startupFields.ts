
import { StartupField } from './types';

// Define the startup field options
export const startupFields: StartupField[] = [
  { value: 'name', label: 'Nome da Startup', required: true, description: 'Nome da empresa' },
  { value: 'status_id', label: 'Status', required: false, description: 'Status atual da startup no pipeline' },
  { value: 'problem_solved', label: 'Problema Resolvido', required: false, description: 'Que problema a startup resolve' },
  { value: 'sector', label: 'Setor', required: false, description: 'Setor de atuação da startup' },
  { value: 'business_model', label: 'Modelo de Negócio', required: false, description: 'Modelo de negócio da startup (SaaS, Marketplace, etc)' },
  { value: 'website', label: 'Site', required: false, description: 'Website da startup' },
  { value: 'mrr', label: 'MRR', required: false, description: 'Receita recorrente mensal' },
  { value: 'client_count', label: 'Quantidade de Clientes', required: false, description: 'Número de clientes ativos' },
  { value: 'ceo_name', label: 'Nome do CEO', required: false, description: 'Nome do CEO ou fundador principal' },
  { value: 'ceo_email', label: 'Email do CEO', required: false, description: 'Email de contato do CEO' },
  { value: 'ceo_whatsapp', label: 'Whatsapp do CEO', required: false, description: 'Número de telefone do CEO' },
  { value: 'ceo_linkedin', label: 'LinkedIn do CEO', required: false, description: 'Perfil do LinkedIn do CEO' },
  { value: 'founding_date', label: 'Data de Fundação', required: false, description: 'Data de fundação da startup' },
  { value: 'city', label: 'Cidade', required: false, description: 'Cidade onde a startup está sediada' },
  { value: 'state', label: 'Estado', required: false, description: 'Estado onde a startup está sediada' },
  { value: 'market', label: 'Mercado', required: false, description: 'Mercado de atuação da startup' },
  { value: 'competitors', label: 'Concorrentes', required: false, description: 'Principais concorrentes' },
  { value: 'tam', label: 'TAM', required: false, description: 'Total Addressable Market (em R$)' },
  { value: 'sam', label: 'SAM', required: false, description: 'Serviceable Available Market (em R$)' },
  { value: 'som', label: 'SOM', required: false, description: 'Serviceable Obtainable Market (em R$)' },
  { value: 'description', label: 'Descrição', required: false, description: 'Descrição geral da startup' },
];
