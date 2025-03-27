
// Form styling
(function() {
  window.StartupFormEmbed = window.StartupFormEmbed || {};

  // Create style element
  function createStyleElement() {
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
    return style;
  }

  // Export function to the global StartupFormEmbed object
  StartupFormEmbed.Styles = {
    createStyleElement
  };
})();
