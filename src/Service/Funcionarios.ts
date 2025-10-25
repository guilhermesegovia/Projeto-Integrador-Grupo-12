// src/service/funcionario.ts

import { Funcionario } from "../Model/Funcionarios";

type EPI = {
    id: string;
    nomeEPI: string;
    caNumero: string;
    caValidade: Date; // Para validar o CA
};

type HistoricoEPI = {
    id: string;
    funcionarioCpf: string;
    epi: EPI;
    dataEntrega: Date;
    dataVencimentoPrevisto: Date;
    motivoSubstituicao: string;
};

const generateId = () => crypto.randomUUID();

export class FuncionarioService {
    // Lista de Funcionários
    lista: Funcionario[] = []; 
    
    // Lista de EPIs
    listaEPIs: EPI[] = []; 
    
    // Lista de Histórico de substituições
    historicoEPI: HistoricoEPI[] = []; 

    // O construtor é configurado para aceitar a lista de começo
    constructor(public armazenamentoFuncionario: Funcionario[] = []) {
        this.lista = armazenamentoFuncionario;
    }

    // Cadastrado de Funcionários
    // Segue o padrão do PrimeiraAPInode
    createFuncionario(data: { nome: string, cpf: string, setor: string, cargo: string }): Funcionario {
        
        // Simulação de uso do static create da sua classe Funcionario
        const funcionarioCriado = Funcionario.create(
            data.nome, 
            data.cpf, 
            data.cargo,
            data.setor
        );
        
        this.lista.push(funcionarioCriado);
        
        return funcionarioCriado;
    }
    
    // Consulta do funcionário utilizando CPF
    consultarFuncionario(identificador: { cpf?: string }): Funcionario | undefined {
        if (identificador.cpf) {
            // Consulta por CPF
            // Segue o padrão do 'getUserByNome'
            return this.lista.find((Funcionario) => Funcionario.getcpf() === identificador.cpf);
        }
        

    }

    // Ver os CA´s quase vencidos
    visualizarCAsProximosDeVencer(diasLimite: number = 90): EPI[] {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() + diasLimite); 
        
        // Filtra EPI´s proximo de vencer
        return this.listaEPIs.filter((epi) => {
            return epi.caValidade <= dataLimite && epi.caValidade >= new Date(); 
        });
    }

    // Substituir EPI
    trocarEPI(
        funcionarioCpf: string, 
        novoEpiData: { nomeEPI: string, caNumero: string, caValidade: Date }, 
        motivo: string
    // Histórico de EPI
    ): HistoricoEPI {
        
        const funcionario = this.lista.find(Funcionario => Funcionario.getcpf() === funcionarioCpf);
        if (!funcionario) {
            throw new Error(`Funcionário com CPF ${funcionarioCpf} não encontrado.`);
        }
        
    // Cria novo EPI
        const novoEpi: EPI = {
            ...novoEpiData,
            id: generateId()
        };
        this.listaEPIs.push(novoEpi);

    // Cria histórico
        const dataAtual = new Date();
        const historico: HistoricoEPI = {
            id: generateId(),
            funcionarioCpf: funcionarioCpf,
            epi: novoEpi,
            dataEntrega: dataAtual,
            dataVencimentoPrevisto: novoEpi.caValidade,
            motivoSubstituicao: motivo,
        };

        this.historicoEPI.push(historico);
        
        return historico;
    }
    
    // Função auxiliar
    getFuncionarios(): Funcionario[] {
        return this.lista;
    }
    
    // Função para ver o histórico
    getHistoricoEPI(funcionarioCpf: string): HistoricoEPI[] {
        return this.historicoEPI.filter(historicoEPI => historicoEPI.funcionarioCpf === funcionarioCpf);
    }
}