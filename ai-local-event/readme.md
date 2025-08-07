local-events-agent/
├── frontend/                        # React app
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LocationInput.jsx
│   │   │   ├── InterestSelector.jsx
│   │   │   ├── EventCard.jsx
│   │   │   └── SubscribeForm.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── EventSearchPage.jsx
│   │   │   └── SubscribePage.jsx
│   │   ├── services/api.js         # Axios config
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json

├── backend/                        # FastAPI backend
│   ├── main.py                     # API routing
│   ├── models.py                   # Pydantic schemas
│   ├── ai_filter.py                # GPT-4o logic
│   ├── scraper.py                  # Scraping logic
│   ├── database.py                 # Supabase client
│   ├── email_service.py            # Email notifications
│   └── config.py                   # Env & keys

├── .env                            # Keys (OpenAI, Supabase, SMTP)
├── requirements.txt
├── README.md
