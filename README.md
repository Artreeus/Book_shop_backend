# Assingment-4
# **Book Store API**


---



## **Getting Started**

Follow these instructions to set up the project on your local machine for development and testing purposes.

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18 or later)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [Git](https://git-scm.com/)
- A package manager like [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

### **Installation**

1. **Run These Commands In Your Terminal**
   ```bash
   git clone {This Github Repo}
   cd book-store-api
   npm install
   npm run build
   npm run start:prod

2. **Set up environment variables Create a .env file in the project root and configure the following variables:**

    ```bash
    PORT=5000
    NODE_ENV=development

    # Database Configuration
    DATABASE_URL= Your mongodb Link

    # Authentication Configurations
    BCRYPT_SALT_ROUNDS=10
    JWT_SECRET=your-very-secure-jwt-secret
    REFRESH_TOKEN_SECRET="your-very-secure-refresh-token-secret"
    ACCESS_TOKEN_EXPIRES_IN=365d
    REFRESH_TOKEN_EXPIRES_IN=365d

3. **Now You are Good to go**


# Book_shop_backend
