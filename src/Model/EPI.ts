export class EPI {
  constructor(
    private data_entrada: Date,
    private tipo: string,
    private fabricante: string,
    private modouso: string,
    private CA: string,
    private validade: Date,
    private epi: string,
    private cpfdofuncionario: string
  ) {
    
    if (!fabricante) throw new Error("Fabricante Obrigatorio");
    if (!CA) throw new Error("Número do CA Obrigatorio");
    if (!validade) throw new Error("Validade Obrigatoria");
    if (!modouso) throw new Error("Modo de uso Obrigatorio");
    if (!cpfdofuncionario) throw new Error("CPF obrigatorio");
    if (!tipo) throw new Error("Tipo do EPI Obrigatorio");
    if (!epi) throw new Error("Nome do EPI Obrigatorio");
    if (!data_entrada) throw new Error("Data de entrada obrigatoria");
    

    if (CA.length > 100) throw new Error("CA muito longo");
    if (tipo.length > 100) throw new Error("Tipo do EPI muito longo");
    if (epi.length > 100) throw new Error("Nome do EPI muito longo");
    if (fabricante.length > 100)
      throw new Error("Nome da fabricante muito longo");
  }
  static create(
    epi: string,
    tipo: string,
    CA: string,
    validade: Date,
    modouso: string,
    fabricante: string,
    data_entrada: Date,
    cpfdofuncionario: string
  ) {
    return new EPI(epi, tipo, CA, validade, modouso, fabricante, data_entrada, cpfdofuncionario);
  }

  getepi(): string {
    return this.epi;
  }

  gettipo(): string {
    return this.tipo;
  }

  getCA(): string {
    return this.CA;
  }

  getvalidade(): Date {
    return this.validade;
  }

  getmodouso(): string {
    return this.modouso;
  }

  getfabricante(): string {
    return this.fabricante;
  }

  getdata_entrada(): Date {
    return this.data_entrada;
  }

  getcpfdofuncionario(): string {
    return this.cpfdofuncionario;
  }

// Área de "Set"

 setepi(epi: string): void {
    this.epi = epi;
  }

  settipo(tipo: string): void {
    this.tipo = tipo;
  }

  setmodouso(modouso: string): void {
    this.modouso = modouso;
  }

  setvalidade(validade: Date): void {
    this.validade = validade;
  }

  setdata_entrada(data_entrada: Date): void {
    this.data_entrada = data_entrada;
  }

  setfabricante(fabricante: string): void {
    this.fabricante = fabricante;
  }
}

