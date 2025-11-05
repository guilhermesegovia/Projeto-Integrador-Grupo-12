import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertTriangle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SupportAdmin = () => {
  const { toast } = useToast();
  const [supportForm, setSupportForm] = useState({
    name: "",
    errorDescription: "",
    urgency: "",
    date: "",
    status: ""
  });

  const handleSupportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSupportForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Ticket de suporte criado!",
      description: `Ticket registrado para ${supportForm.name}. Status: ${supportForm.status}`,
      duration: 5000,
    });

    setSupportForm({
      name: "",
      errorDescription: "",
      urgency: "",
      date: "",
      status: ""
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-16">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Área de Suporte - Empresa/Dev
            </h1>
            <p className="text-lg md:text-xl opacity-95">
              Registre e gerencie tickets de suporte técnico
            </p>
          </div>
        </div>
      </section>

      {/* Support Tickets Form */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="text-2xl">Registrar Ticket de Suporte</CardTitle>
                <CardDescription>
                  Registre problemas técnicos e acompanhe o status das resoluções
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSupportSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="support-name">Nome *</Label>
                    <Input
                      id="support-name"
                      name="name"
                      value={supportForm.name}
                      onChange={handleSupportChange}
                      placeholder="Nome do responsável"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="errorDescription">Descrição do Erro *</Label>
                    <Textarea
                      id="errorDescription"
                      name="errorDescription"
                      value={supportForm.errorDescription}
                      onChange={handleSupportChange}
                      placeholder="Descreva detalhadamente o erro encontrado..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgência *</Label>
                      <Select 
                        value={supportForm.urgency} 
                        onValueChange={(value) => setSupportForm(prev => ({ ...prev, urgency: value }))}
                        required
                      >
                        <SelectTrigger id="urgency">
                          <SelectValue placeholder="Selecione a urgência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixa">Baixa</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="critica">Crítica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Data *</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={supportForm.date}
                        onChange={handleSupportChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status do Problema *</Label>
                    <Select 
                      value={supportForm.status} 
                      onValueChange={(value) => setSupportForm(prev => ({ ...prev, status: value }))}
                      required
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aberto">Aberto</SelectItem>
                        <SelectItem value="em-analise">Em Análise</SelectItem>
                        <SelectItem value="em-andamento">Em Andamento</SelectItem>
                        <SelectItem value="aguardando">Aguardando Resposta</SelectItem>
                        <SelectItem value="resolvido">Resolvido</SelectItem>
                        <SelectItem value="fechado">Fechado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="w-4 h-4 mr-2" />
                    Registrar Ticket de Suporte
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

export default SupportAdmin;
