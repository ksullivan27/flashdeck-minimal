# Getting Started with Flashdecks

## Current Status

Your Flashdecks application is now **fully set up and running**!

### Running Services

- **PostgreSQL Database**: Running on port 5432 (Docker container)
- **Backend API**: Running on [http://localhost:8000](http://localhost:8000)
- **Frontend**: Running on [http://localhost:5174](http://localhost:5174)

## Access the Application

Open your web browser and navigate to:
**[http://localhost:5174](http://localhost:5174)**

## Quick Test

The backend has been tested and is working correctly:
- ✅ Database connection established
- ✅ Deck creation working
- ✅ Card creation working
- ✅ CRUD operations functional

## Application Flow

1. **Landing Page** - Click "Log in" or "Sign up" to enter the app
2. **Dashboard** - View your deck statistics and quick access
3. **All Decks** - Create and manage all your decks
4. **Deck Page** - Add, edit, and delete cards in a deck
5. **Review Page** - Study your cards with flip animation

## Managing the Application

### Stop the Services

```bash
# Stop frontend (press Ctrl+C in the terminal running npm)
# Stop backend (press Ctrl+C in the terminal running uvicorn)

# Stop PostgreSQL
docker compose down
```

### Start Again Later

```bash
# Start PostgreSQL
docker compose up -d

# Start Backend (from backend directory)
cd backend
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
uvicorn app.main:app --reload --port 8000

# Start Frontend (from frontend directory)
cd frontend
npm run dev
```

### Reset Database

To clear all data and start fresh:

```bash
docker compose down -v
docker compose up -d
```

This will delete all decks and cards.

## API Documentation

While the backend is running, you can access interactive API documentation at:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Features Implemented

### ✅ Complete Feature List

- [x] Modern landing page with hero section
- [x] Dashboard with statistics (deck count, card count)
- [x] Activity heatmap visualization
- [x] Create, edit, and delete decks
- [x] Create, edit, and delete cards
- [x] Review mode with card flip animation
- [x] Shared layout with header and navigation
- [x] Responsive grid layouts
- [x] Modal forms for all create/edit operations
- [x] Confirmation dialogs for delete operations
- [x] Empty states and loading indicators
- [x] PostgreSQL persistent storage with Docker
- [x] Full CRUD API endpoints
- [x] Error handling

### UI Components

- **Header**: Flashdecks branding, STREAK : 7 display, light bulb icon button
- **Left Navigation**: Dashboard and All Decks links with active states
- **Cards**: Modern card design with hover effects
- **Modals**: Overlay modals with form validation
- **Flashcard**: 3D flip animation for question/answer reveal

## Project Structure

```
minimal-flashcards/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Configuration
│   │   ├── db/          # Database setup
│   │   ├── models/      # SQLAlchemy models
│   │   └── schemas/     # Pydantic schemas
│   └── requirements.txt
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # API client
│   │   └── styles/      # CSS styles
│   └── package.json
└── docker-compose.yml   # PostgreSQL setup
```

## Troubleshooting

### Frontend not loading?
- Check that the frontend server is running on port 5174
- Check browser console for errors

### API calls failing?
- Verify backend is running on port 8000
- Check `http://localhost:8000/health` returns `{"status":"healthy"}`

### Database connection errors?
- Check PostgreSQL is running: `docker compose ps`
- Restart PostgreSQL: `docker compose restart postgres`

## Next Steps

You can now:
1. Create multiple decks
2. Add cards to each deck
3. Use the review feature to study
4. Edit and delete content as needed

All data will persist across restarts thanks to the Docker volume!

Enjoy your Flashdecks application! 🎉
