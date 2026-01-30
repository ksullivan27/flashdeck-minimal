# Flashdecks

A modern, production-ready flashcard application with a clean UI and light theme. Built with React and FastAPI.

## Features

- **Create Custom Decks**: Organize your learning with custom flashcard decks
- **Smart Review**: Review cards with an intuitive flip animation
- **Track Progress**: Monitor your learning with a dashboard and activity heatmap
- **Full CRUD Operations**: Create, edit, and delete decks and cards
- **Persistent Storage**: PostgreSQL with Docker ensures data persistence

## Tech Stack

- **Frontend**: React 18 with React Router
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL 15 (Docker)
- **Build Tool**: Vite

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Docker and Docker Compose

## Quick Start

### 1. Start PostgreSQL Database

```bash
docker compose up -d
```

This will start PostgreSQL with persistent storage using a named volume.

### 2. Set Up Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at [http://localhost:8000](http://localhost:8000)
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Set Up Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173)

## Application Structure

### Pages

1. **Landing Page** (`/`)
   - Hero section with app branding
   - Login and Sign up buttons (redirect to Dashboard)
   - Feature highlights

2. **Dashboard** (`/dashboard`)
   - Statistics (deck count, card count)
   - Activity heatmap
   - Quick Start section
   - Preview of up to 4 decks

3. **All Decks** (`/decks`)
   - List of all decks
   - Create new deck button with modal form

4. **Deck Page** (`/decks/:id`)
   - Deck details and description
   - Add, edit, delete cards
   - Edit deck information
   - Start review button
   - Delete deck

5. **Review Page** (`/decks/:id/review`)
   - Card-by-card review
   - Flip animation to reveal answers
   - Next card navigation

### Shared Layout

All pages (except Landing) include:
- **Header**: "Flashdecks" branding, streak display (STREAK : 7), and light bulb icon button
- **Left Navigation Bar**: Dashboard and All Decks buttons

## API Endpoints

### Decks

- `GET /api/v1/decks` - List all decks
- `POST /api/v1/decks` - Create a new deck
- `GET /api/v1/decks/{deck_id}` - Get deck details with cards
- `PUT /api/v1/decks/{deck_id}` - Update deck
- `DELETE /api/v1/decks/{deck_id}` - Delete deck

### Cards

- `POST /api/v1/decks/{deck_id}/cards` - Create a card in a deck
- `GET /api/v1/cards/{card_id}` - Get card details
- `PUT /api/v1/cards/{card_id}` - Update card
- `DELETE /api/v1/cards/{card_id}` - Delete card

## Database

PostgreSQL runs in Docker with a persistent named volume (`flashdecks-data`). Data persists across container restarts.

### Managing the Database

```bash
# Stop the database
docker compose down

# Stop and remove data (reset database)
docker compose down -v

# View logs
docker compose logs postgres

# Check database status
docker compose ps
```

## Development

### Backend Development

The backend uses:
- **FastAPI** for the API framework
- **SQLAlchemy** for database ORM
- **Pydantic** for data validation
- **CORS** configured for frontend access

### Frontend Development

The frontend uses:
- **React 18** with functional components and hooks
- **React Router v6** for navigation
- **Axios** for API calls
- **Pure CSS** with CSS variables for theming

### Building for Production

#### Frontend

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`.

#### Backend

The backend can be deployed using:
- Uvicorn with Gunicorn
- Docker container
- Cloud platforms (AWS, GCP, Heroku, etc.)

## Project Structure

```
minimal-flashcards/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   └── decks.py
│   │   │   └── api_v1.py
│   │   ├── core/
│   │   │   └── config.py
│   │   ├── db/
│   │   │   └── session.py
│   │   ├── models/
│   │   │   ├── deck.py
│   │   │   └── card.py
│   │   ├── schemas/
│   │   │   └── deck.py
│   │   └── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── AllDecksPage.jsx
│   │   │   ├── DeckPage.jsx
│   │   │   └── ReviewPage.jsx
│   │   ├── lib/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── docker-compose.yml
```

## Features Detail

### Card Flip Animation

The review page implements a 3D flip animation using CSS transforms:
- Click the card to flip between question and answer
- Smooth 0.6s transition with preserve-3d transform style
- Different background gradients for front and back

### Activity Heatmap

The dashboard includes a GitHub-style activity heatmap:
- Static visualization (52 cells representing weeks)
- Color-coded activity levels (low, medium, high)
- Modern, minimal design

### Modal Forms

All create and edit operations use modal forms:
- Overlay with backdrop
- Click outside to close
- Form validation
- Cancel and submit buttons

## Troubleshooting

### PostgreSQL Connection Issues

If the backend can't connect to PostgreSQL:

```bash
# Check if PostgreSQL is running
docker compose ps

# View PostgreSQL logs
docker compose logs postgres

# Restart PostgreSQL
docker compose restart postgres
```

### Port Already in Use

If port 5432, 8000, or 5173 is already in use:

- Change PostgreSQL port in `docker-compose.yml`
- Change backend port in the uvicorn command
- Change frontend port in `vite.config.js`

### CORS Issues

If you encounter CORS errors, ensure the backend CORS configuration in `app/main.py` includes your frontend URL.

## License

MIT
