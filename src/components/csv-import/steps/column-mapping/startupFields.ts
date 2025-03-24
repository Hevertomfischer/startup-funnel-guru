
import { StartupField } from './types';

// Define the startup field options
export const startupFields: StartupField[] = [
  // Basic Information
  { value: 'name', label: 'Nome da Startup', required: true, description: 'Nome da empresa' },
  { value: 'website', label: 'Site', required: false, description: 'Website da startup' },
  { value: 'status_id', label: 'Status', required: false, description: 'Status atual da startup no pipeline' },
  { value: 'origem_lead', label: 'Origem do Lead', required: false, description: 'Como a startup foi encontrada' },
  { value: 'referred_by', label: 'Quem Indicou', required: false, description: 'Pessoa que indicou a startup' },
  { value: 'observations', label: 'Observações', required: false, description: 'Observações gerais sobre a startup' },
  
  // Team Information
  { value: 'ceo_name', label: 'Nome do CEO', required: false, description: 'Nome do CEO ou fundador principal' },
  { value: 'ceo_email', label: 'Email do CEO', required: false, description: 'Email de contato do CEO' },
  { value: 'ceo_whatsapp', label: 'Whatsapp do CEO', required: false, description: 'Número de telefone do CEO' },
  { value: 'ceo_linkedin', label: 'LinkedIn do CEO', required: false, description: 'Perfil do LinkedIn do CEO' },
  { value: 'partner_count', label: 'Quantidade de Sócios', required: false, description: 'Número de sócios na startup' },
  
  // Company Details
  { value: 'founding_date', label: 'Data de Fundação', required: false, description: 'Data de fundação da startup' },
  { value: 'city', label: 'Cidade', required: false, description: 'Cidade onde a startup está sediada' },
  { value: 'state', label: 'Estado', required: false, description: 'Estado onde a startup está sediada' },
  { value: 'google_drive_link', label: 'Link do Google Drive', required: false, description: 'Link para pasta de documentos no Google Drive' },
  
  // Market and Business
  { value: 'sector', label: 'Setor', required: false, description: 'Setor de atuação da startup' },
  { value: 'category', label: 'Categoria', required: false, description: 'Categoria dentro do setor' },
  { value: 'business_model', label: 'Modelo de Negócio', required: false, description: 'Modelo de negócio da startup (SaaS, Marketplace, etc)' },
  { value: 'market', label: 'Mercado', required: false, description: 'Mercado de atuação da startup' },
  
  // Problem and Solution
  { value: 'problem_solved', label: 'Problema Resolvido', required: false, description: 'Que problema a startup resolve' },
  { value: 'problem_solution', label: 'Como Resolve o Problema', required: false, description: 'Descrição de como a startup resolve o problema' },
  { value: 'differentials', label: 'Diferenciais da Startup', required: false, description: 'Diferenciais competitivos da startup' },
  { value: 'competitors', label: 'Concorrentes', required: false, description: 'Principais concorrentes da startup' },
  
  // Analysis
  { value: 'positive_points', label: 'Pontos Positivos', required: false, description: 'Pontos fortes identificados na startup' },
  { value: 'attention_points', label: 'Pontos de Atenção', required: false, description: 'Pontos que merecem atenção ou preocupação' },
  { value: 'scangels_value_add', label: 'Como Podemos Agregar Valor', required: false, description: 'Como a SCAngels pode agregar valor à startup' },
  { value: 'no_investment_reason', label: 'Motivo Não Investimento', required: false, description: 'Razão para não investir na startup, se aplicável' },
  
  // Financial Metrics
  { value: 'mrr', label: 'MRR', required: false, description: 'Receita recorrente mensal' },
  { value: 'client_count', label: 'Quantidade de Clientes', required: false, description: 'Número de clientes ativos' },
  { value: 'accumulated_revenue_current_year', label: 'Receita Acumulada Ano Corrente', required: false, description: 'Receita acumulada no ano atual' },
  { value: 'total_revenue_last_year', label: 'Receita Total Último Ano', required: false, description: 'Receita total do último ano fiscal' },
  { value: 'total_revenue_previous_year', label: 'Receita Total Penúltimo Ano', required: false, description: 'Receita total do penúltimo ano fiscal' },
  
  // Market Size
  { value: 'tam', label: 'TAM', required: false, description: 'Total Addressable Market (em R$)' },
  { value: 'sam', label: 'SAM', required: false, description: 'Serviceable Available Market (em R$)' },
  { value: 'som', label: 'SOM', required: false, description: 'Serviceable Obtainable Market (em R$)' },
  
  // Task Management
  { value: 'priority', label: 'Prioridade', required: false, description: 'Prioridade da startup (baixa, média, alta)' },
  { value: 'due_date', label: 'Data Limite', required: false, description: 'Data limite para alguma ação' },
  { value: 'description', label: 'Descrição', required: false, description: 'Descrição geral da startup' },
  
  // Metadados
  { value: 'created_at', label: 'Data de Criação', required: false, description: 'Data de criação no sistema (pode ser importada do CSV)' },
];
