//realizando a conexão com o banco antes de iniciar a aplicação

// importando o MySQL para conectar com o banco de dados
import mysql from 'mysql'

// criando o pool de conexões com o banco de dados
const pool = mysql.createPool({
    // limita o número máximo de conexões simultâneas (até 10 conexões)
    // conexões inativas são reaproveitadas automaticamente
    connectionLimit: 10,
    // endereço onde o banco de dados está rodando
    host: 'localhost',
    // usuário do banco de dados
    user: 'root',
    // senha do usuário do banco
    password: 'root123',
    // nome do banco de dados utilizado pela aplicação
    database: 'nodemysql2',
})
// exportando o pool para ser utilizado em outros arquivos (ex: index.js)
export default pool