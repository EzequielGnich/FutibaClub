const express = require('express')
const app = express.Router()

const init = connection => {
  app.get('/', async(req, res) => {  
    res.render('home')
  })

//--------------------------------------------------------------------------------------------------------
  app.get('/logout', (req, res) => {
    req.session.destroy( err => {
      res.redirect('/')
    })
  })

  app.get('/home/login', (req, res) => {
    res.render('home/login', { error: false })
  })
  app.post('/home/login', async(req, res) => {
    const [rows, fields] = await connection.execute('select * from users where email = ?', [req.body.email])
    if(rows.length===0){
      res.render('home/login', { error: 'Usuário e/ou senha inválidos!' })
    }else{
      if(rows[0].passwd === req.body.passwd ) {
        const userDb = rows[0]
        const user = {
          id: userDb.id,
          name: userDb.name,
          role: userDb.role
        }
        req.session.user = user
        res.redirect('/')
      } else {
        res.render('home', { error: 'Usuário e/ou senha inválidos!' })
      }
    }
  })

//--------------------------------------------------------------------------------------------------------
  
  app.get('/home/new-account', (req, res) => {
    res.render('home/new-account', { error: false })
  })
  app.post('/home/new-account', async(req, res) => {
    const [rows, fields] = await connection.execute('select * from users where email = ?', [
      req.body.email
    ])
    if( rows.length === 0 ) {
      const { name, email, passwd, role } = req.body
      const [ inserted, insertedFields ] = await connection.execute('insert into users (name, email, passwd, role) values(?,?,?,?)', [
        name,
        email,
        passwd,
        'user'
      ])
      const user = {
        id: inserted.insertId,
        name: name,
        role: 'user'
      }
      req.session.user = user
      res.redirect('/')
    } else {
      res.render('home', {
        error: 'Usuário já existente!'
      })
    }
  })
  return app
}

module.exports = init