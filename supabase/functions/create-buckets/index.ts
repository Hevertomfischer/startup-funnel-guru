
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    // Initialize Supabase client with service role key for admin privileges
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Create pitch_decks bucket if it doesn't exist
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();
    
    if (listError) {
      throw listError;
    }
    
    const pitchDeckBucketExists = buckets?.some(bucket => bucket.name === 'pitch_decks');
    
    if (!pitchDeckBucketExists) {
      const { data, error } = await supabase
        .storage
        .createBucket('pitch_decks', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['application/pdf']
        });
      
      if (error) {
        throw error;
      }
      
      console.log('Pitch decks bucket created');
    } else {
      console.log('Pitch decks bucket already exists');
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Storage buckets created or verified'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating buckets:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create storage buckets' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
