
import { z } from 'zod';

export const startupSchema = z.object({
  name: z.string().min(1, { message: "Startup name is required" }),
  problem_solved: z.string().optional(),
  description: z.string().optional(),
  sector: z.string().optional(),
  business_model: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  mrr: z.coerce.number().optional(),
  client_count: z.coerce.number().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  status_id: z.string().min(1, { message: "Status is required" }),
});

export type StartupFormValues = z.infer<typeof startupSchema>;
