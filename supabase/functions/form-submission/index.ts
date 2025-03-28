
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

    let submissionData;
    
    // Check if request body is FormData or JSON
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData
      const formData = await req.formData();
      submissionData = {};
      
      // Convert FormData to object
      for (const [key, value] of formData.entries()) {
        submissionData[key] = value;
      }
    } else {
      // Handle JSON
      submissionData = await req.json();
    }
    
    console.log('Received submission data:', submissionData);
    
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
    
    console.log('Inserting submission with data:', submissionData);
    
    // Make sure to exclude any fields that don't exist in the form_submissions table
    // Remove the pitch_deck field if it exists - we only want to store pitch_deck_url
    if (submissionData.pitch_deck) {
      delete submissionData.pitch_deck;
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
    
    console.log('Submission created successfully with ID:', data.id);
    
    // If the submission was created successfully, process it to create a startup
    if (data.id) {
      try {
        // Create a startup record now
        const { data: startupData, error: startupError } = await supabase
          .rpc('process_form_submission', { submission_id: data.id });
        
        if (startupError) {
          console.error('Error processing form submission:', startupError);
        } else if (startupData) {
          console.log('Created startup record with ID:', startupData);
          
          // If pitch deck was uploaded, create an attachment
          if (submissionData.pitch_deck_url) {
            const attachmentData = {
              startup_id: startupData,
              name: `Pitch Deck`,
              url: submissionData.pitch_deck_url,
              type: 'application/pdf', // Assuming PDF, could be more specific if available
              is_pitch_deck: true
            };
            
            console.log('Creating attachment with data:', attachmentData);
            
            const { data: attachmentResult, error: attachmentError } = await supabase
              .from('attachments')
              .insert(attachmentData);
              
            if (attachmentError) {
              console.error('Error creating attachment:', attachmentError);
            } else {
              console.log('Attachment created successfully');
            }
          }
        }
      } catch (processError) {
        console.error('Error in process_form_submission:', processError);
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
