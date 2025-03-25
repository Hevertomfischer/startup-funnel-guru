
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Check, Info } from "lucide-react";
import { toast } from "sonner";

const EmbedForm = () => {
  const [copied, setCopied] = useState(false);
  const [domain, setDomain] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  
  const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || "https://qolgehnzmslkmotrrwwy.supabase.co";
  
  useEffect(() => {
    const code = `<script 
  src="${window.location.origin}/embed/startup-form.js" 
  data-supabase-url="${supabaseUrl}"
></script>`;
    
    setGeneratedCode(code);
  }, [supabaseUrl]);
  
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
                <TabsTrigger value="preview">Visualização</TabsTrigger>
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
                <div className="border rounded-md p-4">
                  <div dangerouslySetInnerHTML={{ __html: generatedCode }} />
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
            <Button variant="outline" onClick={() => window.location.href = "/import"}>
              Ver Formulários Recebidos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmbedForm;
