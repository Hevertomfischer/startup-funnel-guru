
import { z } from "zod";

// Basic information schema
export const basicInfoSchema = z.object({
  Startup: z.string().min(1, "Nome da startup é obrigatório"),
  "Site da Startup": z.string().url("URL inválida").optional().or(z.literal("")),
  "Status Current": z.string().optional(),
  "Origem Lead": z.string().optional(),
  "Quem Indicou": z.string().optional(),
  "Observações": z.string().optional(),
});

// Team information schema
export const teamInfoSchema = z.object({
  "Nome do CEO": z.string().optional(),
  "E-mail do CEO": z.string().email("Email inválido").optional().or(z.literal("")),
  "Whatsapp do CEO": z.string().optional(),
  "Linkedin CEO": z.string().optional(),
  "Quantidade de Sócios": z.number().optional().or(z.literal("").transform(val => val === "" ? undefined : Number(val))),
});

// Company details schema
export const companyDetailsSchema = z.object({
  "Data da Fundação": z.string().optional(),
  "Cidade": z.string().optional(),
  "Estado": z.string().optional(),
  "Link do Google Drive": z.string().url("URL inválida").optional().or(z.literal("")),
});

// Business aspects schema
export const businessAspectsSchema = z.object({
  Setor: z.string().optional(),
  Category: z.string().optional(),
  "Modelo de Negócio": z.string().optional(),
  Mercado: z.string().optional(),
});

// Problem and solution schema
export const problemSolutionSchema = z.object({
  "Problema que Resolve": z.string().optional(),
  "Como Resolve o Problema": z.string().optional(),
  "Diferenciais da Startup": z.string().optional(),
  "Principais Concorrentes": z.string().optional(),
});

// Analysis schema
export const analysisSchema = z.object({
  "Pontos Positivos": z.string().optional(),
  "Pontos de Atenção": z.string().optional(),
  "Como a SCAngels pode agregar valor na Startup": z.string().optional(),
  "Motivo Não Investimento": z.string().optional(),
});

// Financial metrics schema
export const financialMetricsSchema = z.object({
  "Quantidade de Clientes": z.number().optional().or(z.literal("").transform(val => val === "" ? undefined : Number(val))),
  "Receita Acumulada no Ano corrente": z.number().optional().or(z.literal("").transform(val => val === "" ? undefined : Number(val))),
  "Receita Recorrente Mensal (MRR)": z.number().optional().or(z.literal("").transform(val => val === "" ? undefined : Number(val))),
  "Receita total do penúltimo Ano": z.number().optional().or(z.literal("").transform(val => val === "" ? undefined : Number(val))),
  "Receita Total do último Ano": z.number().optional().or(z.literal("").transform(val => val === "" ? undefined : Number(val))),
  MRR: z.number().optional().or(z.literal("").transform(val => val === "" ? undefined : Number(val))),
});

// Market size schema
export const marketSizeSchema = z.object({
  TAM: z.number().optional().or(z.literal("").transform(val => val === "" ? undefined : Number(val))),
  SAM: z.number().optional().or(z.literal("").transform(val => val === "" ? undefined : Number(val))),
  SOM: z.number().optional().or(z.literal("").transform(val => val === "" ? undefined : Number(val))),
});

// Scheduling schema
export const schedulingSchema = z.object({
  "Actual end": z.string().optional(),
});

// Complete startup form schema
export const startupFormSchema = z.object({
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  statusId: z.string().min(1, "Status é obrigatório"),
  dueDate: z.string().optional(),
  assignedTo: z.string().optional(),
  pitchDeck: z.any().optional().nullable(),
  attachments: z.array(z.any()).optional(),
  values: z.object({
    ...basicInfoSchema.shape,
    ...teamInfoSchema.shape,
    ...companyDetailsSchema.shape,
    ...businessAspectsSchema.shape,
    ...problemSolutionSchema.shape,
    ...analysisSchema.shape,
    ...financialMetricsSchema.shape,
    ...marketSizeSchema.shape,
    ...schedulingSchema.shape,
  }),
});

export type StartupFormValues = z.infer<typeof startupFormSchema>;
