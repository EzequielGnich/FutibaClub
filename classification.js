const express = require('express')
const app = express.Router()

const init = connection => {
    app.get('/home/classification', async(req, res) => {
        const [ ]
        const [  ] = await connection.execute('select groups.*, groups_users.role from groups left join groups_users on groups.id = groups_users.group_id and groups_users.user_id = ?', [
            req.session.user.id
        ])
    })
    
    
    
    
    
    
    
    
    return app
}

module.exports = init