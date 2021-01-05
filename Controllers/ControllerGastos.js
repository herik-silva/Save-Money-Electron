async function factoryControllerGastos(){
    const GastosDAO = await require('../models/GastosDAO')();

    const ControllerGastos = {
        listaGastos: [],
        ultimoId: 1,
    
        // ====================================================== //
        //                       METODOS                          //
        // ====================================================== //

        /**
         * Cria um card e o insere no banco de dados.
         * @param {String} titulo Titulo do Card
         * @param {Number} valor Valor do Card. Ex: 25.00 ou 25.
         * @param {Date} data_criada Data em que o card foi criado.
         */
        criarCard: async(titulo, valor, data_criada)=>{
            const card ={
                id: ControllerGastos.ultimoId,
                titulo: titulo,
                valor: valor,
                data_criada: data_criada
            }

            console.log("ID CARD: " + card.id);
            
            await GastosDAO.inserirCard(card.id, card.titulo, card.valor, card.data_criada);

            ControllerGastos.ultimoId++;
        },

        /**
         * Carrega todos os card do banco de dados para aplicação.
         */
        carregarCards: async()=>{
            ControllerGastos.listaGastos = await GastosDAO.carregarCards();
            console.log(ControllerGastos.listaGastos);
            if(ControllerGastos.listaGastos.length>0){
                ControllerGastos.ultimoId = ControllerGastos.listaGastos[ControllerGastos.listaGastos.length-1].id+1;
            }
        },

        /**
         * Modifica o card selecionado e o atualiza no banco de dados.
         * @param {Number} id Id do card.
         * @param {String} titulo Titulo do card.
         * @param {Number} valor Valor do card. Ex: 25.00 ou 25. 
         */
        atualizarCard: async (id, titulo, valor)=>{
            await GastosDAO.atualizarCard(id, titulo, valor);
        },

        /**
         * Remove o card selecionado no banco de dados.
         * @param {Number} id Id do Card.
         */
        removerCard: async(id)=>{
            await GastosDAO.deletarCard(id);
        }
    }

    return ControllerGastos;
}


module.exports = factoryControllerGastos;