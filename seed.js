//sending data to database

require('dotenv').config();
const mongoose = require('mongoose'); 
const crypto = require('crypto');

const User = require('./models/User');
const Load = require('./models/Load');

function hashPassword(password){
    return crypto.createHash('sha256').update(password).digest('hex');
}

async function seed(){
    //use to reset / add data to database
}

seed();