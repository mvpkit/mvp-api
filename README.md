# MVP Starterkit API is a rapid development framework that does one thing well, ship product fast.
> It's built as a rapid development framework.
> Suitable for MVPs, SaaS, and other startups and projects.

### Why you'll love it
- pre-configured Config, Auth, User, Post modules
- pre-configured Passport authentication that supports common auth strategies including Local, Google, and Facebook
- pre-configured SMTP emails 
- a robust base Service class that comes with several useful database related calls
- a CRUD scaffolder
- auto-generated API docs via Swagger
- ACL / Roles 

##### Done
- 04/30/20: setup Nest.js
- 05/01/20: create user module
- 05/01/20: create user login, register routes
- 05/02/20: implement Passport.js + JWT
- 05/03/20: add request validation pipe
- 05/03/20: add snake casing Postgres naming strategy
- 05/03/20: add Config module to support .env, .env.development, .env.prod, etc
- 05/03/20: add a base.service.ts class that has base findOne(), findAll(), etc... for other services to inherit
- 05/04/20: add Swagger auto-generated documentation
- 05/04/20: add Nestjs Swagger plugin

##### Todo
- add Passport strategy for Google SSO
- add Passport strategy for Facebook SSO
- add send email functionality
- create user forgot password route
- create an abstract service method findAll() that takes in pagination and filters
- create a CRUD scaffolder
- add refresh tokens
