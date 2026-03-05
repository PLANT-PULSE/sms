# MessageHub Django Backend

This is the production-ready REST API backend for the MessageHub application, providing user authentication, contact management, and multi-channel messaging (SMS, Email, WhatsApp).

## Tech Stack
- Django & Django REST Framework (DRF)
- PostgreSQL
- JWT Authentication (`djangorestframework-simplejwt`)

## Prerequisites
- Python 3.10+
- PostgreSQL 13+
- Docker (optional, for containerized deployment)

## Setup Instructions (Local)

1. **Clone the repository and jump into the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment and install dependencies:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables:**
   - Copy `.env.example` to `.env`.
   - Update `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_PORT` to match your local PostgreSQL database credentials.

4. **Initialize Database:**
   ```bash
   python manage.py makemigrations api
   python manage.py migrate
   ```

5. **Create Superuser (Admin):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the Server:**
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000/api/`.

## API Documentation

### Authentication
- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login and get JWT tokens
- `POST /api/auth/refresh/` - Refresh JWT access token

*(For all other endpoints, include `Authorization: Bearer <your_access_token>` in headers)*

### Contacts
- `GET /api/contacts/` - List all contacts
- `POST /api/contacts/` - Create contact
- `PATCH /api/contacts/<id>/` - Update contact
- `DELETE /api/contacts/<id>/` - Delete contact

### Messages & Logs
- `POST /api/messages/send/` - Send a message to grouped contacts.
  **Body Example:**
  ```json
  {
      "channel": "SMS",
      "content": "Hello via SMS",
      "contact_ids": [1, 2]
  }
  ```
- `GET /api/messages/` - Retrieve sent messages history
- `GET /api/messages/<id>/` - Retrieve message details
- `GET /api/logs/` - Get delivery logs.
- `GET /api/logs/<id>/` - Get log detail.

## Setting Up Real Third-Party APIs

The application currently has placeholder functions for sending messages in `api/services.py`. To route traffic through real providers:

1. Look in `api/services.py` inside the `MessageService` class.
2. For SMS, replace the `send_sms` placeholder print with the Twilio Python SDK logic.
3. For Email, utilize the SendGrid Python SDK or Python's built-in `smtplib` via Django's `send_mail()`.
4. For WhatsApp, perform standard HTTP POST requests to `https://graph.facebook.com/v17.0/<PHONE_NUMBER_ID>/messages`.
5. Populate your `.env` with the relevant API Keys.

## ERD Diagram Details
- **User:** Extended AbstractUser with Company/Role.
- **Contact:** Associated with User. Contains info & tags/groups.
- **Message:** Associated with User. Contains content and channel spec.
- **MessageLog:** Tracks delivery status of `Message` to a specific `Contact`.

## Running with Docker

1. Ensure Docker Desktop is running.
2. In the `backend` root, build the image:
   ```bash
   docker build -t messagehub-backend .
   ```
3. Run the container:
   ```bash
   docker run -p 8000:8000 --env-file .env messagehub-backend
   ```
