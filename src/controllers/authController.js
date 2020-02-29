const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

const User = require('../models/user');

const routes = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
    });
}

routes.get('/all', async (req, res) => {
    const pro = await User.find();
    return res.json(pro);
});

routes.post('/register', async (req, res) => {
    const {email} = req.body;
    try{
        if(await User.findOne({email}))
            return res.status(400).send({error:'Email já em uso!'});

        const user = await User.create(req.body);

        user.password = undefined;
        return res.send({
            user,
            token:generateToken({id:user.id}),
        });
    }catch(err){
        return res.statusCode(400).send({error:'fail'});
    }
});

routes.post('/login', async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email}).select('+password');
    
    if(!user)
        return res.status(400).send({error:'Email inexistente'});
    
    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({error:'Senha invalida'});
    
    user.password = undefined;

    res.send({
        user,
        token:generateToken({id:user.id}),
    });
});

module.exports = app => app.use('/', routes);