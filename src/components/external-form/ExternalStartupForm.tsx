
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaperclipIcon, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const formSchema = z.object({
  startup: z.string().min(1, "Nome da startup é obrigatório"),
  ceoName: z.string().min(1, "Nome do CEO é obrigatório"),
  ceoEmail: z.string().email("Email inválido").min(1, "Email do CEO é obrigatório"),
  ceoWhatsapp: z.string().min(1, "Whatsapp do CEO é obrigatório"),
  foundingYear: z.string().min(1, "Ano de fundação é obrigatório"),
  problem: z.string().min(1, "Problema que resolve é obrigatório"),
  solution: z.string().min(1, "Solução é obrigatória"),
  differentials: z.string().optional(),
  mrr: z.string().optional(),
  businessModel: z.string().optional(),
  sector: z.string().optional(),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const ExternalStartupForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pitchDeck, setPitchDeck] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startup: '',
      ceoName: '',
      ceoEmail: '',
      ceoWhatsapp: '',
      foundingYear: '',
      problem: '',
      solution: '',
      differentials: '',
      mrr: '',
      businessModel: '',
      sector: '',
      city: '',
      state: '',
      website: '',
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      // Get the selected file
      const file = files[0];
      
      // Generate a unique file name to avoid collisions
      const fileExt = file.name.split('.').pop();
      const fileName = `pitch_deck_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      console.log('Uploading pitch deck:', file.name, 'as', fileName);
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('startup-attachments')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Error uploading pitch deck to storage:', error);
        throw error;
      }
      
      console.log('Pitch deck uploaded successfully to storage:', data);
      
      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('startup-attachments')
        .getPublicUrl(fileName);

      console.log('Generated public URL for pitch deck:', urlData.publicUrl);

      // Set the pitch deck data
      const pitchDeckData = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: urlData.publicUrl,
        isPitchDeck: true
      };
      
      setPitchDeck(pitchDeckData);
      toast.success('Pitch deck carregado com sucesso');
    } catch (error: any) {
      console.error('Error uploading pitch deck:', error);
      toast.error('Erro ao carregar pitch deck', {
        description: error.message
      });
    } finally {
      setIsUploading(false);
      // Clear the input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      if (!pitchDeck) {
        toast.error('É necessário anexar o Pitch Deck');
        setIsSubmitting(false);
        return;
      }
      
      // Transform the data into the format expected by the API
      const startupData = {
        values: {
          'Startup': data.startup,
          'Nome do CEO': data.ceoName,
          'E-mail do CEO': data.ceoEmail,
          'Whatsapp do CEO': data.ceoWhatsapp,
          'Data da Fundação': data.foundingYear,
          'Problema que Resolve': data.problem,
          'Como Resolve o Problema': data.solution,
          'Diferenciais da Startup': data.differentials,
          'MRR': data.mrr ? parseFloat(data.mrr) : undefined,
          'Modelo de Negócio': data.businessModel,
          'Setor': data.sector,
          'Cidade': data.city,
          'Estado': data.state,
          'Site da Startup': data.website,
        },
        pitchDeck: pitchDeck,
        priority: 'medium',
        // The status will be set on the backend by default
      };
      
      console.log('Submitting startup data:', startupData);
      
      // Save to the external submissions table
      const { data: submission, error } = await supabase
        .from('external_startup_submissions')
        .insert({
          data: startupData,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      console.log('Submission saved:', submission);
      
      // Show success message
      setSuccessMessage('Formulário enviado com sucesso! Obrigado pelo seu interesse.');
      reset();
      setPitchDeck(null);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error('Erro ao enviar formulário', {
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-background rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 text-center">Formulário de Cadastro de Startup</h2>
      
      {successMessage ? (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-6">
          <p className="text-center font-medium">{successMessage}</p>
          <div className="flex justify-center mt-4">
            <Button onClick={() => setSuccessMessage('')} variant="outline">
              Enviar outro formulário
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startup">Nome da Startup <span className="text-red-500">*</span></Label>
              <Input id="startup" {...register('startup')} />
              {errors.startup && <p className="text-sm text-red-500">{errors.startup.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ceoName">Nome do CEO <span className="text-red-500">*</span></Label>
              <Input id="ceoName" {...register('ceoName')} />
              {errors.ceoName && <p className="text-sm text-red-500">{errors.ceoName.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ceoEmail">E-mail do CEO <span className="text-red-500">*</span></Label>
              <Input id="ceoEmail" type="email" {...register('ceoEmail')} />
              {errors.ceoEmail && <p className="text-sm text-red-500">{errors.ceoEmail.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ceoWhatsapp">Whatsapp do CEO <span className="text-red-500">*</span></Label>
              <Input id="ceoWhatsapp" {...register('ceoWhatsapp')} />
              {errors.ceoWhatsapp && <p className="text-sm text-red-500">{errors.ceoWhatsapp.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="foundingYear">Ano da Fundação <span className="text-red-500">*</span></Label>
              <Input id="foundingYear" {...register('foundingYear')} />
              {errors.foundingYear && <p className="text-sm text-red-500">{errors.foundingYear.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sector">Setor</Label>
              <Input id="sector" {...register('sector')} />
              {errors.sector && <p className="text-sm text-red-500">{errors.sector.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">Cidade <span className="text-red-500">*</span></Label>
              <Input id="city" {...register('city')} />
              {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">Estado <span className="text-red-500">*</span></Label>
              <Input id="state" {...register('state')} />
              {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Site da Startup</Label>
              <Input id="website" {...register('website')} />
              {errors.website && <p className="text-sm text-red-500">{errors.website.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessModel">Modelo de Negócio</Label>
              <Input id="businessModel" {...register('businessModel')} />
              {errors.businessModel && <p className="text-sm text-red-500">{errors.businessModel.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mrr">Faturamento último mês (MRR)</Label>
              <Input id="mrr" {...register('mrr')} />
              {errors.mrr && <p className="text-sm text-red-500">{errors.mrr.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="problem">Problema que Resolve <span className="text-red-500">*</span></Label>
            <Textarea id="problem" {...register('problem')} rows={3} />
            {errors.problem && <p className="text-sm text-red-500">{errors.problem.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="solution">Solução para o Problema <span className="text-red-500">*</span></Label>
            <Textarea id="solution" {...register('solution')} rows={3} />
            {errors.solution && <p className="text-sm text-red-500">{errors.solution.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="differentials">Diferenciais da Startup</Label>
            <Textarea id="differentials" {...register('differentials')} rows={3} />
            {errors.differentials && <p className="text-sm text-red-500">{errors.differentials.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pitchDeck">Pitch Deck <span className="text-red-500">*</span></Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('pitch-deck-upload')?.click()}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PaperclipIcon className="h-4 w-4" />
                )}
                {isUploading ? 'Carregando...' : 'Anexar Pitch Deck'}
              </Button>
              <Input
                id="pitch-deck-upload"
                type="file"
                accept=".pdf,.ppt,.pptx,.key,.odp"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
              
              {pitchDeck && (
                <div className="text-sm">
                  <span className="font-medium">{pitchDeck.name}</span>
                  <span className="ml-2 text-muted-foreground">({Math.round(pitchDeck.size / 1024)} KB)</span>
                </div>
              )}
            </div>
            {!pitchDeck && <p className="text-sm text-amber-600 mt-2">É necessário anexar o Pitch Deck</p>}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                Enviar Formulário
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ExternalStartupForm;
