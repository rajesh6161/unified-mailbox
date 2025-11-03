# Unified Inbox

**Uploaded Video:** https://drive.google.com/file/d/1wQOmGO0PNhcHI1R68AKvnv_5ASGAonQP/view?usp=sharing

A multi-channel communication platform that enables teams to send, receive, and manage messages from SMS, WhatsApp, and Email within a unified dashboard. Currently integrated with **Twilio WhatsApp API**

<img src="whatsapp-preview.jpeg" alt="Project Screenshot" width="200"/>

---

## Overview

## Features

- Authentication: Secure login/signup with email and password powered by better-auth
- Unified Dashboard: View all inbound and outbound messages with channel tags, timestamps, phone numbers, and message IDs
- WhatsApp Integration: Send and receive WhatsApp messages via Twilio API
- Quick Reply: Respond to messages directly from the dashboard with a single click
- Contact Management: Organize and manage contacts with message history

---

## Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM using docker image
- **Authentication**: better-auth
- **Messaging**: Twilio WhatsApp API
- **Deployment**: ngrok

---

### Running

1. **Clone the repository**

   ```bash
   git clone https://github.com/rajesh6161/unified-mailbox
   cd unified-mailbox
   ```

2. **Set up PostgreSQL with Docker**

   ```bash
   docker run --name unified-inbox-db \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=unified_inbox \
     -p 5432:5432 \
     -d postgres:15
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   TWILIO_WHATSAPP_SANDBOX_NUMBER=+14155238886

   # Database
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/unified_inbox"

   # Authentication (better-auth)
   BETTER_AUTH_SECRET="your_secret_key"
   BETTER_AUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
   ```

5. **Set up the database**

   ```bash
   npx prisma db push
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Expose your local server with ngrok**

   In a new terminal window:

   ```bash
   ngrok http 3000
   ```

   Copy the HTTPS forwarding URL (e.g., `https://abc123.ngrok-free.app`)
