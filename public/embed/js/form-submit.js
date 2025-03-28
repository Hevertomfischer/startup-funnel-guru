
// Form submission handling
(function() {
  window.StartupFormEmbed = window.StartupFormEmbed || {};

  // Convert FormData to object
  function formDataToObject(formData) {
    const formDataObj = {};
    for (let [key, value] of formData.entries()) {
      // Skip file inputs, we'll handle them separately
      if (!(value instanceof File) || value.size > 0) {
        // Skip adding the pitch_deck field to the data object
        // as the backend only expects pitch_deck_url
        if (key !== 'pitch_deck') {
          formDataObj[key] = value;
        }
      }
    }
    return formDataObj;
  }

  // Handle file upload
  async function handleFileUpload(supabase, file) {
    if (!(file instanceof File) || file.size === 0) {
      return '';
    }
    
    try {
      console.log('Handling pitch deck file:', file.name);
      
      // Create a unique filename
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
      
      // Upload file to Supabase Storage
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('pitch_decks')
        .upload(fileName, file);
      
      if (storageError) {
        console.error('Error uploading pitch deck:', storageError);
        return '';
      } else if (storageData) {
        // Get the public URL
        const { data: publicUrlData } = supabase
          .storage
          .from('pitch_decks')
          .getPublicUrl(fileName);
        
        const pitchDeckUrl = publicUrlData.publicUrl;
        console.log('Pitch deck uploaded, URL:', pitchDeckUrl);
        
        return pitchDeckUrl;
      }
    } catch (fileError) {
      console.error('File upload error:', fileError);
    }
    
    return '';
  }

  // Set up form submission handler
  function setupFormSubmissionHandler(supabase, form) {
    const successMessage = document.getElementById('sfg-form-success');
    const errorMessage = document.getElementById('sfg-form-error');
    const loadingElement = document.getElementById('sfg-form-loading');
    const formContainer = form.closest('.sfg-form-container');
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Hide previous messages and show loading
      errorMessage.style.display = 'none';
      successMessage.style.display = 'none';
      loadingElement.style.display = 'block';
      
      // Disable submit button
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
      }
      
      try {
        const formData = new FormData(form);
        
        // Convert FormData to a plain object for supabase.functions.invoke
        const formDataObj = formDataToObject(formData);
        
        // Log the form data for debugging
        console.log('Form data being submitted:', formDataObj);
        
        // Handle file upload separately if a pitch deck is provided
        const pitchDeckFile = formData.get('pitch_deck');
        const pitchDeckUrl = await handleFileUpload(supabase, pitchDeckFile);
        
        // Add the URL to form data object if a file was uploaded
        if (pitchDeckUrl) {
          formDataObj.pitch_deck_url = pitchDeckUrl;
        }
        
        // Submit form using Supabase Edge Function
        console.log('Submitting form via Supabase Functions:', formDataObj);
        
        const { data, error } = await supabase.functions.invoke('form-submission', {
          body: formDataObj
        });
        
        // Hide loading
        loadingElement.style.display = 'none';
        
        console.log('Response data:', data);
        
        if (error) {
          throw new Error(error.message || 'Ocorreu um erro ao enviar o formulário.');
        }
        
        // Show success message
        successMessage.style.display = 'block';
        
        // Reset form
        form.reset();
        
        // Scroll to top of form
        formContainer.scrollIntoView({ behavior: 'smooth' });
        
      } catch (error) {
        console.error('Form submission error:', error);
        
        // Hide loading
        loadingElement.style.display = 'none';
        
        // Show error message
        errorMessage.textContent = error.message || 'Ocorreu um erro ao enviar o formulário.';
        errorMessage.style.display = 'block';
      } finally {
        // Re-enable submit button
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  }

  // Export functions to the global StartupFormEmbed object
  StartupFormEmbed.FormSubmit = {
    formDataToObject,
    handleFileUpload,
    setupFormSubmissionHandler
  };
})();
