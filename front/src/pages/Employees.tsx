import { useState, useEffect } from "react";
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
import { UserPlus, Search, Shield, User, AlertTriangle, RefreshCw, History, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { funcionariosApi, episApi } from "@/services/api";

const Employees = () => {
  const { toast } = useToast();
  const [searchCpf, setSearchCpf] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    cargo: "",
    setor: "",
  });
  const [selectedEmployeeForSwap, setSelectedEmployeeForSwap] = useState<number | null>(null);
  const [selectedEmployeeForAssign, setSelectedEmployeeForAssign] = useState<string | null>(null);
  const [epiToSwap, setEpiToSwap] = useState<string>("");
  const [newEpiId, setNewEpiId] = useState<string>("");
  const [epiToAssign, setEpiToAssign] = useState<string>("");
  const [employeesData, setEmployeesData] = useState<any[]>([]);
  const [episDisponiveis, setEpisDisponiveis] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  // Carregar funcionários e EPIs da API
  useEffect(() => {
    loadFuncionarios();
    loadEPIs();
  }, []);

  const loadFuncionarios = async () => {
    try {
      const funcionarios = await funcionariosApi.buscarTodos();

      // Carregar EPIs e histórico para cada funcionário
      const funcionariosComEpis = await Promise.all(
        funcionarios.map(async (f: any) => {
          try {
            const episAtivos = await episApi.buscarEpisFuncionario(f.cpf);
            const historico = await episApi.buscarHistoricoFuncionario(f.cpf);

            return {
              id: f.cpf,
              nome: f.nome,
              cpf: f.cpf,
              cargo: f.cargo,
              setor: f.setor,
              epis: episAtivos.map((e: any) => ({
                tipo: e.epi.tipo,
                ca: e.epi.CA,
                validade: e.epi.validade,
              })),
              historicoEpis: historico
                .filter((h: any) => h.dataDevolucao !== null)
                .map((h: any) => ({
                  tipo: h.epi.tipo,
                  ca: h.epi.CA,
                  dataEntrega: h.dataEntrega,
                  dataDevolucao: h.dataDevolucao,
                  motivo: h.motivoSubstituicao,
                })),
            };
          } catch (error) {
            // Se não houver EPIs ou histórico, retorna funcionário sem EPIs
            return {
              id: f.cpf,
              nome: f.nome,
              cpf: f.cpf,
              cargo: f.cargo,
              setor: f.setor,
              epis: [],
              historicoEpis: [],
            };
          }
        })
      );

      setEmployeesData(funcionariosComEpis);
    } catch (error: any) {
      console.error("Erro ao carregar funcionários:", error);
    }
  };

  const loadEPIs = async () => {
    try {
      const epis = await episApi.buscarTodos();
      setEpisDisponiveis(epis.map((e: any) => ({
        id: e.CA,
        tipo: e.tipo,
        ca: e.CA,
        validade: e.validade,
      })));
    } catch (error: any) {
      console.error("Erro ao carregar EPIs:", error);
    }
  };

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


  const generateEmployeePDF = (employee: any) => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text("Security Pro", 105, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.text("Ficha do Funcionário", 105, 30, { align: "center" });
    
    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Informações do funcionário
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Dados Pessoais:", 20, 45);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Nome: ${employee.nome}`, 20, 55);
    doc.text(`CPF: ${employee.cpf}`, 20, 62);
    doc.text(`Cargo: ${employee.cargo}`, 20, 69);
    doc.text(`Setor: ${employee.setor}`, 20, 76);
    
    // EPIs em uso
    doc.setFont("helvetica", "bold");
    doc.text("EPIs em Uso:", 20, 90);
    
    doc.setFont("helvetica", "normal");
    let yPosition = 100;
    
    if (employee.epis && employee.epis.length > 0) {
      employee.epis.forEach((epi: any, index: number) => {
        const nearExpiry = isEpiNearExpiry(epi.validade);
        const expired = isEpiExpired(epi.validade);
        
        doc.text(`${index + 1}. ${epi.tipo}`, 25, yPosition);
        doc.text(`   CA: ${epi.ca}`, 25, yPosition + 7);
        doc.text(`   Validade: ${new Date(epi.validade).toLocaleDateString("pt-BR")}`, 25, yPosition + 14);
        
        if (expired) {
          doc.setTextColor(255, 0, 0);
          doc.text("   Status: VENCIDO", 25, yPosition + 21);
          doc.setTextColor(0, 0, 0);
        } else if (nearExpiry) {
          doc.setTextColor(255, 165, 0);
          doc.text("   Status: Próximo ao vencimento", 25, yPosition + 21);
          doc.setTextColor(0, 0, 0);
        } else {
          doc.setTextColor(0, 128, 0);
          doc.text("   Status: Válido", 25, yPosition + 21);
          doc.setTextColor(0, 0, 0);
        }
        
        yPosition += 35;
      });
    } else {
      doc.text("Nenhum EPI atribuído", 25, yPosition);
      yPosition += 20;
    }
    
    // Histórico de EPIs
    if (employee.historicoEpis && employee.historicoEpis.length > 0) {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFont("helvetica", "bold");
      doc.text("Histórico de EPIs:", 20, yPosition);
      yPosition += 10;
      
      doc.setFont("helvetica", "normal");
      employee.historicoEpis.forEach((historico: any, index: number) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`${index + 1}. ${historico.tipo} (CA: ${historico.ca})`, 25, yPosition);
        doc.text(`   Entrega: ${new Date(historico.dataEntrega).toLocaleDateString("pt-BR")}`, 25, yPosition + 7);
        doc.text(`   Devolução: ${new Date(historico.dataDevolucao).toLocaleDateString("pt-BR")}`, 25, yPosition + 14);
        doc.text(`   Motivo: ${historico.motivo}`, 25, yPosition + 21);
        
        yPosition += 30;
      });
    }
    
    // Rodapé
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
        105,
        285,
        { align: "center" }
      );
      doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: "center" });
    }
    
    // Salvar PDF
    doc.save(`ficha_${employee.nome.replace(/\s+/g, "_")}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      await funcionariosApi.criar(formData);

      toast({
        title: "Funcionário cadastrado!",
        description: `${formData.nome} foi registrado com sucesso.`,
      });

      setFormData({
        nome: "",
        cpf: "",
        cargo: "",
        setor: "",
      });

      await loadFuncionarios();
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar",
        description: error.message || "Erro ao cadastrar funcionário.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

  const handleAssignEpi = async () => {
    if (!selectedEmployeeForAssign || !epiToAssign) {
      toast({
        title: "Erro",
        description: "Selecione um funcionário e um EPI.",
        variant: "destructive",
      });
      return;
    }

    try {
      await episApi.atribuir(selectedEmployeeForAssign, epiToAssign);

      toast({
        title: "EPI atribuído com sucesso!",
        description: "O EPI foi atribuído ao funcionário.",
      });

      setIsAssignDialogOpen(false);
      setSelectedEmployeeForAssign(null);
      setEpiToAssign("");

      // Recarregar funcionários
      await loadFuncionarios();
    } catch (error: any) {
      toast({
        title: "Erro ao atribuir EPI",
        description: error.message || "Erro ao atribuir EPI ao funcionário.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async () => {
    if (!searchCpf) {
      toast({
        title: "CPF necessário",
        description: "Digite um CPF para realizar a busca.",
        variant: "destructive",
      });
      return;
    }

    try {
      const resultado = await funcionariosApi.buscarPorCpf(searchCpf.replace(/\D/g, ""));
      if (resultado && resultado.length > 0) {
        toast({
          title: "Funcionário encontrado!",
          description: `${resultado.length} funcionário(s) encontrado(s).`,
        });
      } else {
        toast({
          title: "Nenhum resultado",
          description: "Funcionário não encontrado.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro na busca",
        description: error.message || "Erro ao buscar funcionário.",
        variant: "destructive",
      });
    }
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateEmployeePDF(employee)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Exportar PDF
                        </Button>
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
                          <div className="flex gap-2">
                            <Dialog open={isAssignDialogOpen && selectedEmployeeForAssign === employee.cpf} onOpenChange={(open) => {
                              setIsAssignDialogOpen(open);
                              if (!open) {
                                setSelectedEmployeeForAssign(null);
                                setEpiToAssign("");
                              }
                            }}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedEmployeeForAssign(employee.cpf);
                                    setIsAssignDialogOpen(true);
                                  }}
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  Atribuir EPI
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Atribuir EPI ao Funcionário</DialogTitle>
                                  <DialogDescription>
                                    Selecione um EPI disponível para atribuir ao funcionário
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Selecione o EPI</Label>
                                    <Select value={epiToAssign} onValueChange={setEpiToAssign}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione o EPI" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {episDisponiveis.map((epi, index) => (
                                          <SelectItem key={`assign-${epi.id}-${index}`} value={epi.ca}>
                                            {epi.tipo} - CA: {epi.ca}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Button onClick={handleAssignEpi} className="w-full">
                                    Confirmar Atribuição
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
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
                                      {episDisponiveis.map((epi, index) => (
                                        <SelectItem key={`${epi.id}-${index}`} value={epi.id}>
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


                    <div className="flex gap-4 pt-4">
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        {isLoading ? "Cadastrando..." : "Cadastrar Funcionário"}
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
