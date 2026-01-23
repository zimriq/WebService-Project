# WebService Project

---

## Overview 
A RESTful API service for managing user authenticaiton and load tracking. Built with Node.js, Express, and MongoDB, and delpoyed on AWS. The service authenticates users, generates secure API tokens, and mangages load information including status, identifiers, and order numbers for truck drivers. 

## Purpose
The main purpose of this service is to create a mock web server which serves as a way for customers to feed data into a specific service.

## Tech Stack 
### Backend
- Runtime: Node.js
- Framework: Express.js
- Language: JavaScript

### Database
- Database: MongoDB 
- ODM: Mongoose

### Deployment
- Platform: AWS Elastic Beanstalk 
- Region: us-east-1

---

## API Endpoints
### Authentication
### POST /authenticate
Authenticates a user with username and password, returns user data and API token

### GET /authenticate/token
Validates an exisiting API token and returns user data 

### GET /loads
Retrieves all loads for the authenticated user

----

## Contact
### Project Maintainer: Zimri Quinonez
### Organization: Eleos Technologies