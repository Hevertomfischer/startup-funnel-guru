
// Form content and HTML generation
(function() {
  window.StartupFormEmbed = window.StartupFormEmbed || {};

  // Create form HTML content
  function createFormHTML() {
    return `
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
  }

  // Create and append form to document
  function createAndAppendForm(scriptElement) {
    // Create form container
    const formContainer = document.createElement('div');
    formContainer.className = 'sfg-form-container';
    
    // Set inner HTML with form content
    formContainer.innerHTML = createFormHTML();
    
    // Insert the form where the script is placed
    if (scriptElement && scriptElement.parentNode) {
      scriptElement.parentNode.insertBefore(formContainer, scriptElement);
    } else {
      // Fallback: Append to body if script element is not properly found
      document.body.appendChild(formContainer);
      console.warn("Script element parent not found, appending form to body instead");
    }
    
    return formContainer;
  }

  // Export functions to the global StartupFormEmbed object
  StartupFormEmbed.FormContent = {
    createFormHTML,
    createAndAppendForm
  };
})();
