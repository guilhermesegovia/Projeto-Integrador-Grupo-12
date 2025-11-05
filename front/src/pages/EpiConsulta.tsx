import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Shield, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EPI {
  id: string;
  nomeEPI: string;
  tipoEquipamento: string;
  ca: string;
  modoUtilizacao: string;
  fabricante: string;
  prazoValidadeCA: string;
}

const EpiConsulta = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchCA, setSearchCA] = useState("");
  const [dataMinima, setDataMinima] = useState("");
  const [dataMaxima, setDataMaxima] = useState("");
  const [selectedEpiId, setSelectedEpiId] = useState<string>("novo");
  const [episCadastrados, setEpisCadastrados] = useState<EPI[]>([]);
  const [activeTab, setActiveTab] = useState("consulta");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedEpiForDetails, setSelectedEpiForDetails] = useState<EPI | null>(null);
  const [formData, setFormData] = useState({
    nomeEPI: "",
    tipoEquipamento: "",
    ca: "",
    modoUtilizacao: "",
    fabricante: "",
    prazoValidadeCA: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const novoEpi: EPI = {
      id: Date.now().toString(),
      ...formData
    };

    setEpisCadastrados([...episCadastrados, novoEpi]);

    toast({
      title: "EPI cadastrado!",
      description: "Equipamento registrado com sucesso no sistema.",
    });

    setFormData({
      nomeEPI: "",
      tipoEquipamento: "",
      ca: "",
      modoUtilizacao: "",
      fabricante: "",
      prazoValidadeCA: "",
    });
    setSelectedEpiId("novo");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEpiSelect = (value: string) => {
    setSelectedEpiId(value);
    if (value === "novo") {
      setFormData({
        nomeEPI: "",
        tipoEquipamento: "",
        ca: "",
        modoUtilizacao: "",
        fabricante: "",
        prazoValidadeCA: "",
      });
    } else {
      const epiSelecionado = episCadastrados.find(epi => epi.id === value);
      if (epiSelecionado) {
        setFormData({
          nomeEPI: epiSelecionado.nomeEPI,
          tipoEquipamento: epiSelecionado.tipoEquipamento,
          ca: epiSelecionado.ca,
          modoUtilizacao: epiSelecionado.modoUtilizacao,
          fabricante: epiSelecionado.fabricante,
          prazoValidadeCA: epiSelecionado.prazoValidadeCA,
        });
      }
    }
  };

  const handleSearch = () => {
    if (!searchCA) {
      toast({
        title: "CA necessário",
        description: "Digite um número de CA para realizar a busca.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Buscando EPI...",
      description: `Pesquisando CA: ${searchCA}`,
    });
  };

  const filteredEpis = episCadastrados.filter((epi) => {
    const caMatch = epi.ca.includes(searchCA);
    
    if (!dataMinima && !dataMaxima) {
      return caMatch;
    }
    
    const validadeEpi = new Date(epi.prazoValidadeCA);
    const min = dataMinima ? new Date(dataMinima) : null;
    const max = dataMaxima ? new Date(dataMaxima) : null;
    
    const dentroIntervalo = 
      (!min || validadeEpi >= min) && 
      (!max || validadeEpi <= max);
    
    return caMatch && dentroIntervalo;
  });

  const handleViewDetails = (epi: EPI) => {
    setSelectedEpiForDetails(epi);
    setDetailsDialogOpen(true);
  };

  const handleEdit = (epi: EPI) => {
    setSelectedEpiId(epi.id);
    setFormData({
      nomeEPI: epi.nomeEPI,
      tipoEquipamento: epi.tipoEquipamento,
      ca: epi.ca,
      modoUtilizacao: epi.modoUtilizacao,
      fabricante: epi.fabricante,
      prazoValidadeCA: epi.prazoValidadeCA,
    });
    setActiveTab("registro");
    toast({
      title: "Modo de edição",
      description: "Você pode agora editar os dados do EPI selecionado.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-12 bg-muted/30">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Gestão de EPIs</h1>
            <p className="text-muted-foreground">
              Consulte e registre Equipamentos de Proteção Individual
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="consulta" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Consultar por CA
              </TabsTrigger>
              <TabsTrigger value="registro" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Registrar EPI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="consulta">
              <Card className="shadow-elevated mb-6">
                <CardHeader>
                  <CardTitle>Buscar por Certificado de Aprovação (CA)</CardTitle>
                  <CardDescription>
                    Digite o número do CA para visualizar informações do equipamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Digite o número do CA"
                        value={searchCA}
                        onChange={(e) => setSearchCA(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button onClick={handleSearch}>Buscar</Button>
                  </div>
                  
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium mb-3 block">
                      Filtrar por período de validade
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dataMinima" className="text-sm text-muted-foreground">
                          Data mínima
                        </Label>
                        <Input
                          id="dataMinima"
                          type="date"
                          value={dataMinima}
                          onChange={(e) => setDataMinima(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dataMaxima" className="text-sm text-muted-foreground">
                          Data máxima
                        </Label>
                        <Input
                          id="dataMaxima"
                          type="date"
                          value={dataMaxima}
                          onChange={(e) => setDataMaxima(e.target.value)}
                        />
                      </div>
                    </div>
                    {(dataMinima || dataMaxima) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => {
                          setDataMinima("");
                          setDataMaxima("");
                        }}
                      >
                        Limpar filtro de data
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6">
                {filteredEpis.map((epi) => (
                  <Card key={epi.id} className="shadow-card">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{epi.nomeEPI}</CardTitle>
                          <CardDescription>CA: {epi.ca}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label className="text-muted-foreground text-sm">Fabricante</Label>
                          <p className="text-lg font-semibold">{epi.fabricante}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">Validade CA</Label>
                          <p className="text-lg font-semibold">
                            {new Date(epi.prazoValidadeCA).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <Label className="text-muted-foreground text-sm">Modo de Utilização</Label>
                        <p className="mt-2 text-sm leading-relaxed">{epi.modoUtilizacao}</p>
                      </div>
                      <div className="flex gap-2 mt-6">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(epi)}>
                          Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(epi)}>
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {searchCA && filteredEpis.length === 0 && (
                  <Card className="shadow-card">
                    <CardContent className="py-12 text-center">
                      <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nenhum EPI encontrado com este CA.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="registro">
              <Card className="shadow-elevated">
                <CardHeader>
                  <CardTitle className="text-2xl">Registro de EPI</CardTitle>
                  <CardDescription>
                    Cadastre um novo Equipamento de Proteção Individual no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="epiSelector">Selecionar EPI</Label>
                      <Select value={selectedEpiId} onValueChange={handleEpiSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha um EPI existente ou cadastre novo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="novo">Cadastrar Novo EPI</SelectItem>
                          {episCadastrados.map((epi) => (
                            <SelectItem key={epi.id} value={epi.id}>
                              {epi.nomeEPI} - CA: {epi.ca}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Selecione um EPI já cadastrado para reutilizá-lo ou crie um novo
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="nomeEPI">Nome do EPI *</Label>
                        <Input
                          id="nomeEPI"
                          name="nomeEPI"
                          placeholder="Ex: Capacete 3M modelo X500"
                          value={formData.nomeEPI}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tipoEquipamento">Tipo de Equipamento *</Label>
                        <Input
                          id="tipoEquipamento"
                          name="tipoEquipamento"
                          placeholder="Ex: Capacete, Luvas, Óculos..."
                          value={formData.tipoEquipamento}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ca">Número do CA *</Label>
                        <Input
                          id="ca"
                          name="ca"
                          placeholder="Ex: 12345"
                          value={formData.ca}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fabricante">Fabricante *</Label>
                        <Input
                          id="fabricante"
                          name="fabricante"
                          value={formData.fabricante}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="modoUtilizacao">Modo de Utilização *</Label>
                        <Textarea
                          id="modoUtilizacao"
                          name="modoUtilizacao"
                          placeholder="Descreva como utilizar este equipamento..."
                          value={formData.modoUtilizacao}
                          onChange={handleChange}
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="prazoValidadeCA">Prazo de Validade CA *</Label>
                        <Input
                          id="prazoValidadeCA"
                          name="prazoValidadeCA"
                          type="date"
                          value={formData.prazoValidadeCA}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="submit" className="flex-1">
                        Cadastrar EPI
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/")}
                      >
                        Cancelar
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

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              {selectedEpiForDetails?.nomeEPI}
            </DialogTitle>
            <DialogDescription>
              Detalhes completos do equipamento de proteção individual
            </DialogDescription>
          </DialogHeader>
          {selectedEpiForDetails && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-muted-foreground text-sm">Tipo de Equipamento</Label>
                  <p className="text-base font-semibold mt-1">{selectedEpiForDetails.tipoEquipamento}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Número do CA</Label>
                  <p className="text-base font-semibold mt-1">{selectedEpiForDetails.ca}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Fabricante</Label>
                  <p className="text-base font-semibold mt-1">{selectedEpiForDetails.fabricante}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Validade do CA</Label>
                  <p className="text-base font-semibold mt-1">
                    {new Date(selectedEpiForDetails.prazoValidadeCA).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                <Label className="text-muted-foreground text-sm">Modo de Utilização</Label>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedEpiForDetails.modoUtilizacao}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EpiConsulta;
