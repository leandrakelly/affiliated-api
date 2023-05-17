# affiliated-apps

![gif](https://github.com/leandrakelly/affiliated-apps/blob/main/chrome-capture-2023-4-17.gif)

This repository contains the frontend and backend applications for a Affiliated project challenge of **coodesh**.
The frontend is built using React and TypeScript with PostreSQL as database, while the backend is built using NestJS with Typescript and Prisma. Together, these applications provide a seamless user experience.
>  This is a challenge by [Coodesh](https://coodesh.com/)

## Project Description
🚀 The **Affiliated project** is a web-based application designed to meet the urgent demand for a dedicated area to upload transaction files of product sales made by the clients.

In this project, a web interface was built to enable users to effortlessly upload transaction files and easily view the transactions from the uploaded file in a user-friendly manner.
The core functionalities of the Affiliated application include:

💼 Upload Transactions: Users can easily upload transaction files containing information about the products sold by creators and affiliates.

🔄 Data Normalization: The uploaded transaction data is processed and normalized to ensure consistency and reliability.

📊 Database Storage: The normalized data is securely stored in a relational database for efficient retrieval and analysis.

This project emphasizes efficient data management and processing to provide to the clients with valuable insights into their sales performance. 
By automating the data ingestion and normalization process, the Affiliated application simplifies the management of large volumes of transaction data, empowering the clients to make informed business decisions.

## Technology Stack
🚀 The Affiliated applications are built using the following technologies:

**Frontend:**

- React ⚛️: A JavaScript library for building user interfaces.
- TypeScript 🟦: A statically typed superset of JavaScript that enhances code quality and developer productivity.
- Ant Design 🐜: A UI library with a set of customizable components for building modern and responsive user interfaces.
- Axios 🌐: A popular HTTP client library for making API requests.
- React Router DOM 🌐: A library for routing and navigation in React applications.

**Backend:**

- NestJS 🦅: A progressive Node.js framework for building efficient and scalable server-side applications.
- TypeScript 🟦: A statically typed superset of JavaScript that enhances code quality and developer productivity.
- Prisma 💎: An open-source database toolkit for TypeScript and Node.js that simplifies database access and management.
- PostgreSQL 🐘: A powerful open-source relational database management system.
- Passport ⛑️: A flexible authentication middleware for Node.js that supports various authentication strategies.
- Jest 🃏: A JavaScript testing framework for writing unit tests and running test suites.
- Docker 🐳: A platform for packaging, distributing, and running applications in containers.
- Pactum JS 📝: A powerful and expressive JavaScript library for API testing and contract testing.
## Prerequisites

Before running this application, ensure that you have the following dependencies installed:

- Node.js (version >= 14.0.0)
- npm (version >= 6.0.0) or Yarn (version >= 1.0.0)

## Frontend Installation

Follow these steps to install and set up the frontend application:

1. Clone the repository to your local machine:

```javascript
git clone <repository-url>
```

2. Navigate to the project directory:

```
cd webapp
```

3. Install the dependencies using npm or Yarn:

```
npm install
```
or
```
yarn install
```

## Frontend Usage

To start the frontend application, use the following command:

```
npm start
```
or
```
yarn start
```

This will start the development server and launch the application in your default browser. The application will automatically reload if you make any changes to the source code.

## Frontend Testing

The frontend application includes unit tests to ensure its stability and reliability. To run the tests, execute the following command:

```
npm test
```
or
```
yarn test
```

This will launch the test runner and display the test results in the console.

## Frontend Linting

To lint the source code and ensure it adheres to the defined coding standards, you can run the linting script:

```
npm run lint
```
or
```
yarn lint
```

This will check your code for any potential issues or violations of the defined rules.

## Frontend Building for Production

To build the application for production, use the following command:

```
npm run build
```
or
```
yarn build
```

This will create an optimized and minified version of the application in the `build` directory. You can then deploy this version to a web server or hosting platform of your choice.

## Frontend Additional Scripts

- `npm run format`: Formats the source code using Prettier.
- `npm run coverage`: Runs tests and generates a coverage report.
- `npm run eject`: Ejects the application from the default setup, allowing customization of the build configuration.

## Backend Installation
Follow these steps to install and set up the backend application:

Navigate to the backend directory:
```
cd api
```
Install the dependencies using npm or Yarn:

```
npm install
```
or
```
yarn install
```
## Backend Usage
To start the backend application, use the following command:

```
npm run start:dev
```
or

```
yarn start:dev
```
This will start the backend server in development mode and make it ready to handle incoming requests.

## Backend Testing
The backend application includes tests to ensure its functionality is working as expected. To run the unit tests, execute the following command:

```
npm test
```
or
```
yarn test
```
This will launch the test runner and display the test results in the console.

To run end-to-end (e2e) tests, use the following command:

```
npm run test:e2e
```
or
```
yarn test:e2e
```
The e2e tests are configured to use a separate test database, which can be started using the provided Docker Compose script. To start the test database container, use the following command:
```
docker-compose up -d test-db
```
To stop and remove the test database container, you can use:
```
docker-compose rm -s -f -v test-db
```

## Backend Database
The backend application uses Prisma as an ORM to interact with the database. By default, it expects a PostgreSQL database to be available. You can configure the database connection in the .env file.

If you have Docker installed, you can use the provided Docker Compose configuration to run the database in a Docker container. To start the database container, use the following command:
```
docker-compose up -d dev-db
```
To stop and remove the database container, you can use:
```
docker-compose rm -s -f -v dev-db
```

## Additional Backend Scripts
- `npm run prisma:dev:deploy`: Deploys the Prisma migrations to the development database.
- `npm run prisma:test:deploy`: Deploys the Prisma migrations to the test database.

- `npm run db:dev:up`: Starts the development database container using Docker Compose.
- `npm run db:dev:rm`: Stops and removes the development database container.
- `npm run db:dev:restart`: Restarts the development database container and applies migrations.
- `npm run db:test:up`: Starts the test database container using Docker Compose.
- `npm run db:test:rm`: Stops and removes the test database container.
- `npm run db:test:restart`: Restarts the test database container and applies migrations.

## Creative Process and Development Notes
During the development of the **Affiliated project**, detailed annotations and insights were recorded to document the creative process and track the progress made. 
These annotations provide valuable information about the implementation details, challenges faced, and solutions devised throughout the development journey.

To access the comprehensive documentation of the creative process, please refer to the Affiliated Creative Process Notion Page. 
The Notion page contains a wealth of information, including project decisions, and other relevant insights that shed light on the development of the project.
[See Here](https://waiting-earwig-bf2.notion.site/Creating-an-Affiliated-REST-API-with-NestJS-Prisma-PostgreSQL-Docker-JWT-Authentication-Pactum--aeb19f4c9343402c8b56c957f458c4cf)

Feel free to dive into the details of the Affiliated project's creative journey and leverage the knowledge shared in the Notion page to further explore and enhance the application.

## License

This project is licensed under the [MIT License](LICENSE).

---

Thank you for using the Affiliated frontend application.
