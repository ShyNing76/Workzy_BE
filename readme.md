# Table of Contents

- [Technologies](#Technologies)
- [How to run](#How-to-run)
- [Documentation](#Documentation)

## Technologies

- [Node.js](https://nodejs.org/en/)
- [React](https://reactjs.org/)
- [MySQL](https://www.mysql.com/)

## How to run

```bash
# Run the application 
npm start 

# Run the application in development mode 
npm run dev
```

To view Swagger documentation, navigate to `http://[your-host]:[your-port]/api-docs`.

```bash
# Sequelize CLI
npx sequelize-cli

# Create a new model with attributes
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string

# Create a new migration
npx sequelize-cli migration:generate --name migration-skeleton

# Run the migrations
npx sequelize-cli db:migrate

# Undo the last migration
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all

# Create a new seed
npx sequelize-cli seed:generate --name demo-user

# Run the seeds
npx sequelize-cli db:seed:all

# Undo the seeds
npx sequelize-cli db:seed:undo:all
```

## Documentation

- [Sequelize](https://sequelize.org/master/manual/getting-started.html)
- [Sequelize CLI](https://sequelize.org/master/manual/migrations.html)
- [MySQL](https://sidorares.github.io/node-mysql2/docs/documentation)
- [Express](https://expressjs.com/en/starter/installing.html)
- [Nodemon](https://nodemon.io/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [morgan](https://www.npmjs.com/package/morgan)
- [helmet](https://www.npmjs.com/package/helmet)
- [cors](https://www.npmjs.com/package/cors)
- [joi](https://www.npmjs.com/package/joi)
