import { API_URL } from "@/config/api";

export interface Funcionario {
  nome: string;
  cpf: string;
  setor: string;
  cargo: string;
}

export interface EPI {
  epi: string;
  tipo: string;
  CA: string;
  validade: string;
  modouso: string;
  fabricante: string;
  data_entrada: string;
}

export const funcionariosApi = {
  async criar(funcionario: Funcionario) {
    const response = await fetch(`${API_URL}/funcionarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(funcionario),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || "Erro ao cadastrar funcionário");
    }
    return response.json();
  },

  async buscarTodos() {
    const response = await fetch(`${API_URL}/funcionarios`);
    if (!response.ok) throw new Error("Erro ao buscar funcionários");
    return response.json();
  },

  async buscarPorCpf(cpf: string) {
    const response = await fetch(`${API_URL}/funcionarios/buscar?cpf=${cpf}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensagem || "Erro ao buscar funcionário");
    }
    return response.json();
  },
};

export const episApi = {
  async criar(epi: Omit<EPI, "data_entrada">) {
    const response = await fetch(`${API_URL}/epis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...epi,
        data_entrada: new Date().toISOString(),
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || "Erro ao cadastrar EPI");
    }
    return response.json();
  },

  async buscarTodos() {
    const response = await fetch(`${API_URL}/epis`);
    if (!response.ok) throw new Error("Erro ao buscar EPIs");
    return response.json();
  },

  async buscarPorCA(ca: string) {
    const response = await fetch(`${API_URL}/epis/buscar/ca?ca=${ca}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Erro ao buscar EPI");
    }
    return response.json();
  },

  async buscarProximosVencer(dias: number = 90) {
    const response = await fetch(`${API_URL}/epis/buscar/vencimento?dias=${dias}`);
    if (!response.ok) throw new Error("Erro ao buscar EPIs próximos ao vencimento");
    return response.json();
  },

  async buscarPorPeriodo(dataMin: string, dataMax: string) {
    const response = await fetch(`${API_URL}/epis/buscar?dataMin=${dataMin}&dataMax=${dataMax}`);
    if (!response.ok) throw new Error("Erro ao buscar EPIs por período");
    return response.json();
  },

  async substituir(cpfFuncionario: string, novoEpiData: any, motivoSubstituicao: string) {
    const response = await fetch(`${API_URL}/epis/substituicao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Funcionario: cpfFuncionario,
        novoEpiData,
        motivoSubstituicao,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || "Erro ao substituir EPI");
    }
    return response.json();
  },

  async atribuir(cpfFuncionario: string, caEPI: string) {
    const response = await fetch(`${API_URL}/epis/atribuir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cpfFuncionario,
        caEPI,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || "Erro ao atribuir EPI");
    }
    return response.json();
  },

  async buscarEpisFuncionario(cpf: string) {
    const response = await fetch(`${API_URL}/epis/funcionario/${cpf}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || "Erro ao buscar EPIs do funcionário");
    }
    return response.json();
  },

  async buscarHistoricoFuncionario(cpf: string) {
    const response = await fetch(`${API_URL}/epis/funcionario/${cpf}/historico`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.erro || "Erro ao buscar histórico de EPIs");
    }
    return response.json();
  },
};
