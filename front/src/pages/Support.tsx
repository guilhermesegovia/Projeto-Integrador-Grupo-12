import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HeadphonesIcon, Mail, Phone, Clock, Send, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mensagem automática de resposta
    toast({
      title: "Mensagem enviada com sucesso!",
      description: `Olá ${formData.name}, recebemos sua mensagem e nossa equipe de suporte da Security Pro entrará em contato em até 24 horas úteis. Obrigado!`,
      duration: 5000,
    });

    // Limpar formulário
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-16">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <HeadphonesIcon className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Central de Suporte
            </h1>
            <p className="text-lg md:text-xl opacity-95">
              Estamos aqui para ajudar você. Entre em contato conosco!
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                size="sm"
                className="gap-2 bg-background/20 hover:bg-background/30 border-primary-foreground/20"
              >
                Voltar ao Home
              </Button>
              <Button 
                onClick={() => navigate('/support-admin')}
                variant="outline"
                size="sm"
                className="gap-2 bg-background/20 hover:bg-background/30 border-primary-foreground/20"
              >
                <Settings className="w-4 h-4" />
                Área Administrativa
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center shadow-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">E-mail</CardTitle>
                <CardContent className="pt-3">
                  <a 
                    href="mailto:safeworkgrp12@gmail.com"
                    className="text-sm text-primary hover:underline transition-all"
                  >
                    safeworkgrp12@gmail.com
                  </a>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="text-center shadow-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-lg">Telefone</CardTitle>
                <CardContent className="pt-3">
                  <p className="text-sm text-muted-foreground">
                    (11) 3000-0000
                  </p>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="text-center shadow-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Horário</CardTitle>
                <CardContent className="pt-3">
                  <p className="text-sm text-muted-foreground">
                    Seg-Sex: 8h às 18h<br />
                    Sáb: 8h às 12h
                  </p>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="text-2xl">Envie sua mensagem</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo e nossa equipe entrará em contato com você
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Assunto da mensagem"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Descreva como podemos ajudar você..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Support;
