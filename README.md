### Eagle
A system for scrapyd crawler management.

**Features:**
1. Manage distributed server.
2. Deploy project distributed.
3. Auto eggifying.
4. Manage project version.
5. Schedule spider and run/stop jobs.
6. Visual the process for data crawling.

**How to Start**

Requirements:
- Django
  - Python 3.x
  - Django 1.11
  - Mysql 5.7
- Vue.js
  - Node.js 6.1
  
Configuration:
- django settings (`/eagle/eagle/settings.example.py` -> `settings.py`)
  - set cross-domain whitelist. `CORS_ORIGIN_WHITELIST`
  - set mysql connection. `DATABASES`
  - start django server (current path:`/eagle/`). `python manage.py runserver`
- go front-end (`/eagle/eagle-front`)
  - install requirement for vue. `npm install`
  - start front-end project. `npm run build`

