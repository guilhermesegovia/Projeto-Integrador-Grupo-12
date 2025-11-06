import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Users, BarChart3, HeadphonesIcon, Clock, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Sistema de segurança do trabalho
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-95">
              Controle completo dos equipamentos de proteção individual da sua empresa.
              Segurança, conformidade e eficiência em um único lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-lg px-8 shadow-elevated bg-white text-primary hover:bg-white/90"
                onClick={() => navigate("/register")}
              >
                Começar Agora
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-2 border-white text-white hover:bg-white/10"
                onClick={() => navigate("/login")}
              >
                Fazer Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Recursos Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-elevated transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Registro de EPIs</CardTitle>
                <CardDescription>
                  Cadastre e gerencie todos os equipamentos de proteção individual com fotos e certificados.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card hover:shadow-elevated transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Controle de Estoque</CardTitle>
                <CardDescription>
                  Acompanhe o estoque de EPIs com estatísticas detalhadas e alertas de validade.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card hover:shadow-elevated transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Gestão de Usuários</CardTitle>
                <CardDescription>
                  Controle de acesso por empresa com cadastro completo de dados corporativos.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Suporte e Contato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center shadow-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <HeadphonesIcon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Suporte ao Usuário</CardTitle>
                <CardContent className="pt-4">
                  <p className="text-muted-foreground">
                    Equipe especializada pronta para ajudar você
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="text-center shadow-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Horário de Atendimento</CardTitle>
                <CardContent className="pt-4">
                  <p className="text-muted-foreground text-sm">
                    Seg-Sex: 8h às 18h<br />
                    Sáb: 8h às 12h
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="text-center shadow-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Entre em Contato</CardTitle>
                <CardContent className="pt-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      (11) 3000-0000
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      contato@securitypro.com.br
                    </p>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
