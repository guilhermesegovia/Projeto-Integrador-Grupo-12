
import { Funcionario } from "../Model/Funcionarios";


export class FuncionarioService {
    lista: any[] = []; 
    listaEPIs: any[] = []; 
    historicoEPI: any[] = []; 

    constructor(public armazenamentoFuncionario: any[] = []) {
        this.lista = armazenamentoFuncionario;
    }

    createFuncionario(data: { nome: string, cpf: string, setor: string, cargo: string }): any {
        const funcionarioCriado = Funcionario.create(
            data.nome, 
            data.cpf, 
            data.cargo,
            data.setor
        );
        
        this.lista.push(funcionarioCriado);
        
        return funcionarioCriado;
    }

    consultarFuncionarioporcpf(cpf: string ): any[] | undefined {
        return this.lista.filter((funcionario) => funcionario.getcpf() === cpf);
    }

    visualizarCAsProximosDoVencimento(diasLimite: number = 90): any[] {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() + diasLimite); 
        
        return this.listaEPIs.filter((epi) => {
            return epi.caValidade <= dataLimite && epi.caValidade >= new Date(); 
        });
    }

    SubstituirEPI(
        funcionarioCpf: string, 
        novoEpiData: { nomeEPI: string, caNumero: string, caValidade: Date }, 
        motivo: string
    ): any {
        const funcionario = this.lista.find(funcionario => funcionario.getcpf() === funcionarioCpf);
        if (!funcionario) {
            throw new Error(`Funcionário com CPF ${funcionarioCpf} não encontrado.`);
        }

        const novoEpi = {
            nomeEPI: novoEpiData.nomeEPI,
            caNumero: novoEpiData.caNumero,
            caValidade: novoEpiData.caValidade,
        };
        this.listaEPIs.push(novoEpi);

        const dataAtual = new Date();
        const historico = {
            funcionarioCpf: funcionarioCpf,
            epi: novoEpi,
            dataEntrega: dataAtual,
            dataVencimentoPrevisto: novoEpi.caValidade,
            motivoSubstituicao: motivo,
        };

        this.historicoEPI.push(historico);
        
        return historico;
    }

    getFuncionarios(): any[] {
        return this.lista;
    }

    getverHistoricoEpi(funcionarioCpf: string): any[] {
        return this.historicoEPI.filter(historicoEPI => historicoEPI.funcionarioCpf === funcionarioCpf);
    }
}
