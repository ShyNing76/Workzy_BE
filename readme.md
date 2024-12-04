<div align="center">
  <h1>Workzy Backend - Pod Workspace Booking API 🚀</h1>

  [![API Status](https://img.shields.io/website?url=https://workzy.onrender.com/api-docs&label=api)](https://workzy.onrender.com/api-docs)
  [![Documentation](https://img.shields.io/badge/documentation-swagger-green.svg)](https://workzy.onrender.com/api-docs)
</div>

Backend API service for Workzy - a modern workspace booking platform that simplifies the process of reserving pod workspaces. Built with Node.js and Express.js, this API provides all the necessary endpoints to manage workspace bookings, user authentication, and administrative functions.

## 🌐 API Documentation

- API Base URL: `https://workzy.onrender.com`
- Swagger Documentation: `https://workzy.onrender.com/api-docs`

## ✨ Key Features

- RESTful API architecture
- JWT-based authentication system
- Role-based access control (Admin, Manager, Staff, User)
- Real-time workspace availability tracking
- Secure payment processing integration
- Email notification system
- Booking management system
- User profile management
- Admin dashboard endpoints
- API rate limiting and security features

## 🛠 Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage:** Firebase Storage
- **Payment Processing:** PayPal API
- **Documentation:** Swagger/OpenAPI
- **Email Service:** Nodemailer
- **Testing:** Jest
- **Validation:** Joi
- **Security Packages:**
  - helmet
  - cors
  - express-rate-limit
  - xss-clean

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn
- Firebase account
- PayPal developer account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YourUsername/Workzy_BE.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
# Server
PORT=5000
HOST=localhost
SERVER_URL=
URI_CLIENT=
CLIENT_URL=

# Paging
PAGE_LIMIT=10

# Database supabase
DATABASE_HOST=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_PORT=
DATABASE_NAME=
DATABASE_DIALECT=

# Sequelize
NODE_ENV=

# Hash password
SALT_ROUNDS=

# JWT
JWT_SECRET=

# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_CLIENT_URI=

# Firebase
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
FIREBASE_DATABASE_URL=
FIREBASE_WEB_PUSH_KEY=
FIREBASE_PRIVATE_WEB_PUSH_KEY=

# Paypal
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=
PAYPAL_RETURN_URL=
PAYPAL_CANCEL_URL=

# Mailer
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASSWORD=
```

5. Initialize the database:
```bash
npm run db:migrate
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 🔒 Security

This API implements several security measures:
- JWT-based authentication
- Request rate limiting
- XSS protection
- CORS configuration
- Helmet security headers
- Input validation
- SQL injection protection

## 👥 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🤝 Support

For support and queries:
- Email: workzy.contact@gmail.com
- API Issues: Create a GitHub issue
- Documentation: Check our Swagger docs

## 🙏 Acknowledgments

- Thanks to all contributors who have helped with the API development
- Special thanks to our lecturer [Nguyen The Hoang](https://github.com/doit-now) for guidance
- Appreciation to the open-source community for the amazing tools and libraries

---

<div align="center">
  Built with ❤️ by the Workzy Backend Team
</div>