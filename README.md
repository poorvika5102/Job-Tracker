# AI Job Application Tracker

Track job applications on a status board, and paste a job description to see
how well it matches your skills.

**Stack:** Django + Django REST Framework, React (Vite), SQLite (PostgreSQL later), Git/GitHub.

## Run the backend
```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # optional, for /admin/
python manage.py runserver        # http://127.0.0.1:8000
```

## Run the frontend
```bash
cd frontend
npm install
npm run dev                       # http://localhost:5173
```
Vite proxies `/api` to the Django server, so run both at the same time.

## API
| Method | URL | What it does |
|---|---|---|
| GET / POST | `/api/jobs/` | List (supports `?status=` and `?search=`) or create a job |
| GET / PUT / PATCH / DELETE | `/api/jobs/<id>/` | Read, update or delete one job |
| GET | `/api/jobs/stats/` | Count of jobs per status (raw SQL) |
| POST | `/api/analyze/` | Body: `{"description": "...", "skills": ["python", "django"]}` |

## Run the tests
```bash
cd backend && python manage.py test
```

## Next steps
1. Add login (token or JWT) and filter jobs by `request.user`.
2. Swap the keyword matcher in `jobs/matcher.py` for an LLM call.
3. Switch to PostgreSQL and deploy (Render for the API, Vercel for React).
