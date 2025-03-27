import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Info } from "lucide-react";
import { toast } from "sonner";

const EmbedForm = () => {
  const [copied, setCopied] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const previewContainerRef = useRef<HTMLDivElement>(null);
  
  const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || "https://qolgehnzmslkmotrrwwy.supabase.co";
  
  useEffect(() => {
    // Create code with the current origin and Supabase URL
    const code = `<script 
  src="${window.location.origin}/embed/startup-form.js" 
  data-supabase-url="${supabaseUrl}"
></script>`;
    
    setGeneratedCode(code);
  }, [supabaseUrl]);

  // Function to handle preview tab activation
  const handlePreviewTabClick = () => {
    if (previewContainerRef.current) {
      // Clear previous content
      previewContainerRef.current.innerHTML = '';
      
      // Load all necessary scripts for the form
      const loadScripts = () => {
        // First load config.js which is required by all other modules
        const configScript = document.createElement('script');
        configScript.src = `${window.location.origin}/embed/js/config.js`;
        
        configScript.onload = () => {
          // Then load the remaining scripts in proper order
          const scripts = [
            '/embed/js/styles.js',
            '/embed/js/form-content.js',
            '/embed/js/form-submit.js',
            '/embed/js/main.js'
          ];
          
          // Helper function to load scripts sequentially
          const loadScript = (index) => {
            if (index >= scripts.length) {
              // All scripts loaded, initialize the form
              const initScript = document.createElement('script');
              initScript.textContent = `
                // Initialize form with Supabase URL from the environment
                setTimeout(() => {
                  if (window.StartupFormEmbed && window.supabase) {
                    const scriptInfo = { 
                      scriptElement: document.currentScript,
                      supabaseUrl: "${supabaseUrl}"
                    };
                    
                    // Create and append style
                    const style = StartupFormEmbed.Styles.createStyleElement();
                    document.head.appendChild(style);
                    
                    // Create and append form inside preview container
                    const formContainer = document.createElement('div');
                    formContainer.className = 'sfg-form-container';
                    formContainer.innerHTML = StartupFormEmbed.FormContent.createFormHTML();
                    document.getElementById('preview-container').appendChild(formContainer);
                    
                    // Setup form submission
                    const form = document.getElementById('sfg-startup-form');
                    if (form) {
                      StartupFormEmbed.FormSubmit.setupFormSubmissionHandler(
                        window.supabaseClient, 
                        form
                      );
                    }
                  } else {
                    console.error('StartupFormEmbed or supabase not available');
                  }
                }, 500);
              `;
              previewContainerRef.current?.appendChild(initScript);
            } else {
              const script = document.createElement('script');
              script.src = `${window.location.origin}${scripts[index]}`;
              script.onload = () => loadScript(index + 1);
              previewContainerRef.current?.appendChild(script);
            }
          };
          
          // Start loading scripts
          loadScript(0);
          
          // Load Supabase client for the preview
          const supabaseScript = document.createElement('script');
          supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
          supabaseScript.onload = () => {
            const initSupabase = document.createElement('script');
            initSupabase.textContent = `
              const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbGdlaG56bXNsa21vdHJyd3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzgyMDcsImV4cCI6MjA1Njk1NDIwN30.HXf0N-nP5JQf--84SlJydAFDAvmX1wEQs5DnYau3_8I';
              window.supabaseClient = new supabase.createClient("${supabaseUrl}", SUPABASE_KEY);
            `;
            previewContainerRef.current?.appendChild(initSupabase);
          };
          previewContainerRef.current?.appendChild(supabaseScript);
        };
        
        previewContainerRef.current?.appendChild(configScript);
      };
      
      // Create a container for the preview with ID for script targeting
      const container = document.createElement('div');
      container.id = 'preview-container';
      previewContainerRef.current.appendChild(container);
      
      // Load all necessary scripts
      loadScripts();
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Código copiado para a área de transferência!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Formulário de Cadastro Incorporável</h1>
      
      <div className="grid gap-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Informação</AlertTitle>
          <AlertDescription>
            Use este código para incorporar o formulário de cadastro de startups em seu site.
            Basta copiar o código abaixo e colá-lo em qualquer página HTML onde você deseja exibir o formulário.
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader>
            <CardTitle>Código de Incorporação</CardTitle>
            <CardDescription>
              Copie este código e cole-o em qualquer página HTML onde você deseja exibir o formulário de cadastro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="code">
              <TabsList className="mb-4">
                <TabsTrigger value="code">Código</TabsTrigger>
                <TabsTrigger value="preview" onClick={handlePreviewTabClick}>Visualização</TabsTrigger>
              </TabsList>
              
              <TabsContent value="code">
                <div className="relative">
                  <Textarea 
                    value={generatedCode}
                    readOnly 
                    className="font-mono h-32 resize-none"
                  />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="absolute top-2 right-2"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="preview">
                <div className="border rounded-md p-4 overflow-hidden">
                  <p className="text-sm text-muted-foreground mb-4">
                    O formulário será exibido como mostrado abaixo. Note que a versão de preview pode não funcionar 
                    como esperado aqui, mas funcionará corretamente quando incorporado em seu site.
                  </p>
                  <div 
                    ref={previewContainerRef} 
                    className="min-h-[600px]"
                  ></div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCopy}>
              {copied ? "Copiado!" : "Copiar Código"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Formulários Recebidos</CardTitle>
            <CardDescription>
              Acesse e gerencie os formulários recebidos no seu painel administrativo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Quando alguém preenche o formulário em seu site, os dados serão automaticamente enviados para o seu sistema.
              Você pode visualizar e gerenciar todos os formulários recebidos no painel administrativo.
            </p>
            <Button variant="outline" onClick={() => window.location.href = "/form-submissions"}>
              Ver Formulários Recebidos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmbedForm;
