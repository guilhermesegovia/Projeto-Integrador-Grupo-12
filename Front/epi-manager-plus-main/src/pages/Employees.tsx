import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UserPlus, Search, Shield, User, AlertTriangle, RefreshCw, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Employees = () => {
  const { toast } = useToast();
  const [searchCpf, setSearchCpf] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    cargo: "",
    setor: "",
    dataAdmissao: "",
  });
  const [selectedEpis, setSelectedEpis] = useState<string[]>([]);
  const [selectedEmployeeForSwap, setSelectedEmployeeForSwap] = useState<number | null>(null);
  const [epiToSwap, setEpiToSwap] = useState<string>("");
  const [newEpiId, setNewEpiId] = useState<string>("");

  // EPIs disponíveis no sistema
  const episDisponiveis = [
    { id: "1", tipo: "Capacete de Segurança", ca: "12345", validade: "2025-12-31" },
    { id: "2", tipo: "Luvas de Proteção", ca: "67890", validade: "2025-08-15" },
    { id: "3", tipo: "Óculos de Segurança", ca: "54321", validade: "2025-06-20" },
    { id: "4", tipo: "Protetor Auricular", ca: "98765", validade: "2026-03-10" },
  ];

  // Função para verificar se o EPI está próximo do vencimento (30 dias)
  const isEpiNearExpiry = (validade: string) => {
    const dataValidade = new Date(validade);
    const hoje = new Date();
    const diffTime = dataValidade.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const isEpiExpired = (validade: string) => {
    const dataValidade = new Date(validade);
    const hoje = new Date();
    return dataValidade < hoje;
  };

  // Mock data - em produção viria de um backend
  const employeesData = [
    {
      id: 1,
      nome: "João Silva",
      cpf: "123.456.789-00",
      cargo: "Operador de Máquinas",
      setor: "Produção",
      epis: [
        { tipo: "Capacete de Segurança", ca: "12345", validade: "2025-12-31" },
        { tipo: "Luvas de Proteção", ca: "67890", validade: "2025-11-15" },
      ],
      historicoEpis: [
        { tipo: "Luvas de Proteção", ca: "11111", dataEntrega: "2024-06-10", dataDevolucao: "2025-10-20", motivo: "Vencimento" },
        { tipo: "Capacete de Segurança", ca: "22222", dataEntrega: "2024-01-15", dataDevolucao: "2025-09-10", motivo: "Desgaste" },
      ],
    },
    {
      id: 2,
      nome: "Maria Santos",
      cpf: "987.654.321-00",
      cargo: "Técnica de Segurança",
      setor: "Segurança do Trabalho",
      epis: [
        { tipo: "Óculos de Segurança", ca: "54321", validade: "2025-06-20" },
        { tipo: "Protetor Auricular", ca: "98765", validade: "2026-03-10" },
      ],
      historicoEpis: [
        { tipo: "Óculos de Segurança", ca: "33333", dataEntrega: "2024-03-20", dataDevolucao: "2025-05-15", motivo: "Troca preventiva" },
      ],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Funcionário cadastrado!",
      description: `Funcionário registrado com ${selectedEpis.length} EPI(s) atribuído(s).`,
    });
    setFormData({
      nome: "",
      cpf: "",
      cargo: "",
      setor: "",
      dataAdmissao: "",
    });
    setSelectedEpis([]);
  };

  const handleEpiToggle = (epiId: string) => {
    setSelectedEpis((prev) =>
      prev.includes(epiId)
        ? prev.filter((id) => id !== epiId)
        : [...prev, epiId]
    );
  };

  const handleSwapEpi = () => {
    if (!newEpiId || !epiToSwap) {
      toast({
        title: "Erro",
        description: "Selecione um EPI para substituir.",
        variant: "destructive",
      });
      return;
    }

    const novoEpi = episDisponiveis.find(e => e.id === newEpiId);
    
    toast({
      title: "EPI trocado com sucesso!",
      description: `${epiToSwap} foi substituído por ${novoEpi?.tipo}.`,
    });

    setSelectedEmployeeForSwap(null);
    setEpiToSwap("");
    setNewEpiId("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    if (!searchCpf) {
      toast({
        title: "CPF necessário",
        description: "Digite um CPF para realizar a busca.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Buscando funcionário...",
      description: `Pesquisando CPF: ${searchCpf}`,
    });
  };

  const filteredEmployees = employeesData.filter((emp) =>
    emp.cpf.replace(/\D/g, "").includes(searchCpf.replace(/\D/g, ""))
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12 bg-muted/30">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Gestão de Funcionários</h1>
            <p className="text-muted-foreground">
              Cadastre e consulte funcionários e seus EPIs
            </p>
          </div>

          <Tabs defaultValue="consulta" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="consulta" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Consultar Funcionários
              </TabsTrigger>
              <TabsTrigger value="cadastro" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Cadastrar Funcionário
              </TabsTrigger>
            </TabsList>

            <TabsContent value="consulta">
              <Card className="shadow-elevated mb-6">
                <CardHeader>
                  <CardTitle>Buscar por CPF</CardTitle>
                  <CardDescription>
                    Digite o CPF do funcionário para visualizar seus dados e EPIs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="000.000.000-00"
                        value={searchCpf}
                        onChange={(e) => setSearchCpf(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button onClick={handleSearch}>Buscar</Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6">
                {filteredEmployees.map((employee) => (
                  <Card key={employee.id} className="shadow-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{employee.nome}</CardTitle>
                            <CardDescription>CPF: {employee.cpf}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <Label className="text-muted-foreground text-sm">Cargo</Label>
                          <p className="text-lg font-semibold">{employee.cargo}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">Setor</Label>
                          <p className="text-lg font-semibold">{employee.setor}</p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">EPIs em uso</h3>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedEmployeeForSwap(employee.id)}
                              >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Trocar EPI
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Trocar EPI do Funcionário</DialogTitle>
                                <DialogDescription>
                                  Selecione o EPI atual e o novo EPI para realizar a troca
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>EPI Atual</Label>
                                  <Select value={epiToSwap} onValueChange={setEpiToSwap}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione o EPI a trocar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {employee.epis.map((epi, idx) => (
                                        <SelectItem key={idx} value={epi.tipo}>
                                          {epi.tipo} - CA: {epi.ca}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Novo EPI</Label>
                                  <Select value={newEpiId} onValueChange={setNewEpiId}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione o novo EPI" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {episDisponiveis.map((epi) => (
                                        <SelectItem key={epi.id} value={epi.id}>
                                          {epi.tipo} - CA: {epi.ca}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button onClick={handleSwapEpi} className="w-full">
                                  Confirmar Troca
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div className="grid gap-3">
                          {employee.epis.map((epi, index) => {
                            const nearExpiry = isEpiNearExpiry(epi.validade);
                            const expired = isEpiExpired(epi.validade);
                            
                            return (
                              <div
                                key={index}
                                className={`flex items-center justify-between p-3 rounded-lg ${
                                  expired 
                                    ? "bg-destructive/10 border border-destructive" 
                                    : nearExpiry 
                                    ? "bg-amber-500/10 border border-amber-500" 
                                    : "bg-muted/50"
                                }`}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{epi.tipo}</p>
                                    {expired && (
                                      <Badge variant="destructive" className="text-xs">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Vencido
                                      </Badge>
                                    )}
                                    {!expired && nearExpiry && (
                                      <Badge className="text-xs bg-amber-500 hover:bg-amber-600">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Próximo ao vencimento
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">CA: {epi.ca}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">Validade</p>
                                  <p className={`text-sm font-medium ${
                                    expired ? "text-destructive" : nearExpiry ? "text-amber-600" : ""
                                  }`}>
                                    {new Date(epi.validade).toLocaleDateString("pt-BR")}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Histórico de EPIs */}
                      <div className="border-t pt-4 mt-4">
                        <div className="flex items-center gap-2 mb-4">
                          <History className="w-5 h-5 text-muted-foreground" />
                          <h3 className="font-semibold">Histórico de EPIs</h3>
                        </div>
                        <div className="space-y-2">
                          {employee.historicoEpis && employee.historicoEpis.length > 0 ? (
                            employee.historicoEpis.map((historico, idx) => (
                              <div
                                key={idx}
                                className="p-3 rounded-lg bg-muted/30 border"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-sm">{historico.tipo}</p>
                                    <p className="text-xs text-muted-foreground">CA: {historico.ca}</p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {historico.motivo}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                                  <div>
                                    <span className="font-medium">Entrega:</span>{" "}
                                    {new Date(historico.dataEntrega).toLocaleDateString("pt-BR")}
                                  </div>
                                  <div>
                                    <span className="font-medium">Devolução:</span>{" "}
                                    {new Date(historico.dataDevolucao).toLocaleDateString("pt-BR")}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              Nenhum histórico de EPI registrado
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {searchCpf && filteredEmployees.length === 0 && (
                  <Card className="shadow-card">
                    <CardContent className="py-12 text-center">
                      <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nenhum funcionário encontrado com este CPF.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="cadastro">
              <Card className="shadow-elevated">
                <CardHeader>
                  <CardTitle className="text-2xl">Cadastrar Novo Funcionário</CardTitle>
                  <CardDescription>
                    Preencha os dados do funcionário para cadastro no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                          id="nome"
                          name="nome"
                          placeholder="Digite o nome completo"
                          value={formData.nome}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF *</Label>
                        <Input
                          id="cpf"
                          name="cpf"
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dataAdmissao">Data de Admissão *</Label>
                        <Input
                          id="dataAdmissao"
                          name="dataAdmissao"
                          type="date"
                          value={formData.dataAdmissao}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cargo">Cargo *</Label>
                        <Input
                          id="cargo"
                          name="cargo"
                          placeholder="Ex: Operador, Técnico..."
                          value={formData.cargo}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="setor">Setor *</Label>
                        <Input
                          id="setor"
                          name="setor"
                          placeholder="Ex: Produção, Manutenção..."
                          value={formData.setor}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4 border-t pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-primary" />
                        <Label className="text-base font-semibold">Atribuir EPIs</Label>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Selecione os EPIs que serão fornecidos ao funcionário
                      </p>
                      <div className="grid gap-3">
                        {episDisponiveis.map((epi) => (
                          <div
                            key={epi.id}
                            className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                          >
                            <Checkbox
                              id={`epi-${epi.id}`}
                              checked={selectedEpis.includes(epi.id)}
                              onCheckedChange={() => handleEpiToggle(epi.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor={`epi-${epi.id}`}
                                className="font-medium cursor-pointer"
                              >
                                {epi.tipo}
                              </Label>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <span>CA: {epi.ca}</span>
                                <span>•</span>
                                <span>
                                  Validade: {new Date(epi.validade).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="submit" className="flex-1">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Cadastrar Funcionário
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Employees;
