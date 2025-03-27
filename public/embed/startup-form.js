
// Startup Form Embed - Main Loader
// This file loads all the necessary modules for the startup form embed

// Load the modules in the correct order
document.addEventListener('DOMContentLoaded', function() {
  function loadModule(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = function() {
      console.error('Failed to load module:', src);
    };
    document.head.appendChild(script);
  }

  // Get the base path from the current script
  function getBasePath() {
    const scripts = document.querySelectorAll('script');
    let scriptSrc = '';
    
    // Find the current script
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.includes('startup-form.js')) {
        scriptSrc = scripts[i].src;
        break;
      }
    }
    
    if (!scriptSrc) {
      console.warn('Could not find startup-form.js script element. Using fallback path.');
      return '/embed/js/';
    }
    
    // Extract the base directory
    return scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1) + 'js/';
  }

  const basePath = getBasePath();
  
  // Load modules in sequence, with each one loading after the previous one completes
  loadModule(basePath + 'config.js', function() {
    loadModule(basePath + 'styles.js', function() {
      loadModule(basePath + 'form-content.js', function() {
        loadModule(basePath + 'form-submit.js', function() {
          loadModule(basePath + 'main.js', function() {
            console.log('All startup form modules loaded successfully');
          });
        });
      });
    });
  });
});
