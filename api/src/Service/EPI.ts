import { EPI } from "../Model/EPI";

interface HistoricoEPI {
    funcionarioCpf: string;
    epi: {
        epi: string;
        tipo: string;
        CA: string;
        validade: Date;
        modouso: string;
        fabricante: string;
    };
    dataEntrega: Date;
    dataDevolucao: Date | null;
    motivoSubstituicao: string;
}

export class EPIService {
    Epi: EPI[] = [];

    historico: HistoricoEPI[] = [];

    constructor(public armazenamentoEPI: EPI[] = []) {
        this.Epi = armazenamentoEPI;
    }

    createEPI(data: {
        epi: string,
        tipo: string,
        CA: string,
        validade: Date,
        modouso: string,
        fabricante: string,
        data_entrada: Date,

    }): EPI {

        const EPICRIADO = EPI.create(
            data.epi,
            data.tipo,
            data.CA,
            data.validade,
            data.modouso,
            data.fabricante,
            data.data_entrada,

        );

        this.Epi.push(EPICRIADO);

        return EPICRIADO;
    }

    getEPIs(): EPI[] {
        return this.Epi;
    }

    getEPIByCA(caNumero: string): EPI | undefined {
        return this.Epi.find((epi) => epi.getCA() === caNumero);
    }

    visualizarCAsProximosDeVencer(diasLimite: number = 90): EPI[] {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() + diasLimite);

        return this.Epi.filter((epi) => {

            return epi.getvalidade() <= dataLimite && epi.getvalidade() >= new Date();
        });
    }


    substituirEPIpertovencimento(
        Funcionario: string, // CPF funcionário
        novoEpiData: {
            epi: string,
            tipo: string,
            CA: string,
            validade: Date,
            modouso: string,
            fabricante: string,
            data_entrada: Date,

        },
        motivoSubstituicao: string
    ): any {
        // Criar o novo EPI
        const novoEPI = this.createEPI(novoEpiData);

        // Criar registro no histórico
        const dataAtual = new Date();
        const historicoRegistro: HistoricoEPI = {
            funcionarioCpf: Funcionario,
            epi: {
                epi: novoEPI.getepi(),
                tipo: novoEPI.gettipo(),
                CA: novoEPI.getCA(),
                validade: novoEPI.getvalidade(),
                modouso: novoEPI.getmodouso(),
                fabricante: novoEPI.getfabricante()
            },
            dataEntrega: dataAtual,
            dataDevolucao: null,
            motivoSubstituicao: motivoSubstituicao
        };

        this.historico.push(historicoRegistro);

        return {
            epiCriado: {
                epi: novoEPI.getepi(),
                tipo: novoEPI.gettipo(),
                CA: novoEPI.getCA(),
                validade: novoEPI.getvalidade(),
                modouso: novoEPI.getmodouso(),
                fabricante: novoEPI.getfabricante(),
                data_entrada: novoEPI.getdata_entrada()
            },
            historico: historicoRegistro
        };
    }


  filtrarEPIPorDataparaExpirar(dataMin: Date, dataMax: Date): EPI[] {
    return this.Epi.filter((EPI) => {
      const epiVali = EPI.getvalidade();
      return (
        epiVali !== undefined &&
        epiVali >= dataMin &&
        epiVali <= dataMax
      );
    });
  }

  // Atribuir EPI a um funcionário
  atribuirEPIFuncionario(funcionarioCpf: string, caEPI: string): HistoricoEPI {
    const epi = this.getEPIByCA(caEPI);

    if (!epi) {
      throw new Error(`EPI com CA ${caEPI} não encontrado.`);
    }

    const dataAtual = new Date();
    const atribuicao: HistoricoEPI = {
      funcionarioCpf: funcionarioCpf,
      epi: {
        epi: epi.getepi(),
        tipo: epi.gettipo(),
        CA: epi.getCA(),
        validade: epi.getvalidade(),
        modouso: epi.getmodouso(),
        fabricante: epi.getfabricante()
      },
      dataEntrega: dataAtual,
      dataDevolucao: null,
      motivoSubstituicao: "Atribuição inicial"
    };

    this.historico.push(atribuicao);

    return atribuicao;
  }

  // Buscar EPIs ativos de um funcionário
  getEPIsFuncionario(funcionarioCpf: string): HistoricoEPI[] {
    return this.historico.filter(
      h => h.funcionarioCpf === funcionarioCpf && h.dataDevolucao === null
    );
  }

  // Buscar histórico completo de EPIs de um funcionário
  getHistoricoFuncionario(funcionarioCpf: string): HistoricoEPI[] {
    return this.historico.filter(h => h.funcionarioCpf === funcionarioCpf);
  }

}
