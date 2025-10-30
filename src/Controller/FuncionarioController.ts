import { app } from "../server"; 
import { FuncionarioService } from "../Service/Funcionarios";

export function FuncionarioController() {
  const service = new FuncionarioService();

  
  const formatarFuncionario = (funcionario: any) => ({
    nome: funcionario.getnome(),
    cpf: funcionario.getcpf(),
    setor: funcionario.getsetor(),
    cargo: funcionario.getcargo(),
  });



  app.post("/funcionarios", (req, res) => {
    try {
      const dadosFuncionario = req.body;
      
      if (!dadosFuncionario.nome || !dadosFuncionario.cpf || !dadosFuncionario.setor || !dadosFuncionario.cargo) {
          throw new Error("Dados de cadastro incompletos. Nome, CPF, Setor e Cargo são obrigatórios.");
      }
      
      const novoFuncionario = service.createFuncionario(dadosFuncionario);
      
      res.status(201).json({
        status: "Funcionário cadastrado com sucesso",
        dados: formatarFuncionario(novoFuncionario),
      });
    } catch (e: any) {
      return res.status(400).json({ erro: e.message });
    }
  });


  app.get("/funcionarios", (req, res) => {
    const funcionarios = service.getFuncionarios();
    const funcionariosFormatados = funcionarios.map(formatarFuncionario);
    res.json(funcionariosFormatados);
  });


  app.get("/funcionarios/buscar", (req, res) => {
    const { cpf } = req.query; // Apenas CPF

    let funcionario: any | undefined;


    if (cpf) {
      try {
        funcionario = service.consultarFuncionarioporcpf(cpf as any);
      } catch (e: any) {

        return res.status(400   ).json({ mensagem: e.message });
      }
    } 

    else {
      return res.status(400).json({
        mensagem: "Parâmetro de busca inválido. Use: cpf.",
      });
    }

    if (!funcionario) {
      return res.status(404).json({ mensagem: "Funcionário não encontrado com o CPF fornecido." });
    }


    return res.status(200).json(formatarFuncionario(funcionario));
  });
}
