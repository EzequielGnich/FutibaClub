const express = require('express')
const app = express()
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')
const session = require('express-session')
const account = require('./account')
const admin = require('./admin')
const groups = require('./groups')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'fullstack-academy',
  resave: true,
  saveUninitialized: true
}))
app.set('view engine', 'ejs')

const init = async() => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'ezequielgnich',
    password: '123456789',
    database: 'futiba-club'
  })

  app.use((req, res, next) => {
    if(req.session.user){
      res.locals.user = req.session.user
    }else{
      res.locals.user = false
    }
    next()
  })

  app.use(account(connection))
  app.use('/admin', admin(connection))
  app.use('/groups', groups(connection))

  // redis:
    // ttl - time to live
    // update impact no score, invalido a cache
    // cache = poupar ir a um serviço mais caro
    // pubsub ou message broker para eventos escalaveis

  /*let classification = null
  app.get('/classification', async(req, res) => {
    if(classification) {
      res.send(classification)
    } else {
      const query = `
      select
        users.id,
        users.name,
        sum(guessings.score) as score
        from users
        left join
          guessings
            on guessings.user_id = users.id
        group by guessings.user_id
        order by score DESC
      `
      const [ rows ] = await connection.execute(query)
      classification = rows
      res.send(rows)
    }
  })*/

  app.listen(3000, err => {
    console.log('Futiba Club Online')
  })
}

init()

