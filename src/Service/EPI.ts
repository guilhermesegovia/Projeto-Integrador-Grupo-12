// src/service/epi.ts

import { EPI } from "../Model/EPI"; // Importa a classe EPI

// Usamos 'any' para imitar a tipagem do historico
type HistoricoEPI = any;

// Simula novo ID
const generateId = () => crypto.randomUUID();

export class EPIService {
    // Lista de EPIs
    lista: EPI[] = []; 
    
    // Lista de Histórico de substituições
    historico: HistoricoEPI[] = []; 

    // O construtor segue o padrão do PDF
    constructor(public armazenamentoEPI: EPI[] = []) {
        this.lista = armazenamentoEPI;
    }

    // Cadastro de EPI
    createEPI(data: {
        epi: string,
        tipo: string,
        CA: string,
        validade: Date,
        modouso: string,
        fabricante: string,
        data_entrada: Date,
        cpfdofuncionario: string
    }): EPI {
        
        // Uso do static create da sua classe EPI para validação e criação
        const epiCreated = EPI.create(
            data.epi,
            data.tipo,
            data.CA,
            data.validade,
            data.modouso,
            data.fabricante,
            data.data_entrada,
            data.cpfdofuncionario
        );
        
        this.lista.push(epiCreated);
        
        return epiCreated;
    }
    
    // 2. Visualização de EPI (Visualizar todos)
    getEPIs(): EPI[] {
        return this.lista;
    }

    // 3. Consulta de EPI através do CA
    getEPIByCA(caNumero: string): EPI | undefined {
        return this.lista.find((epi) => epi.getCA() === caNumero);
    }

    // 4. Visualização de CA próximos de vencer
    visualizarCAsProximosDeVencer(diasLimite: number = 90): EPI[] {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() + diasLimite); 
        
        return this.lista.filter((epi) => {
            // Filtra os EPIs cuja validade está entre hoje e a data limite
            return epi.getvalidade() <= dataLimite && epi.getvalidade() >= new Date(); 
        });
    }

    // 5. Substituição de EPI perto do vencimento com histórico
    substituirEPI(
        identificadorFuncionario: string, // CPF ou ID do funcionário
        novoEpiData: {
            epi: string,
            tipo: string,
            CA: string,
            validade: Date,
            modouso: string,
            fabricante: string,
            data_entrada: Date,
            cpfdofuncionario: string
        }, 
        motivoSubstituicao: string
    ): any { // Retorna 'any' para não criar nova tipagem
        
        // 5a. Cria e registra o novo EPI (usando a função de cadastro)
        const novoEpi = this.createEPI(novoEpiData);

        // 5b. Cria e registra o histórico da substituição como um objeto anônimo ('any')
        const historicoRegistro = {
            id: generateId(),
            identificadorFuncionario: identificadorFuncionario,
            epi: novoEpi, // O objeto EPI
            dataEntrega: new Date(),
            motivoSubstituicao: motivoSubstituicao, 
            dataVencimentoPrevisto: novoEpi.getvalidade()
        };

        this.historico.push(historicoRegistro);
        
        return historicoRegistro;
    }
    
    // Função auxiliar para consultar o histórico (retorna any[])
    getHistoricoEntregas(identificadorFuncionario: string): any[] {
        return this.historico.filter(h => h.identificadorFuncionario === identificadorFuncionario);
    }
}