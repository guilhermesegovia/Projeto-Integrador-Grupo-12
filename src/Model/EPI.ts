export class CadastroEPI {
    constructor(
        private nome: string,
        private tipo: string,
        private numeroCA: number,
        private validade: string,
        private modouso: string,
        private fabricante: string

    ){
        if (!nome) throw new Error("Nome Obrigatorio");
        if (!tipo) throw new Error("Tipo do EPI Obrigatorio");
        if (!numeroCA === undefined || numeroCA === null) throw new Error("Número do CA Obrigatorio");
        if (!validade) throw new Error("Validade Obrigatoria");
        if (!modouso) throw new Error("Modo de uso Obrigatorio");
        if (!fabricante) throw new Error("Fabricante Obrigatorio");
    }
}