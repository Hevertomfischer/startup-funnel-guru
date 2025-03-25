import { useEffect, useState } from "react";
import { useRoutes, useLocation } from "react-router-dom";

import { MainLayout } from "@/layouts/MainLayout";
import { routes } from "@/routes";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useSupabase } from "@/providers/SupabaseProvider";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { DEFAULT_THEME } from "@/lib/constants";
import { useTheme } from "@/hooks/use-theme";
import { Settings } from "@/pages/Settings";
import { BoardView } from "@/components/board/BoardView";
import { CSVImport } from "@/pages/CSVImport";
import { Analytics } from "@/pages/Analytics";
import EmbedForm from '@/pages/EmbedForm';
import ExternalFormAdmin from '@/pages/ExternalFormAdmin';
import ExternalFormController from '@/components/external-form/ExternalFormController';

export function App() {
  const { toast } = useToast();
  const { supabase, session } = useSupabase();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && !session && location.pathname !== "/login") {
      toast({
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar essa página.",
      });
      navigate("/login");
    }
  }, [session, navigate, isLoading, toast, location.pathname]);

  const routeElements = useRoutes([
    {
      path: "/login",
      element: !session ? (
        <div className="grid h-screen place-items-center">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme={theme === "dark" ? ThemeSupa : DEFAULT_THEME}
            providers={["google", "github"]}
          />
        </div>
      ) : (
        <MainLayout />
      ),
    },
    {
      path: "/",
      element: session ? <MainLayout /> : <Auth />,
      children: routes,
    },
    {
      path: "/settings",
      element: <Settings />,
    },
    {
      path: "/board",
      element: <BoardView />,
    },
    {
      path: "/csv-import",
      element: <CSVImport />,
    },
    {
      path: "/analytics",
      element: <Analytics />,
    },
    {
      path: "/embed-form",
      element: <EmbedForm />,
    },
    {
      path: "/external-form-admin",
      element: <ExternalFormAdmin />,
    },
    {
      path: "/external-form",
      element: <ExternalFormController />,
    },
  ]);

  return (
    <>
      {routeElements}
      <Toaster />
    </>
  );
}
