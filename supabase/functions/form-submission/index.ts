
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get form data from request
    const formData = await req.formData();
    
    const submissionData: Record<string, any> = {
      name: formData.get('name'),
      ceo_name: formData.get('ceo_name'),
      ceo_email: formData.get('ceo_email'),
      ceo_whatsapp: formData.get('ceo_whatsapp'),
      founding_year: formData.get('founding_year'),
      problem_solved: formData.get('problem_solved'),
      problem_solution: formData.get('problem_solution'),
      differentials: formData.get('differentials'),
      mrr: formData.get('mrr'),
      business_model: formData.get('business_model'),
      sector: formData.get('sector'),
      city: formData.get('city'),
      state: formData.get('state'),
      website: formData.get('website'),
    };
    
    // Validate required fields
    const requiredFields = ['name', 'ceo_name', 'ceo_email', 'ceo_whatsapp', 'founding_year', 
                           'problem_solved', 'problem_solution', 'differentials'];
    
    for (const field of requiredFields) {
      if (!submissionData[field]) {
        return new Response(JSON.stringify({ 
          error: `Missing required field: ${field}` 
        }), { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Convert numeric value
    if (submissionData.mrr) {
      submissionData.mrr = parseFloat(submissionData.mrr.toString());
      if (isNaN(submissionData.mrr)) {
        submissionData.mrr = null;
      }
    }
    
    // Get pitch deck file if provided
    const pitchDeckFile = formData.get('pitch_deck') as File;
    let pitchDeckUrl = '';
    
    if (pitchDeckFile && pitchDeckFile.size > 0) {
      // Generate a unique filename
      const fileExtension = pitchDeckFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExtension}`;
      
      // Upload the file to Supabase Storage
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('pitch_decks')
        .upload(fileName, pitchDeckFile, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (storageError) {
        console.error('Error uploading pitch deck:', storageError);
      } else if (storageData) {
        // Get the public URL
        const { data: publicUrlData } = supabase
          .storage
          .from('pitch_decks')
          .getPublicUrl(fileName);
        
        pitchDeckUrl = publicUrlData.publicUrl;
      }
    }
    
    // Get default status for new startups (optional)
    let statusId = null;
    try {
      const { data: statusData } = await supabase
        .from('statuses')
        .select('id')
        .order('position', { ascending: true })
        .limit(1)
        .single();
      
      if (statusData) {
        statusId = statusData.id;
      }
    } catch (error) {
      console.log('No status found, will use null');
    }
    
    // Insert into form_submissions table
    const { data, error } = await supabase
      .from('form_submissions')
      .insert({
        ...submissionData,
        status_id: statusId
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error inserting submission:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // If pitch deck was uploaded, create an attachment
    if (pitchDeckUrl && data.id) {
      // Create a startup record now
      const { data: startupData, error: startupError } = await supabase
        .rpc('process_form_submission', { submission_id: data.id });
      
      if (!startupError && startupData) {
        // Insert attachment record
        await supabase
          .from('attachments')
          .insert({
            startup_id: startupData,
            name: pitchDeckFile.name,
            url: pitchDeckUrl,
            type: pitchDeckFile.type,
            size: pitchDeckFile.size,
            is_pitch_deck: true
          });
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Formulário enviado com sucesso!'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
