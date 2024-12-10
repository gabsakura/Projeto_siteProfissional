# Financial Dashboard & Inventory Management System

A modern web application built with React and Node.js for managing finances, inventory, and user profiles.

![Dashboard Preview](dashboard-preview.png)

## 🌟 Features

### Dashboard
- Real-time financial data visualization
- Multiple chart types (line, bar, pie)
- Customizable date ranges
- Key performance indicators (KPIs)
- Responsive design for all devices

### Inventory Management
- Add, edit, and delete inventory items
- Real-time stock tracking
- Product descriptions and pricing
- Search and filter functionality
- Stock alerts

### User Management
- Secure authentication system
- Role-based access control (Admin/User)
- Customizable user profiles
- Profile picture upload
- Password management

### Security
- JWT authentication
- Protected API routes
- Password encryption
- Session management
- Input validation

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- SQLite3

### Installation

1. Clone the repository

```
git clone https://github.com/yourusername/financial-dashboard.git
cd financial-dashboard
```

2. Install dependencies
```bash
# Install all dependencies
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory and add:
```env
JWT_SECRET=your_jwt_secret_key
PORT=5000
DB_PATH=./database.db
VITE_API_URL=http://localhost:5000
```

4. Start the application
```bash
# Start the backend server
npm run server

# In another terminal, start the frontend
npm run dev
```

The application will be running at `http://localhost:5173`

## 🛠️ Technology Stack

### Frontend
- React 18
- Material-UI (MUI)
- Recharts for data visualization
- Axios for API requests
- Vite for build tool
- React Router for navigation

### Backend
- Node.js
- Express.js
- SQLite3 for database
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads

## 📊 Database Structure

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  tipo TEXT DEFAULT 'user',
  verified BOOLEAN DEFAULT false,
  avatar TEXT,
  descricao TEXT
);
```

### Inventory Table
```sql
CREATE TABLE inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  descricao TEXT,
  preco DECIMAL(10,2)
);
```

### Financial Data Table
```sql
CREATE TABLE financial_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  total_money REAL,
  total_customers INTEGER,
  profit REAL,
  sales REAL,
  expenses REAL,
  new_customers INTEGER,
  timestamp TEXT
);
```

## 🔐 Authentication

Default test credentials:

```
Admin User:
Email: admin@example.com
Password: admin123

Regular User:
Email: user@example.com
Password: user123
```

## 📱 API Endpoints

### Authentication
- POST `/api/login` - User login
- POST `/api/users/register` - Register new user (admin only)

### Users
- GET `/api/users/:id` - Get user details
- PUT `/api/users/:id` - Update user profile
- PUT `/api/users/:id/password` - Change password

### Inventory
- GET `/api/inventory` - Get all inventory items
- POST `/api/inventory` - Add new item
- PUT `/api/inventory/:id` - Update item
- DELETE `/api/inventory/:id` - Delete item

### Financial Data
- GET `/api/financial_data` - Get financial data
- Query params: startDate, endDate

## 🔧 Development

To run the application in development mode:

```bash
# Start backend with nodemon
npm run server:dev

# Start frontend with hot reload
npm run dev
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Building for Production

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/)
- [Recharts](https://recharts.org/)
- [SQLite](https://www.sqlite.org/)
- [Express.js](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)

## 📧 Support

For support, email your-email@example.com or open an issue in the repository.