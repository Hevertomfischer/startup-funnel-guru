
// Configuration and utilities
(function() {
  window.StartupFormEmbed = window.StartupFormEmbed || {};
  
  // Default Supabase configuration
  const DEFAULT_SUPABASE_URL = 'https://qolgehnzmslkmotrrwwy.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbGdlaG56bXNsa21vdHJyd3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzgyMDcsImV4cCI6MjA1Njk1NDIwN30.HXf0N-nP5JQf--84SlJydAFDAvmX1wEQs5DnYau3_8I';

  // Get Supabase URL from script element with fallback
  function getSupabaseUrlFromScript() {
    try {
      // Try to get the current script - this is more reliable
      const scripts = document.querySelectorAll('script');
      let scriptElement = null;
      
      // First try to find by data attribute
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].hasAttribute('data-supabase-url')) {
          scriptElement = scripts[i];
          break;
        }
      }
      
      // If not found by data attribute, try to find by src
      if (!scriptElement) {
        for (let i = 0; i < scripts.length; i++) {
          if (scripts[i].src && (scripts[i].src.includes('startup-form.js') || scripts[i].src.includes('main.js'))) {
            scriptElement = scripts[i];
            break;
          }
        }
      }
      
      // If script is still not found, use document.currentScript as last resort
      if (!scriptElement) {
        scriptElement = document.currentScript;
      }
      
      // Get the Supabase project URL from data attributes or use a default
      let supabaseUrl = scriptElement && scriptElement.getAttribute('data-supabase-url');
      
      // If no URL found anywhere, use a default
      if (!supabaseUrl) {
        console.warn('Warning: data-supabase-url attribute not found, using default Supabase URL');
        supabaseUrl = DEFAULT_SUPABASE_URL;
      }
      
      return { scriptElement, supabaseUrl };
    } catch (error) {
      console.error('Error getting Supabase URL:', error);
      // Return a default value to prevent the script from failing
      return { 
        scriptElement: document.currentScript || document.scripts[document.scripts.length - 1], 
        supabaseUrl: DEFAULT_SUPABASE_URL 
      };
    }
  }

  // Load Supabase client library
  function loadSupabaseScript(callback) {
    const supabaseScript = document.createElement('script');
    supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    document.head.appendChild(supabaseScript);
    
    // Wait for Supabase library to load before proceeding
    supabaseScript.onload = callback;
  }

  // Initialize Supabase client
  function initializeSupabaseClient(supabaseUrl) {
    const supabase = window.supabaseClient || new supabase.createClient(supabaseUrl, SUPABASE_KEY);
    window.supabaseClient = supabase;
    return supabase;
  }

  // Export functions to the global StartupFormEmbed object
  StartupFormEmbed.Config = {
    getSupabaseUrlFromScript,
    loadSupabaseScript,
    initializeSupabaseClient,
    DEFAULT_SUPABASE_URL
  };
})();
