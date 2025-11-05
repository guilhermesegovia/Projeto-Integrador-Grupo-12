
import { EPI } from "../Model/EPI";


export class EPIService {
    Epi: EPI[] = []; 
    
    historico: EPI[] = []; 

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


}