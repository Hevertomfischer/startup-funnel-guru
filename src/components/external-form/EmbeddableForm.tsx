
import React from 'react';
import ExternalStartupForm from './ExternalStartupForm';

const EmbeddableForm = () => {
  return (
    <div className="external-form-container">
      <ExternalStartupForm />
      
      {/* Add terms and conditions or additional information */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Ao enviar este formulário, você concorda com os nossos termos de uso e política de privacidade.</p>
        <p className="mt-2">Todos os dados enviados serão revisados pela nossa equipe antes de serem processados.</p>
      </div>
    </div>
  );
};

export default EmbeddableForm;
