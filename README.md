# MVP Starterkit API is a rapid development API framework for shipping out MVP projects fast.
> It's built as a rapid development framework built on top of Nest.js.
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
- 05/06/20: added nodemailer to send emails (SMTP)
- 05/06/20: added POST /auth/reset-password and /auth/choose-password
- 09/11/20: added docker compose support
- 09/12/20: added crud generator

##### Todo
- [ ] add Passport strategy for Google SSO
- [ ] add Passport strategy for Facebook SSO
- [ ] add paginator support fo findAll
