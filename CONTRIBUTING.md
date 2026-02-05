# Project_Deliveroo – Contribution Rules

## Branching
- main is protected
- No direct pushes to main
- Create feature branches:
  feature/<short-name>

## File Ownership
Only edit files assigned to you.

🔧 BACKEND TEAM
👩🏽‍💻 Backend Member 1 – Auth & Security

Scope: Authentication, authorization, route protection

Owned files:

backend/app/routers/auth.py

backend/app/services/auth.py

backend/app/models/user.py

backend/app/schemas/user.py

backend/app/middleware/security.py ✅ (newly added)

Notes:

Owns JWT logic, role checks, and dependencies like get_current_user

Other members may import from security.py but must not edit it

👨🏽‍💻 Backend Member 2 – Parcels

Scope: Parcel lifecycle and business rules

Owned files:

backend/app/routers/parcels.py

backend/app/models/parcel.py

backend/app/schemas/parcel.py

Notes:

Enforces rules like “cannot edit if delivered”

Handles ownership validation (user can only cancel own parcel)

👩🏽‍💻 Backend Member 3 – Admin & Notifications

Scope: Admin-only actions and external services

Owned files:

backend/app/routers/admin.py

backend/app/services/email.py

backend/app/services/maps.py

Notes:

Uses security dependencies but does not modify them

Handles email triggers and map-related backend logic

🎨 FRONTEND TEAM
👩🏽‍💻 Frontend Member 4 – User UI & State

Scope: User-facing screens and auth state

Owned files:

frontend/src/pages/Login.jsx

frontend/src/pages/Register.jsx

frontend/src/pages/Dashboard.jsx

frontend/src/contexts/AuthContext.jsx

👨🏽‍💻 Frontend Member 5 – Maps & Admin UI

Scope: Maps visualization and admin interface

Owned files:

frontend/src/components/MapContainer.jsx

frontend/src/pages/AdminDashboard.jsx

frontend/src/utils/api.js