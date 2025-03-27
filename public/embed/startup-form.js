(function() {
  // Create style element
  const style = document.createElement('style');
  style.textContent = `
    .sfg-form-container {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .sfg-form-container * {
      box-sizing: border-box;
    }
    
    .sfg-form-header {
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .sfg-form-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }
    
    .sfg-form-description {
      color: #64748b;
      font-size: 0.875rem;
    }
    
    .sfg-form-group {
      margin-bottom: 1.5rem;
    }
    
    .sfg-form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }
    
    .sfg-form-input,
    .sfg-form-textarea,
    .sfg-form-select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      font-size: 0.875rem;
      color: #1e293b;
      background-color: #fff;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    
    .sfg-form-input:focus,
    .sfg-form-textarea:focus,
    .sfg-form-select:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    }
    
    .sfg-form-textarea {
      min-height: 100px;
      resize: vertical;
    }
    
    .sfg-form-submit {
      display: inline-block;
      background-color: #2563eb;
      color: white;
      font-weight: 500;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .sfg-form-submit:hover {
      background-color: #1d4ed8;
    }
    
    .sfg-form-error {
      color: #dc2626;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }
    
    .sfg-form-success {
      background-color: #ecfdf5;
      color: #0f766e;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }
    
    .sfg-form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    @media (min-width: 640px) {
      .sfg-form-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    .sfg-form-full {
      grid-column: 1 / -1;
    }
    
    .sfg-required {
      color: #dc2626;
      margin-left: 2px;
    }
    
    .sfg-form-loading {
      display: none;
      text-align: center;
      padding: 1rem 0;
    }
    
    .sfg-form-loading-spinner {
      display: inline-block;
      width: 1.5rem;
      height: 1.5rem;
      border: 3px solid rgba(37, 99, 235, 0.2);
      border-radius: 50%;
      border-top-color: #2563eb;
      animation: sfg-spin 1s linear infinite;
      margin-right: 0.5rem;
    }
    
    @keyframes sfg-spin {
      to { transform: rotate(360deg); }
    }
  `;
  
  // Get script element - this is the current script
  const scriptElement = document.currentScript;
  
  // Get the Supabase project URL from script data attributes
  const supabaseUrl = scriptElement.getAttribute('data-supabase-url');
  
  if (!supabaseUrl) {
    console.error('Error: data-supabase-url attribute is required');
    return;
  }
  
  // Load Supabase client library dynamically
  const supabaseScript = document.createElement('script');
  supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  document.head.appendChild(supabaseScript);
  
  // Wait for Supabase library to load before proceeding
  supabaseScript.onload = () => {
    initializeForm();
  };
  
  function initializeForm() {
    // Initialize Supabase client
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbGdlaG56bXNsa21vdHJyd3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzgyMDcsImV4cCI6MjA1Njk1NDIwN30.HXf0N-nP5JQf--84SlJydAFDAvmX1wEQs5DnYau3_8I';
    const supabase = window.supabaseClient || new supabase.createClient(supabaseUrl, SUPABASE_KEY);
    window.supabaseClient = supabase;
    
    // Create form container
    const formContainer = document.createElement('div');
    formContainer.className = 'sfg-form-container';
    
    // Create form content
    formContainer.innerHTML = `
      <div class="sfg-form-header">
        <h2 class="sfg-form-title">Cadastro de Startup</h2>
        <p class="sfg-form-description">Preencha os dados abaixo para cadastrar sua startup</p>
      </div>
      
      <div id="sfg-form-success" class="sfg-form-success" style="display: none;">
        Formulário enviado com sucesso! Em breve entraremos em contato.
      </div>
      
      <form id="sfg-startup-form" enctype="multipart/form-data">
        <div class="sfg-form-grid">
          <div class="sfg-form-group">
            <label class="sfg-form-label">Nome da Startup <span class="sfg-required">*</span></label>
            <input type="text" name="name" class="sfg-form-input" required>
          </div>
          
          <div class="sfg-form-group">
            <label class="sfg-form-label">Site da Startup</label>
            <input type="url" name="website" class="sfg-form-input" placeholder="https://">
          </div>
          
          <div class="sfg-form-group">
            <label class="sfg-form-label">Nome do CEO <span class="sfg-required">*</span></label>
            <input type="text" name="ceo_name" class="sfg-form-input" required>
          </div>
          
          <div class="sfg-form-group">
            <label class="sfg-form-label">E-mail do CEO <span class="sfg-required">*</span></label>
            <input type="email" name="ceo_email" class="sfg-form-input" required>
          </div>
          
          <div class="sfg-form-group">
            <label class="sfg-form-label">WhatsApp do CEO <span class="sfg-required">*</span></label>
            <input type="tel" name="ceo_whatsapp" class="sfg-form-input" placeholder="+55" required>
          </div>
          
          <div class="sfg-form-group">
            <label class="sfg-form-label">Ano da Fundação <span class="sfg-required">*</span></label>
            <input type="text" name="founding_year" class="sfg-form-input" required>
          </div>
          
          <div class="sfg-form-group">
            <label class="sfg-form-label">Cidade</label>
            <input type="text" name="city" class="sfg-form-input">
          </div>
          
          <div class="sfg-form-group">
            <label class="sfg-form-label">Estado</label>
            <input type="text" name="state" class="sfg-form-input">
          </div>
          
          <div class="sfg-form-group">
            <label class="sfg-form-label">Setor</label>
            <select name="sector" class="sfg-form-select">
              <option value="">Selecione um setor</option>
              <option value="Fintech">Fintech</option>
              <option value="Healthtech">Healthtech</option>
              <option value="Edtech">Edtech</option>
              <option value="Agtech">Agtech</option>
              <option value="Martech">Martech</option>
              <option value="Retail">Varejo</option>
              <option value="SaaS">SaaS</option>
              <option value="Marketplace">Marketplace</option>
              <option value="Hardware">Hardware</option>
              <option value="IoT">IoT</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          
          <div class="sfg-form-group">
            <label class="sfg-form-label">Modelo de Negócio</label>
            <select name="business_model" class="sfg-form-select">
              <option value="">Selecione um modelo</option>
              <option value="SaaS">SaaS</option>
              <option value="Marketplace">Marketplace</option>
              <option value="Subscription">Assinatura</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Consulting">Consultoria</option>
              <option value="Advertising">Publicidade</option>
              <option value="Freemium">Freemium</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          
          <div class="sfg-form-group">
            <label class="sfg-form-label">Faturamento último mês (MRR)</label>
            <input type="number" name="mrr" class="sfg-form-input" placeholder="Em reais (R$)">
          </div>
          
          <div class="sfg-form-group sfg-form-full">
            <label class="sfg-form-label">Problema que Resolve <span class="sfg-required">*</span></label>
            <textarea name="problem_solved" class="sfg-form-textarea" required></textarea>
          </div>
          
          <div class="sfg-form-group sfg-form-full">
            <label class="sfg-form-label">Solução para o Problema <span class="sfg-required">*</span></label>
            <textarea name="problem_solution" class="sfg-form-textarea" required></textarea>
          </div>
          
          <div class="sfg-form-group sfg-form-full">
            <label class="sfg-form-label">Diferenciais da Startup <span class="sfg-required">*</span></label>
            <textarea name="differentials" class="sfg-form-textarea" required></textarea>
          </div>
          
          <div class="sfg-form-group sfg-form-full">
            <label class="sfg-form-label">Pitch Deck (PDF)</label>
            <input type="file" name="pitch_deck" class="sfg-form-input" accept=".pdf,.ppt,.pptx,.key,.odp">
          </div>
          
          <div class="sfg-form-group sfg-form-full">
            <button type="submit" class="sfg-form-submit">Enviar Cadastro</button>
            <div id="sfg-form-loading" class="sfg-form-loading">
              <div class="sfg-form-loading-spinner"></div>
              <span>Enviando formulário...</span>
            </div>
            <p id="sfg-form-error" class="sfg-form-error" style="display: none;"></p>
          </div>
        </div>
      </form>
    `;
    
    // Append style and form to document
    document.head.appendChild(style);
    
    // Insert the form where the script is placed
    scriptElement.parentNode.insertBefore(formContainer, scriptElement);
    
    // Add form submission logic
    const form = document.getElementById('sfg-startup-form');
    const successMessage = document.getElementById('sfg-form-success');
    const errorMessage = document.getElementById('sfg-form-error');
    const loadingElement = document.getElementById('sfg-form-loading');
    
    if (form) {
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
          const formDataObj = {};
          for (let [key, value] of formData.entries()) {
            // Skip file inputs, we'll handle them separately
            if (!(value instanceof File) || value.size > 0) {
              formDataObj[key] = value;
            }
          }
          
          // Log the form data for debugging
          console.log('Form data being submitted:', formDataObj);
          
          // Handle file upload separately if a pitch deck is provided
          const pitchDeckFile = formData.get('pitch_deck');
          let pitchDeckUrl = '';
          
          if (pitchDeckFile instanceof File && pitchDeckFile.size > 0) {
            try {
              console.log('Handling pitch deck file:', pitchDeckFile.name);
              
              // Create a unique filename
              const fileExtension = pitchDeckFile.name.split('.').pop();
              const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
              
              // Upload file to Supabase Storage
              const { data: storageData, error: storageError } = await supabase
                .storage
                .from('pitch_decks')
                .upload(fileName, pitchDeckFile);
              
              if (storageError) {
                console.error('Error uploading pitch deck:', storageError);
              } else if (storageData) {
                // Get the public URL
                const { data: publicUrlData } = supabase
                  .storage
                  .from('pitch_decks')
                  .getPublicUrl(fileName);
                
                pitchDeckUrl = publicUrlData.publicUrl;
                console.log('Pitch deck uploaded, URL:', pitchDeckUrl);
                
                // Add the URL to form data object
                formDataObj.pitch_deck_url = pitchDeckUrl;
              }
            } catch (fileError) {
              console.error('File upload error:', fileError);
            }
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
    } else {
      console.error('Form element not found');
    }
  }
})();
