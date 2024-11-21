const express  = require ("express")
const cors  = require ("cors")
const mysql  = require ("msql2")
const jwt  = require ("jwt")

const app = express()

const {DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, SECRET_KEY} = process.env

app.use(cors())
app.use(express.json())

app.post("/register", (request, response) => {
    const user = request.body.user

const searchComand = `
   SELECT * FROM Users 
   WHERE email = ? 
`

db.query(searchComand, [user.email], (error, data) => {
    if(error) {
        console.log(error)
        return
    }

    if (data.length !== 0) {
        response.json({message: "Já existe um usuário cadastrado com esse email. Tente outro email!", userExists: true })
        return
    }

    const isertComand= `
    INSER INTO Users(name, email, password)
    VALUES(?, ?, ?)
    `

    db.query(insertComand, [user.name, user.email, user.password], (error) => {
        if(error) {
            console.log(error)
            return
        }
        
        response.json({message: "Usuário cadastrado com sucesso!"})
    })
})


})

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000!")
})

app.post("/login", (request, response) => {
    const user = request.body.user

    const searchComand = `
    SELECT * FROM 
    WHERE email = ?
    `

    db.query(searchComand, [user.email], (error,data) => {
        if(error){
            console.log(erroe)
            return
        }

        if(data.length ===0){
            response.json({message:"Não existe nemhum usuáro cadastrado com esse email."})
            return
        }

        if(user.password === data[0].password) {
            const email = user.email
            const id = data[0].id


            const token = jwt.sign({id, email}, SECRET_KEY, {expiresIn: "1h"})
            response.json({token, ok: true})
            return
        }

        response.json({message:"Credenciais inválidas. Tente novamente"})
    })
})

app.get("/verify", (request, response) => {
    const token = request.headers.authorization

    jwt.verify(token, SECRET_KEY, (error) => {
        if(error) {
            response.json({message:"Token inválido! Efetueo login novamente."})
            return
        }

        response.json({ok: true})
    })
})

const db = mysql.creatPool({
    connectionLimit: 10,
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD
})