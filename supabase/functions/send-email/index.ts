
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendEmailRequest {
  to: string;
  subject: string;
  content: string;
  accessToken: string;
}

const buildRFC822Message = (to: string, subject: string, content: string): string => {
  const message = [
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `To: ${to}`,
    `Subject: ${subject}`,
    '',
    content
  ].join('\r\n');

  return btoa(message)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, content, accessToken }: SendEmailRequest = await req.json();

    if (!accessToken) {
      throw new Error('Access token is required');
    }

    console.log('Sending email to:', to);
    console.log('Subject:', subject);
    console.log('Access token provided:', !!accessToken);
    console.log('Access token length:', accessToken.length);
    console.log('Access token begins with:', accessToken.substring(0, 10) + '...');

    // Build the RFC822 formatted message
    const encodedMessage = buildRFC822Message(to, subject, content);
    console.log('Encoded message length:', encodedMessage.length);

    // Send the email using Gmail API
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedMessage
      }),
    });

    const responseText = await response.text();
    console.log('Gmail API response status:', response.status);
    console.log('Gmail API response headers:', JSON.stringify(Object.fromEntries(response.headers)));
    
    if (!response.ok) {
      console.error('Gmail API error response:', responseText);
      
      try {
        const errorData = JSON.parse(responseText);
        console.error('Gmail API error details:', JSON.stringify(errorData));
        throw new Error(`Gmail API error: ${errorData.error?.message || JSON.stringify(errorData)}`);
      } catch (e) {
        throw new Error(`Gmail API error: Status ${response.status} - ${responseText}`);
      }
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.warn('Could not parse response as JSON:', responseText);
      data = { responseText };
    }
    
    console.log('Email sent successfully. Response:', JSON.stringify(data));

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: data.id || 'unknown'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
