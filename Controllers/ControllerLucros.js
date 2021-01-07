async function factoryControllerLucros(){
    const LucrosDAO = await require('../models/LucrosDAO')();

    const ControllerLucros = {
        listaLucros: [],
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
        async criarCard(titulo, valor, data_criada){
            const card ={
                id: ControllerLucros.ultimoId,
                titulo: titulo,
                valor: valor,
                data_criada: data_criada
            }
            
            await LucrosDAO.inserirCard(card.id, card.titulo, card.valor, card.data_criada);

            ControllerLucros.ultimoId++;
        },

        /**
         * Carrega todos os card do banco de dados para aplicação.
         */
        async carregarCards(){
            ControllerLucros.listaLucros = await LucrosDAO.carregarCards();
            if(ControllerLucros.listaLucros.length>0){
                ControllerLucros.ultimoId = ControllerLucros.listaLucros[ControllerLucros.listaLucros.length-1].id+1;
            }
        },

        /**
         * Modifica o card selecionado e o atualiza no banco de dados.
         * @param {Number} id Id do card.
         * @param {String} titulo Titulo do card.
         * @param {Number} valor Valor do card. Ex: 25.00 ou 25. 
         */
        async atualizarCard(id, titulo, valor){
            await LucrosDAO.atualizarCard(id, titulo, valor);
        },

        /**
         * Remove o card selecionado no banco de dados.
         * @param {Number} id Id do Card.
         */
        async removerCard(id){
            await LucrosDAO.deletarCard(id);
        }
    }

    return ControllerLucros;
}


module.exports = factoryControllerLucros;