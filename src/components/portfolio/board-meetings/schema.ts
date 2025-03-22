
import * as z from 'zod';

export const FileItemSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  url: z.string()
});

export const boardMeetingFormSchema = z.object({
  startup_id: z.string(),
  title: z.string().min(1, 'O título é obrigatório'),
  meeting_date: z.string().min(1, 'A data é obrigatória'),
  location: z.string().optional(),
  description: z.string().optional(),
  minutes: z.string().optional(),
  decisions: z.string().optional(),
  attendees: z.array(
    z.object({
      member_name: z.string().min(1, 'O nome é obrigatório'),
      member_email: z.string().email('Email inválido').optional().or(z.literal('')),
      member_role: z.string().optional()
    })
  ).optional(),
  attachments: z.array(FileItemSchema).optional(),
});

export type BoardMeetingFormValues = z.infer<typeof boardMeetingFormSchema>;
export type FileItem = z.infer<typeof FileItemSchema>;
