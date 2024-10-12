# Setup Instructions for Fair Platform

## Frontend Setup (React.js with TypeScript)

1. **Initialize the Project:**
� �```bash
� �npx create-react-app frontend --template typescript
� �cd frontend
� �```

2. **Install Necessary Dependencies:**
� �```bash
� �npm install axios react-router-dom @reduxjs/toolkit react-redux
� �npm install -D tailwindcss postcss autoprefixer
� �npx tailwindcss init -p
� �```

3. **Configure Tailwind CSS:**
� �- Update `tailwind.config.js`:
� �```javascript
� �module.exports = {
� � �purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
� � �darkMode: 'class', // Enable dark mode
� � �theme: {
� � � �extend: {},
� � �},
� � �variants: {
� � � �extend: {},
� � �},
� � �plugins: [],
� �};
� �```

� �- Update `src/index.css`:
� �```css
� �@tailwind base;
� �@tailwind components;
� �@tailwind utilities;
� �```

4. **Set Up Routing:**
� �- Update `src/App.tsx` to include your routes.

## Backend Setup (Node.js with Express.js)

1. **Initialize the Project:**
� �```bash
� �mkdir backend
� �cd backend
� �npm init -y
� �```

2. **Install Necessary Dependencies:**
� �```bash
� �npm install express cors dotenv pg sequelize
� �npm install -D typescript ts-node @types/express @types/node nodemon
� �```

3. **Configure TypeScript:**
� �```bash
� �npx tsc --init
� �```

4. **Set Up Basic Server:**
� �- Create `src/index.ts` and set up your Express server.

5. **Run the Server:**
� �```bash
� �npm run dev
� �```

## Additional Steps

- **Database Setup:** Ensure you have PostgreSQL installed and create a database for your application.
- **Environment Variables:** Create a `.env` file in the backend directory to store sensitive information like database credentials and JWT secrets.

## Running the Application

1. **Start the Backend:**
� �```bash
� �cd backend
� �npm run dev
� �```

2. **Start the Frontend:**
� �```bash
� �cd frontend
� �npm start
� �```

3. **Access the Application:**
� �- Frontend: [http://localhost:3000](http://localhost:3000)
� �- Backend: [http://localhost:5000](http://localhost:5000)

