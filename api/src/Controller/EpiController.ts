import { app } from "../server";
import { EPIService } from "../Service/EPI";
import { EPI } from "../Model/EPI";

export function EPIController() {
  const service = new EPIService();

  const formatarEPI = (epi: EPI) => ({
    epi: epi.getepi(),
    tipo: epi.gettipo(),
    CA: epi.getCA(),
    validade: epi.getvalidade(),
    modouso: epi.getmodouso(),
    fabricante: epi.getfabricante(),
    data_entrada: epi.getdata_entrada(),
  });


  app.post("/api/epis", (req, res) => {
    try {
      const dadosEPI = req.body;
      
      const novoEPI = service.createEPI(dadosEPI);
      
      res.status(201).json({
        status: "EPI cadastrado com sucesso",
        dados: formatarEPI(novoEPI),
      });
    } catch (e: any) {
      return res.status(400).json({ erro: e.message });
    }
  });

  app.get("/api/epis", (req, res) => {
    const epis = service.getEPIs();
    const episFormatados = epis.map(formatarEPI);
    res.json(episFormatados);
  });

  app.get("/api/epis/buscar/ca", (req, res) => {
    const { ca } = req.query; 

    if (!ca) {
      return res.status(400).json({
        mensagem: "Parâmetro de busca inválido. Use: ca.",
      });
    }

    const epi = service.getEPIByCA(ca as string);

    if (!epi) {
      return res.status(404).json({ mensagem: "EPI não encontrado com o CA fornecido." });
    }

    return res.status(200).json(formatarEPI(epi));
  });

  app.get("/api/epis/buscar/vencimento", (req, res) => {
    const dias = req.query.dias ? parseInt(req.query.dias as string) : 90;

    if (isNaN(dias) || dias < 0) {
        return res.status(400).json({ mensagem: "O parâmetro 'dias' deve ser um número positivo." });
    }

    const episProximos = service.visualizarCAsProximosDeVencer(dias);
    const episFormatados = episProximos.map(formatarEPI);
    
    return res.status(200).json({
        mensagem: `EPIs com CA próximos de vencer (dentro dos próximos ${dias} dias)`,
        dados: episFormatados
    });
  });

  app.get("/api/epis/buscar", (req, res) => {
    const { dataMin, dataMax } = req.query;

    if (!dataMin || !dataMax) {
      return res.status(400).json({
        mensagem: "Parâmetros de busca inválidos. Use: dataMin e dataMax no formato YYYY-MM-DD.",
      });
    }
    
    const minDate = new Date(dataMin as string);
    const maxDate = new Date(dataMax as string);

    if (isNaN(minDate.getTime()) || isNaN(maxDate.getTime())) {
        return res.status(400).json({ mensagem: "Formato de data inválido. Use YYYY-MM-DD." });
    }

    const epis = service.filtrarEPIPorDataparaExpirar(minDate, maxDate);
    const episFormatados = epis.map(formatarEPI);
    
    return res.status(200).json(episFormatados);
  });
  
  app.post("/api/epis/substituicao", (req, res) => {
    try {
      const { Funcionario, novoEpiData, motivoSubstituicao } = req.body;

      if (!Funcionario || !novoEpiData || !motivoSubstituicao) {
        throw new Error("Dados de substituição incompletos (CPF do funcionário, dados do novo EPI e motivo são obrigatórios).");
      }

      const historicoRegistro = service.substituirEPIpertovencimento(
        Funcionario as string,
        novoEpiData,
        motivoSubstituicao as string
      );

      res.status(201).json({
        status: "Substituição e novo EPI registrados com sucesso.",
        historico: historicoRegistro
      });
    } catch (e: any) {
      return res.status(400).json({ erro: e.message });
    }
  });

  // Atribuir EPI a um funcionário
  app.post("/api/epis/atribuir", (req, res) => {
    try {
      const { cpfFuncionario, caEPI } = req.body;

      if (!cpfFuncionario || !caEPI) {
        throw new Error("CPF do funcionário e CA do EPI são obrigatórios.");
      }

      const atribuicao = service.atribuirEPIFuncionario(cpfFuncionario, caEPI);

      res.status(201).json({
        status: "EPI atribuído com sucesso ao funcionário.",
        dados: atribuicao
      });
    } catch (e: any) {
      return res.status(400).json({ erro: e.message });
    }
  });

  // Buscar EPIs ativos de um funcionário
  app.get("/api/epis/funcionario/:cpf", (req, res) => {
    try {
      const { cpf } = req.params;

      if (!cpf) {
        throw new Error("CPF do funcionário é obrigatório.");
      }

      const episAtivos = service.getEPIsFuncionario(cpf);

      res.status(200).json(episAtivos);
    } catch (e: any) {
      return res.status(400).json({ erro: e.message });
    }
  });

  // Buscar histórico completo de EPIs de um funcionário
  app.get("/api/epis/funcionario/:cpf/historico", (req, res) => {
    try {
      const { cpf } = req.params;

      if (!cpf) {
        throw new Error("CPF do funcionário é obrigatório.");
      }

      const historico = service.getHistoricoFuncionario(cpf);

      res.status(200).json(historico);
    } catch (e: any) {
      return res.status(400).json({ erro: e.message });
    }
  });
}
