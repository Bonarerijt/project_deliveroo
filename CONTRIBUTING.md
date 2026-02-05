# Project_Deliveroo – Contribution Rules

## Branching
- main is protected
- No direct pushes to main
- Create feature branches:
  feature/<short-name>

## File Ownership
Only edit files assigned to you.

Backend Member 1 – Auth
- backend/app/routers/auth.py
- backend/app/services/auth.py
- backend/app/models/user.py
- backend/app/schemas/user.py

Backend Member 2 – Parcels
- backend/app/routers/parcels.py
- backend/app/models/parcel.py
- backend/app/schemas/parcel.py

Backend Member 3 – Admin
- backend/app/routers/admin.py
- backend/app/services/email.py
- backend/app/services/maps.py

Frontend Member 4 – User UI
- frontend/src/pages/Login.jsx
- frontend/src/pages/Register.jsx
- frontend/src/pages/Dashboard.jsx
- frontend/src/contexts/AuthContext.jsx

Frontend Member 5 – Maps & Admin UI
- frontend/src/components/MapContainer.jsx
- frontend/src/pages/AdminDashboard.jsx
- frontend/src/utils/api.js

## Shared Files (Owner Only)
- backend/app/main.py
- frontend/src/App.jsx
