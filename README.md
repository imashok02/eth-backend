<p align="center">
  <h1>Eth backend</h1>
</p>

  <p align="center">DApp for interacting with Smart contracts using Typescript/Node.js. Currently supporting auction API</p>
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Configuration

```bash
unzip secrets_example folder

- Copy all 2 files and the config folder to the root of the project.
- Rename config/database.json.example to config/database.json
- Rename database.env.example to database.env
- Rename env.example to .env

1. Make sure .env and database.env is in the root of the project. - Used for secrets for app and database
2. Make sure you have config folder in the root and there is a json file inside that named database.json
   - Used for Database migrations. This project used sequelize_migrations 

```

## Keys Example

```bash
1. When running the app using docker compose, DO NOT change DB_HOST in config/database.json, since app runs via docker needs it to be postgres.
2. Also DO NOT change the value of host in production object in config/database.json, 

```


## Running the project

```bash
# development
$ docker compose up

# To make sure every dependencies are currently installed, Please run ;)
$ docker-compose up && docker-compose build --no-cache && docker-compose up

```


## Stay in touch

- Author - [Ashok Sekar](https://ashoksekar.com)
- LinkedIn - [Ashok Sekar](https://www.linkedin.com/in/imashok02)
