# AI Image Generator

Text-to-image generation app with user authentication and MySQL history storage.

## Features

- **Text to Image** — Generate images from text prompts using OpenAI DALL-E 3
- **User Authentication** — Register, login, JWT-based sessions
- **Image History** — All generated images saved in MySQL per user
- **Modern UI** — React frontend with dark theme

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React, Vite, React Router, Axios    |
| Backend  | Flask, Flask-JWT-Extended, SQLAlchemy |
| Database | MySQL                               |
| AI API   | OpenAI DALL-E 3                     |

## Project Structure

```
├── backend/
│   ├── app.py              # Flask entry point
│   ├── config.py           # Configuration
│   ├── database.py         # SQLAlchemy setup
│   ├── init_db.sql         # MySQL schema
│   ├── models/             # User & ImageHistory models
│   └── routes/             # Auth & image API routes
├── frontend/
│   └── src/
│       ├── api/            # Axios API client
│       ├── components/     # React components
│       └── context/        # Auth context
└── README.md
```

## Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- OpenAI API key

### 1. Database Setup

```bash
mysql -u root -p < backend/init_db.sql
```

Or run the SQL manually in MySQL Workbench.

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your values:

```env
FLASK_SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=ai_image_generator
OPENAI_API_KEY=sk-your-openai-key
```

Start the backend:

```bash
python app.py
```

Backend runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## API Endpoints

| Method | Endpoint                  | Auth | Description              |
|--------|---------------------------|------|--------------------------|
| POST   | `/api/auth/register`      | No   | Register new user        |
| POST   | `/api/auth/login`         | No   | Login user               |
| POST   | `/api/images/generate`    | Yes  | Generate image from text |
| GET    | `/api/images/history`     | Yes  | Get user's image history |
| DELETE | `/api/images/history/:id` | Yes  | Delete image from history|
| GET    | `/api/health`             | No   | Health check             |

## Usage

1. Open `http://localhost:5173`
2. Register a new account or login
3. Enter a text prompt and click **Generate Image**
4. View all past images in the **History** tab
