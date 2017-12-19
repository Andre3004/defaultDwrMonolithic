export class Endereco
{

    constructor(
        public numero: string,
        public logradouro: string,
        public cidade: any = {
            estado: {
                uf: "",
                pais: {
                    nome: ""
                }
            }
        },
        public cep: string,
        public latitude: number,
        public longitude: number
    )
    {
        cidade.estado = {}
    }


}