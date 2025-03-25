
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, EyeIcon, PanelRightOpen } from 'lucide-react';

const ExternalFormController = () => {
  const navigate = useNavigate();
  const embedCode = `<iframe 
  src="${window.location.origin}/embed-form" 
  width="100%" 
  height="800" 
  style="border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" 
  title="Formulário de Cadastro de Startup">
</iframe>`;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Formulário Externo para Startups</h1>
      <p className="text-muted-foreground mb-10">
        Use este formulário para coletar informações iniciais de startups diretamente no seu site.
        Os dados coletados serão salvos para validação posterior.
      </p>
      
      <Tabs defaultValue="preview">
        <TabsList className="mb-4">
          <TabsTrigger value="preview">
            <EyeIcon className="h-4 w-4 mr-2" />
            Prévia
          </TabsTrigger>
          <TabsTrigger value="embed">
            <Code className="h-4 w-4 mr-2" />
            Código para Embed
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Prévia do Formulário</CardTitle>
              <CardDescription>
                Veja como o formulário será exibido no seu site
              </CardDescription>
            </CardHeader>
            <CardContent className="border-t pt-4">
              <Button onClick={() => navigate('/embed-form')}>
                <PanelRightOpen className="h-4 w-4 mr-2" />
                Abrir prévia em tela cheia
              </Button>
            </CardContent>
            <CardFooter className="border-t pt-4 block">
              <p className="text-sm text-muted-foreground mb-2">
                Este formulário coleta informações básicas sobre a startup e o pitch deck.
                Todos os dados serão armazenados para validação posterior.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="embed">
          <Card>
            <CardHeader>
              <CardTitle>Código para Incorporação</CardTitle>
              <CardDescription>
                Copie e cole este código no seu site para incorporar o formulário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md overflow-x-auto">
                <pre className="text-sm">{embedCode}</pre>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button onClick={() => navigator.clipboard.writeText(embedCode)}>
                Copiar Código
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Instruções de Uso</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>O formulário coleta informações básicas e o pitch deck da startup</li>
          <li>Os dados são armazenados para validação posterior em <code>external_startup_submissions</code></li>
          <li>O código de incorporação acima pode ser inserido em qualquer página HTML</li>
          <li>O formulário é responsivo e se adapta automaticamente ao tamanho do container</li>
          <li>Você pode acessar as submissões na área administrativa do sistema</li>
        </ul>
      </div>
    </div>
  );
};

export default ExternalFormController;
