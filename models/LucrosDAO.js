async function factoryLucrosDAO(){
    const conexao = await require('../models/Conexao')();
    
    const LucrosDAO = {
        tabela: 'lucros',

        /**
         * Insere o card na tabela de lucros
         * @param {Number} id Id do Card.
         * @param {String} titulo Titulo do Card.
         * @param {Number} valor Valor do Card. Ex: 25.00 ou 25.
         * @param {Date} data Data em que o card foi criado.
         */
        inserirCard: async(id, titulo, valor, data)=>{
            const INSERT = `INSERT INTO ${LucrosDAO.tabela} VALUES(?,?,?,?)`;
            await conexao.run(INSERT,[id,titulo,valor,data]);
        },

        /**
         * Carrega os cards da tabela de lucros e retorna a lista de cards.
         */
        carregarCards: async()=>{
            const SELECT = `SELECT * FROM ${LucrosDAO.tabela}`;
            const listaLucros = await conexao.all(SELECT);

            console.log(`Retornando: ${listaLucros}`);
            return listaLucros || [];
        },

        /**
         * Atualiza o card escolhido no banco de dados.
         * @param {Number} id Id do Card.
         * @param {String} titulo Titulo do Card.
         * @param {Number} valor Valor do Card. Ex: 25.00 ou 25.
         */
        atualizarCard: async(id, titulo, valor)=>{
            const UPDATE = `UPDATE ${LucrosDAO.tabela} SET titulo = ?, valor = ? WHERE id = ?`;
            await conexao.run(UPDATE,[titulo,valor,id]);
        },

        /**
         * Remove o card escolhido do banco de dados.
         * @param {Number} id Id do Card.
         */
        deletarCard: async(id)=>{
            const DELETE = `DELETE FROM ${LucrosDAO.tabela} WHERE id = ?`;
            await conexao.run(DELETE,[id]);
        }
    }

    return LucrosDAO;
}

module.exports = factoryLucrosDAO;