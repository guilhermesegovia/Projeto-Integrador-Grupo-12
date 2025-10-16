export class EPI {
  constructor(
    private epi: string,
    private tipo: string,
    private CA: string,
    private validade: Date,
    private modouso: string,
    private fabricante: string,
    private data_entrada: Date
  ) {
    if (!epi) throw new Error("Nome do EPI Obrigatorio");
    if (!tipo) throw new Error("Tipo do EPI Obrigatorio");
    if (!CA) throw new Error("Número do CA Obrigatorio");
    if (!validade) throw new Error("Validade Obrigatoria");
    if (!modouso) throw new Error("Modo de uso Obrigatorio");
    if (!fabricante) throw new Error("Fabricante Obrigatorio");
    if (!data_entrada) throw new Error("Data de entrada obrigatoria");

    if (epi.length > 100) throw new Error("Nome do EPI muito longo");
    if (tipo.length > 100) throw new Error("Tipo do EPI muito longo");
    if (CA.length > 100) throw new Error("CA muito longo");
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
    data_entrada: Date
  ) {
    return new EPI(epi, tipo, CA, validade, modouso, fabricante, data_entrada);
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
}
