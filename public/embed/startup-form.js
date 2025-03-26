
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
        
        // Log the form data for debugging
        console.log('Form data being submitted:');
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        
        const functionUrl = `${supabaseUrl}/functions/v1/form-submission`;
        console.log('Submitting form to:', functionUrl);
        
        // Submit form to Supabase edge function
        const response = await fetch(functionUrl, {
          method: 'POST',
          body: formData
        });
        
        // Hide loading
        loadingElement.style.display = 'none';
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Ocorreu um erro ao enviar o formulário.');
        }
        
        const result = await response.json();
        console.log('Form submission result:', result);
        
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
})();
