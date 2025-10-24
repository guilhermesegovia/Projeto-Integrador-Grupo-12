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
import { Upload, ImageIcon, Search, Shield, Plus } from "lucide-react";

const EpiConsulta = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchCA, setSearchCA] = useState("");
  const [formData, setFormData] = useState({
    tipoEquipamento: "",
    modoUtilizacao: "",
    fabricante: "",
    prazoValidadeCA: "",
  });

  // Mock data - em produção viria de um backend
  const episData = [
    {
      id: 1,
      tipo: "Capacete de Segurança",
      ca: "12345",
      fabricante: "SafetyPro",
      validade: "2025-12-31",
      modoUtilizacao: "Usar durante todo o período de trabalho em áreas de risco de impacto.",
    },
    {
      id: 2,
      tipo: "Luvas de Proteção",
      ca: "67890",
      fabricante: "ProtectHands",
      validade: "2025-08-15",
      modoUtilizacao: "Utilizar ao manusear materiais cortantes ou quentes.",
    },
    {
      id: 3,
      tipo: "Óculos de Segurança",
      ca: "54321",
      fabricante: "VisionSafe",
      validade: "2025-06-20",
      modoUtilizacao: "Usar em ambientes com risco de projeção de partículas.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: "EPI cadastrado!",
      description: "Equipamento registrado com sucesso no sistema.",
    });

    setFormData({
      tipoEquipamento: "",
      modoUtilizacao: "",
      fabricante: "",
      prazoValidadeCA: "",
    });
    setImagePreview(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  const filteredEpis = episData.filter((epi) =>
    epi.ca.includes(searchCA)
  );

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

          <Tabs defaultValue="consulta" className="w-full">
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
                  <div className="flex items-center gap-4">
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
                          <CardTitle className="text-xl">{epi.tipo}</CardTitle>
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
                            {new Date(epi.validade).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <Label className="text-muted-foreground text-sm">Modo de Utilização</Label>
                        <p className="mt-2 text-sm leading-relaxed">{epi.modoUtilizacao}</p>
                      </div>
                      <div className="flex gap-2 mt-6">
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <div className="space-y-2">
                      <Label htmlFor="fotoEquipamento">Foto do Equipamento</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Input
                              id="fotoEquipamento"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                      {imagePreview && (
                        <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                          <div className="flex items-start gap-4">
                            <ImageIcon className="w-5 h-5 text-primary mt-1" />
                            <div className="flex-1">
                              <p className="text-sm font-medium mb-2">Preview da imagem:</p>
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-w-full h-auto rounded-lg max-h-64 object-cover shadow-card"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {!imagePreview && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Upload className="w-4 h-4" />
                          <span>Selecione uma imagem do equipamento</span>
                        </div>
                      )}
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
    </div>
  );
};

export default EpiConsulta;
