async function factoryGastosDAO(){
    const conexao = await require('../models/Conexao')();
    
    const GastosDAO = {
        tabela: 'gastos',

        /**
         * Insere o card na tabela de gastos
         * @param {Number} id Id do Card.
         * @param {String} titulo Titulo do Card.
         * @param {Number} valor Valor do Card. Ex: 25.00 ou 25.
         * @param {Date} data Data em que o card foi criado.
         */
        inserirCard: async(id, titulo, valor, data)=>{
            const INSERT = `INSERT INTO ${GastosDAO.tabela} VALUES(?,?,?,?)`;
            await conexao.run(INSERT,[id,titulo,valor,data]);
        },

        /**
         * Carrega os cards da tabela de gastos e retorna a lista de cards.
         */
        carregarCards: async()=>{
            const SELECT = `SELECT * FROM ${GastosDAO.tabela}`;
            const listaGastos = await conexao.all(SELECT);

            console.log(`Retornando: ${listaGastos}`);
            return listaGastos || [];
        },

        /**
         * Atualiza o card escolhido no banco de dados.
         * @param {Number} id Id do Card.
         * @param {String} titulo Titulo do Card.
         * @param {Number} valor Valor do Card. Ex: 25.00 ou 25.
         */
        atualizarCard: async(id, titulo, valor)=>{
            const UPDATE = `UPDATE ${GastosDAO.tabela} SET titulo = ?, valor = ? WHERE id = ?`;
            await conexao.run(UPDATE,[titulo,valor,id]);
        },

        /**
         * Remove o card escolhido do banco de dados.
         * @param {Number} id Id do Card.
         */
        deletarCard: async(id)=>{
            const DELETE = `DELETE FROM ${GastosDAO.tabela} WHERE id = ?`;
            await conexao.run(DELETE,[id]);
        }
    }

    return GastosDAO;
}

module.exports = factoryGastosDAO;