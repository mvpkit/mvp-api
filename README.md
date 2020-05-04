# Liftjs API using Nest.js

> Liftjs API provides you with a standard set of API routes you normally need for a project.
> We lifted all the heavy-work for you.
> Perfect for MVPs and other kickstart projects.


## What is Done
- 04/30/20: setup Nest.js
- 05/01/20: create user module
- 05/01/20: create user login, register routes
- 05/02/20: implement Passport.js + JWT
- 05/03/20: add request validation pipe
- 05/03/20: add snake casing Postgres naming strategy
- 05/03/20: add Config module to support .env, .env.development, .env.prod, etc
- 05/03/20: add a base.service.ts class that has base findOne(), findAll(), etc... for other services to inherit

## Todo
- add Passport strategy for Google SSO
- add Passport strategy for Facebook SSO
- add send email functionality
- create user forgot password route
- create an abstract service method findAll() that takes in pagination and filters
- create a CRUD scaffolder
