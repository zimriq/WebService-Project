//require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

/*
//database connection
const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
module.exports = connectDB;

const connectDB = require('./db'); 
connectDB();
*/

app.use(express.json()); 

//generate token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

//function to hash passwords
function hashPassword(password){
    return crypto.createHash('sha256').update(password).digest('hex');
}

//simple local user array for testing
const users = [
    {id: '1', username: 'testUsr1', passwordHash: hashPassword('password123')},
    {id: '2', username: 'testUsr2', passwordHash: hashPassword('driver123')}
];

//storing tokens locally 
const tokens = {};


//authentication 
//Expose an authentication endpoint that takes in a POST request with a username and passowrd and returns a user object 
//  or an unauthorized response if username/password is invalid
app.post('/authenticate', (req, res) => {
    try{
        const clientIp = req.headers['x-forwarded-for'];

        const {username, password, is_team_driver_login} = req.body;

        if(!username || !password){
            return res.status(400).json({error: 'Username and password are required'});
        }

        const passwordHash = hashPassword(password); 
        const user = users.find(u => u.username === username && u.passwordHash === passwordHash);

        if(!user){
            return res.status(401).json({error: 'Unauthorized due to invalid username or password'});
        }

        const token = generateToken();
        tokens[token] = user.id;

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
app.get('/authenticate/:token', (req, res) => {
    try{
        const { token } = req.params;
        const userId = tokens[token];

        if(!userId){
            return res.status(401).json({error: 'Invalid or expired token'});
        }

        const user = users.find(u => u.id === userId);
        if(!user){
            return res.status(401).json({error: 'Unauthorized due to invalid username or password'});
        }

        const clientIp = req.headers['x-forwarded-for'];

        
        res.json({
            full_name: user.username, 
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
app.get('/loads', (req, res) => {
    try{
        const authorization = req.headers['authorization'];
        if(!authorization){
            return res.status(401).json({error: 'Unauthorized due to missing or invalid token and/or API key'});
        }
        
        const token = authorization.replace('Token token=','');
        const userId = tokens[token];
        if(!userId){
            return res.status(401).json({error: 'Unauthorized due to invalid or expired token and/or API key'});
        }
        
        const user = users.find(u => u.id === userId);
        if(!user){
            return res.status(401).json({error: 'Unauthorized due to invalid username or password'});
        }
        //id, display_identifier, sort, order_number, load_status, load_status_label, active, current
        res.json([
                    {
                        id: 'load1',
                        display_identifier: 'LOAD-001',
                        load_status: 'IN_PROGRESS',
                        sort: 1,
                        order_number: 'ORD-1001',
                        load_status_label: 'In Progress',
                        active: true,
                        current: true
                    },
                    {
                        id: 'load2',
                        display_identifier: 'LOAD-002',
                        sort: 2,
                        order_number: 'ORD-1002',
                        load_status: 'IN_TRANSIT',
                        load_status_label: 'In Transit',
                        active: true,
                        current: false
                    }
                ]);
    }
    catch(error){
        res.status(400).json({error: 'Bad Request'});
    }
}); 


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});