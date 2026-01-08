// importando o Express
import express from 'express'
// importando o Handlebars
import exphbs from 'express-handlebars'
//importando o pool de conexões responsável pela comunicação com o banco MySQL
import pool from './db/conn.js'

// iniciando o Express na variável app
const app = express()

// configurando o Express para receber dados de formulário HTML
app.use(
    express.urlencoded({
        extended: true
    })
)

// middleware para interpretar requisições com body em JSON
app.use(express.json())

// registrando o Handlebars como template engine do projeto
app.engine('handlebars', exphbs.engine())

// definindo o Handlebars como engine padrão para renderizar as views
app.set('view engine', 'handlebars')

// define a pasta public como diretório de arquivos estáticos
app.use(express.static('public'))

// criando a rota GET da página inicial
app.get('/', (req, res) => {
    // renderiza o arquivo home no navegador do usuário
    res.render('home')
})

// criando rota POST para cadastrar livros no banco de dados
app.post('/books/insertbook', (req, res) => {
    // extraindo o título do body
    const title = req.body.title
    // extraindo o número de páginas do body
    const pageqty = req.body.pageqty

    // variável SQL com a instrução do banco de dados
    // informamos a tabela books e as colunas que receberão os dados
    const sql = `INSERT INTO books (??, ??) VALUES (?, ?)`
    //array com os nomes das colunas e os valores a serem inseridos
    const data = ['title', 'pageqty', title, pageqty]

    // executando a instrução SQL com o método query
    // passando a varaivel data com os dados para inserir no banco
    // utilizando uma função anônima para tratar possíveis erros
   pool.query(sql, data, function(err) {
        // se ocorrer algum erro
        if (err) {
            // exibe o erro no console
            console.log(err)
            // interrompe a execução
            return
        }
        // se der tudo certo, o usuário é redirecionado para /books
        res.redirect('/books')
    })
})

// criando rota GET para renderizar a listagem de livros
app.get('/books', (req, res) => {
    // variável SQL selecionando todas as colunas da tabela books
    const sql = "SELECT * FROM books"

    // executando a instrução SQL com o método query
    // utilizando uma função anônima para obter os dados ou tratar erros
   pool.query(sql, function(err, data) {
        // se ocorrer algum erro
        if (err) {
            // exibe o erro no console
            console.log(err)
            // interrompe a execução
            return
        }
        // armazenando os dados retornados na variável books
        const books = data
        // renderizando a view books e enviando os dados para o front-end
        res.render('books', { books })
    })
})

// criando uma rota GET para buscar um único livro pelo id
app.get('/books/:id', (req, res) => {
    // obtendo o id pela URL
    const id = req.params.id
    // variável SQL para selecionar o livro pelo id
    const sql = `SELECT * FROM books WHERE ?? = ?`
    //array com o nome da coluna e o dado que vai ser inserido nela
    const data = ['id', id]

    // executando a instrução SQL e passando a variavel data como parâmetro
    // utilizando uma função anônima para buscar os dados ou tratar erros
   pool.query(sql, data, function(err, data) {
        // se ocorrer algum erro
        if (err) {
            // exibe o erro no console
            console.log(err)
            // interrompe a execução
            return
        }
        // armazenando os dados do livro na variável book
        // data[0] é usado pois o WHERE retorna um array de registros
        const book = data[0]

        // renderizando a view book e enviando os dados para o front-end
        res.render('book', { book })
    })
})

// criando uma rota GET para edição dos livros
app.get('/books/edit/:id', (req, res) => {
    // obtendo o id pela URL
    const id = req.params.id
    // variável SQL para selecionar o livro pelo id
    const sql = `SELECT * FROM books WHERE ?? = ?`
    //array com o nome da coluna e o dado que vai ser inserido nela
    const data = ['id', id]

    // executando a instrução SQL e passando a variavel data como parâmetro
    // utilizando uma função anônima para obter os dados ou tratar erros
   pool.query(sql, data, function(err, data) {
        // se ocorrer algum erro
        if (err) {
            // exibe o erro no console
            console.log(err)
            // interrompe a execução
            return
        }
        // armazenando os dados do livro na variável book
        const book = data[0]
        // renderizando a view editbook e enviando os dados para o front-end
        res.render('editbook', { book })
    })
})

// criando uma rota POST para atualizar os dados no banco
app.post('/books/updatebook', (req, res) => {
    // obtendo o id do livro que será atualizado
    const id = req.body.id
    // obtendo o novo título do livro
    const title = req.body.title
    // obtendo a nova quantidade de páginas do livro
    const pageqty = req.body.pageqty

    // variável SQL com a instrução para atualizar os dados do livro
    const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`
    //array com os nomes das colunas e os valores a serem inseridos
    const data = ['title', title, 'pageqty', pageqty, 'id', id]

    // executando a instrução SQL e passando a variavel data
    // utilizando uma função anônima para tratar possíveis erros
   pool.query(sql, data, function(err) {
        // se ocorrer algum erro
        if (err) {
            // exibe o erro no console
            console.log(err)
            // interrompe a execução
            return
        }
        // se der tudo certo, redireciona o usuário para /books
        res.redirect('/books')
    })
})

// criando uma rota POST para deletar um livro do banco de dados
app.post('/books/remove/:id', (req, res) => {
    // obtendo o id do livro pela URL
    const id = req.params.id
    // variável SQL com a instrução para deletar o livro pelo id
    const sql = `DELETE FROM books WHERE ?? = ?`
    //array com o nome da coluna e o dado que vai ser inserido nela
    const data = ['id', id]

    // executando a instrução SQL e passando o id como parâmetro
    // utilizando uma função anônima para tratar possíveis erros
   pool.query(sql, data, function(err) {
        // se ocorrer algum erro
        if (err) {
            // exibe o erro no console
            console.log(err)
            // interrompe a execução
            return
        }
        // se der tudo certo, redireciona o usuário para /books
        res.redirect('/books')
    })
})

// iniciando o servidor na porta 3000
// a conexão com o banco é gerenciada pelo pool
app.listen(3000, () => {
    console.log('servidor rodando na porta 3000')
})