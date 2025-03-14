
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GMAIL_CLIENT_ID = Deno.env.get('GMAIL_CLIENT_ID');
const GMAIL_CLIENT_SECRET = Deno.env.get('GMAIL_CLIENT_SECRET');
const REDIRECT_URI = 'https://qolgehnzmslkmotrrwwy.supabase.co/functions/v1/gmail-auth/callback';
const FRONTEND_URL = 'https://e20e0388-6149-477c-ae32-72eaea337a61.lovableproject.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  console.log("======= GMAIL AUTH FUNCTION CALLED =======");
  console.log(`Request URL: ${req.url}`);
  console.log(`Request method: ${req.method}`);
  console.log(`Request headers: ${JSON.stringify(Object.fromEntries(req.headers))}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request with CORS headers");
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.split('/').pop();

  console.log(`Gmail auth function called with path: ${path}`);
  console.log(`GMAIL_CLIENT_ID exists: ${!!GMAIL_CLIENT_ID}`);
  console.log(`GMAIL_CLIENT_SECRET exists: ${!!GMAIL_CLIENT_SECRET}`);
  console.log(`REDIRECT_URI: ${REDIRECT_URI}`);
  console.log(`FRONTEND_URL: ${FRONTEND_URL}`);

  if (path === 'callback') {
    // Handle OAuth callback
    try {
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');
      
      console.log('Callback received with code:', code ? 'yes (length: ' + code.length + ')' : 'no');
      console.log('Callback received with error:', error || 'none');
      console.log('Full callback URL: ', req.url);
      console.log('Query parameters: ', JSON.stringify(Object.fromEntries(url.searchParams)));
      
      if (error) {
        console.error('OAuth error returned:', error);
        throw new Error(`Authorization failed: ${error}`);
      }
      
      if (!code) {
        throw new Error('No authorization code provided');
      }

      console.log('Received authorization code, exchanging for tokens');

      // Prepare the payload for token exchange
      const tokenPayload = new URLSearchParams({
        code,
        client_id: GMAIL_CLIENT_ID!,
        client_secret: GMAIL_CLIENT_SECRET!,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      });
      
      console.log('Token exchange payload prepared:', tokenPayload.toString());

      // Exchange the authorization code for access and refresh tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: tokenPayload,
      });

      const responseText = await tokenResponse.text();
      console.log(`Token exchange response status: ${tokenResponse.status}`);
      console.log(`Token exchange response headers: ${JSON.stringify(Object.fromEntries(tokenResponse.headers))}`);
      console.log('Token exchange response text:', responseText);

      if (!tokenResponse.ok) {
        console.error('Token exchange error text:', responseText);
        try {
          const parsedError = JSON.parse(responseText);
          console.error('Parsed token exchange error:', JSON.stringify(parsedError));
          throw new Error(`Failed to exchange code for token: ${parsedError.error_description || parsedError.error || 'Unknown error'}`);
        } catch (e) {
          throw new Error(`Failed to exchange code for token: ${responseText || tokenResponse.status}`);
        }
      }

      let tokenData;
      try {
        tokenData = JSON.parse(responseText);
        console.log('Token data received, access_token length:', tokenData.access_token?.length);
        console.log('Token data received, refresh_token exists:', !!tokenData.refresh_token);
        console.log('Token data received, expires_in:', tokenData.expires_in);
      } catch (e) {
        console.error('Error parsing token response as JSON:', e);
        throw new Error('Invalid token response format');
      }

      // Redirect back to the frontend with the tokens
      const redirectUrl = new URL(`${FRONTEND_URL}/emails`);
      redirectUrl.searchParams.set('access_token', tokenData.access_token);
      redirectUrl.searchParams.set('refresh_token', tokenData.refresh_token);
      redirectUrl.searchParams.set('expires_in', tokenData.expires_in.toString());

      console.log(`Redirecting to: ${redirectUrl.toString().substring(0, 100)}...`);
      
      // Use Response.redirect with CORS headers
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': redirectUrl.toString()
        }
      });
    } catch (error: any) {
      console.error('Error in OAuth callback:', error);
      console.error('Error stack:', error.stack);
      
      // Redirect back to the frontend with an error
      const redirectUrl = new URL(`${FRONTEND_URL}/emails`);
      redirectUrl.searchParams.set('error', error.message);
      
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': redirectUrl.toString()
        }
      });
    }
  } else {
    // Generate OAuth URL
    try {
      // Add all necessary scopes for Gmail
      const scopes = [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.compose',
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ];

      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', GMAIL_CLIENT_ID!);
      authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', scopes.join(' '));
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      authUrl.searchParams.set('include_granted_scopes', 'true');

      console.log(`Generated auth URL: ${authUrl.toString().substring(0, 100)}...`);
      
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
