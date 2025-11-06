import { EPI } from "./EPI";

  export class Funcionario {
    constructor(
      private nome: string,
      private cpf: string,
      private setor: string,
      private cargo: string
    ) {
      if (!nome) throw new Error("Nome do funcionário Obrigatorio");
      if (!cpf) throw new Error("CPF do funcionario Obrigatorio");
      if (!setor) throw new Error("Setor Obrigatorio");
      if (!cargo) throw new Error("Cargo Obrigatoria");

      if (nome.length > 100) throw new Error("Nome muito longo");
      if (setor.length > 100) throw new Error("Setor muito longo");
      if (cargo.length > 100) throw new Error("Cargo muito longo");
      if (cpf.length > 11) throw new Error("CPF muito longo");
    }
    static create(nome: string, cpf: string, cargo: string, setor: string) {
      return new Funcionario(nome, cpf, setor, cargo);
    }

    getnome(): string {
      return this.nome;
    }

    getcpf(): string {
      return this.cpf;
    }
    getcargo(): string {
      return this.cargo;
    }
    getsetor(): string {
      return this.setor;
    }
  }
