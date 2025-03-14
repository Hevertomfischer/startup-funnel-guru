
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GMAIL_CLIENT_ID = Deno.env.get('GMAIL_CLIENT_ID');
const GMAIL_CLIENT_SECRET = Deno.env.get('GMAIL_CLIENT_SECRET');
const REDIRECT_URI = 'https://qolgehnzmslkmotrrwwy.supabase.co/functions/v1/gmail-auth/callback';
const FRONTEND_URL = 'https://e20e0388-6149-477c-ae32-72eaea337a61.lovableproject.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split('/').pop();

  if (path === 'callback') {
    // Handle OAuth callback
    try {
      const code = url.searchParams.get('code');
      
      if (!code) {
        throw new Error('No authorization code provided');
      }

      console.log('Received authorization code, exchanging for tokens');

      // Exchange the authorization code for access and refresh tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: GMAIL_CLIENT_ID!,
          client_secret: GMAIL_CLIENT_SECRET!,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        console.error('Token exchange error:', errorData);
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();
      console.log('Successfully obtained access token');

      // Redirect back to the frontend with the tokens
      const redirectUrl = new URL(`${FRONTEND_URL}/emails`);
      redirectUrl.searchParams.set('access_token', tokenData.access_token);
      redirectUrl.searchParams.set('refresh_token', tokenData.refresh_token);
      redirectUrl.searchParams.set('expires_in', tokenData.expires_in.toString());

      return Response.redirect(redirectUrl.toString(), 302);
    } catch (error: any) {
      console.error('Error in OAuth callback:', error);
      
      // Redirect back to the frontend with an error
      const redirectUrl = new URL(`${FRONTEND_URL}/emails`);
      redirectUrl.searchParams.set('error', error.message);
      
      return Response.redirect(redirectUrl.toString(), 302);
    }
  } else {
    // Generate OAuth URL
    try {
      const scopes = [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.compose',
      ];

      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', GMAIL_CLIENT_ID!);
      authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', scopes.join(' '));
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');

      return new Response(
        JSON.stringify({ authUrl: authUrl.toString() }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (error: any) {
      console.error('Error generating auth URL:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  }
});
