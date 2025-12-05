require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


//database
const connectDB = require('./config/db');
connectDB();

const User = require('./models/User');
const Token = require('./models/Token');
const Load = require('./models/Load');

app.use(express.json()); 

//helper functs
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}
function hashPassword(password){
    return crypto.createHash('sha256').update(password).digest('hex');
}

//authentication 
//Expose an authentication endpoint that takes in a POST request with a username and passowrd and returns a user object 
//  or an unauthorized response if username/password is invalid
app.post('/authenticate', async (req, res) => {
    try{
        const clientIp = req.headers['x-forwarded-for'];

        const {username, password, is_team_driver_login} = req.body;

        if(!username || !password){
            return res.status(400).json({error: 'Username and password are required'});
        }

        const passwordHash = hashPassword(password); 
        const user = await User.findOne({username, passwordHash});

        if(!user){
            return res.status(401).json({error: 'Unauthorized due to invalid username or password'});
        }

        const token = generateToken();
        await Token.create({userId: user._id, token}); 

        res.json({
            full_name: user.username,
            api_token: token 
        });
    }
    catch(error){
        res.status(400).json({error: 'Bad Request'}); 
    }
});

//Expose an authentication API endpoint that takes in a GET request that passes an API token returned from above POST 
//  request and then also returns a user object (or an uhthorized response if token is invalid)
app.get('/authenticate/:token', async (req, res) => {
    try{
        const clientIp = req.headers['x-forwarded-for'];

        const { token } = req.params;
        const api_token = await Token.findOne({token});
        if(!api_token){
            return res.status(401).json({error: 'Invalid or expired token'});
        }

        const user = await User.findById(api_token.userId);

        if(!user){
            return res.status(401).json({error: 'Unauthorized due to invalid username or password'});
        }
        
        res.json({
            full_name: user.full_name, 
            api_token: token
        });
    }
    catch(error){
        res.status(400).json({error: 'Bad Request'}); 
    }
});

//loads 
//Expose a loads API endpoint that takes in an api_token to authenticate/associate which user
// and returns loads for that user
app.get('/loads', async (req, res) => {
    try{
        const authorization = req.headers['authorization'];
        if(!authorization){
            return res.status(401).json({error: 'Unauthorized due to missing or invalid token and/or API key'});
        }
        
        const token = authorization.replace('Token token=','');
        const api_token = await Token.findOne({token});
        if(!api_token){
            return res.status(401).json({error: 'Unauthorized due to invalid or expired token and/or API key'});
        }
        
        const user = await User.findById(api_token.userId).sort({ sort: 1 });

        res.json({
            id: load._id,
            display_identifier: load.display_identifier,
            sort: load.sort,
            order_number: load.order_number,
            load_status: load.load_status,
            load_status_label: load.load_status_label,
            active: load.active, 
            current: load.current
        });
    }
    catch(error){
        res.status(400).json({error: 'Bad Request'});
    }
}); 


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});