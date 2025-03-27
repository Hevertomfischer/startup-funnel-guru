
// Main initialization script
(function() {
  // Initialize the global StartupFormEmbed object if it doesn't exist
  window.StartupFormEmbed = window.StartupFormEmbed || {};
  
  // Main initialization function
  function initializeForm() {
    try {
      const scriptInfo = StartupFormEmbed.Config.getSupabaseUrlFromScript();
      const { scriptElement, supabaseUrl } = scriptInfo;
      
      console.log("Initializing form with Supabase URL:", supabaseUrl);
      
      // Initialize Supabase client
      const supabase = StartupFormEmbed.Config.initializeSupabaseClient(supabaseUrl);
      
      // Create and append style
      const style = StartupFormEmbed.Styles.createStyleElement();
      document.head.appendChild(style);
      
      // Create and append form
      const formContainer = StartupFormEmbed.FormContent.createAndAppendForm(scriptElement);
      
      // Set up form submission handler
      const form = document.getElementById('sfg-startup-form');
      if (form) {
        StartupFormEmbed.FormSubmit.setupFormSubmissionHandler(supabase, form);
      } else {
        console.error('Form element not found');
      }
    } catch (error) {
      console.error("Error initializing form:", error);
    }
  }

  // Start the process
  StartupFormEmbed.Config.loadSupabaseScript(() => {
    // Add a small delay to ensure DOM is ready
    setTimeout(initializeForm, 100);
  });
})();
