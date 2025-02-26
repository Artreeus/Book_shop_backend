# BookShopBd Backend

This project serves as a foundation for developing modern, scalable, and robust applications using TypeScript, Node.js, and Express.js. It includes essential tools and libraries for efficient backend development.

## Features
- Express.js for building web servers and APIs
- TypeScript for type safety and maintainability
- Mongoose for MongoDB interaction
-  Zod for schema validation
- JSON Web Tokens (JWT) for secure authentication
- Prettier and ESLint for code formatting and linting
- Development and production environments

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd first-project
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration
Create a `.env` file in the root directory with the following variables:

```plaintext
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=your-mongodb-link

# Authentication Configurations
BCRYPT_SALT_ROUNDS=10
JWT_SECRET=your-very-secure-jwt-secret
REFRESH_TOKEN_SECRET=your-very-secure-refresh-token-secret
ACCESS_TOKEN_EXPIRES_IN=365d
REFRESH_TOKEN_EXPIRES_IN=365d
```

## Scripts
The following scripts are available:

- **Development Mode**:
  ```bash
  npm run start:dev
  ```
- **Production Mode**:
  ```bash
  npm run start:prod
  ```
- **Build**:
  ```bash
  npm run build
  ```
- **Lint**:
  ```bash
  npm run lint
  ```
- **Lint Fix**:
  ```bash
  npm run lint:fix
  ```
- **Prettier Fix**:
  ```bash
  npm run prettier:fix
  ```



## Dependencies
### Core Dependencies
- [axios](https://www.npmjs.com/package/axios)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [joi](https://www.npmjs.com/package/joi)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [zod](https://www.npmjs.com/package/zod)

### Development Dependencies
- [TypeScript](https://www.npmjs.com/package/typescript)
- [ESLint](https://www.npmjs.com/package/eslint)
- [Prettier](https://www.npmjs.com/package/prettier)
- [ts-node-dev](https://www.npmjs.com/package/ts-node-dev)

## License
This project is licensed under the ISC License.

## Author
[Mahamudul Hasan Ratul]

---

For any issues or inquiries, feel free to reach out.

