type User = {
    id: number;
    nome: string;
}

type Account = {
    id: number;
    usuarioId: number;
    tipo: "CC" | "CI";
    saldo: number;
}

export { User, Account }