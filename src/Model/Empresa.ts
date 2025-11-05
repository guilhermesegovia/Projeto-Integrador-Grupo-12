import bcrypt from "bcryptjs";

export class Empresa {
  constructor(
    private empresa: string,
    private cnpj: string,
    private endereco: string,
    private email: string,
    private senha: string
  ) {
    if (!empresa) throw new Error("Nome da Empresa Obrigatorio");
    if (!cnpj) throw new Error("CNPJ Obrigatorio");
    if (!endereco) throw new Error("Endereço Obrigatoria");
    if (!email) throw new Error("Email Obrigatorio");
    if (!senha) throw new Error("Senha Obrigatoria");

    if (senha.length <= 6) throw new Error("Senha muito curto");
    if (email.length > 100) throw new Error("Email muito longo");
  }

  static create(
    empresa: string,
    cnpj: string,
    endereco: string,
    email: string,
    senha: string
  ) {
    const hashedPassword = bcrypt.hashSync(senha);
    return new Empresa(empresa, cnpj, endereco, email, senha);
  }

    verifyPassword(senha: string): boolean {
    return bcrypt.compareSync(senha, this.senha);
    
  }


  getempresa(): string {
    return this.empresa;
  }

  getcnpj(): string {
    return this.cnpj;
  }
  getendereco(): string {
    return this.endereco;
  }
  getemail(): string {
    return this.email;
  }
  getsenha(): string {
    return this.senha;
  }
}
