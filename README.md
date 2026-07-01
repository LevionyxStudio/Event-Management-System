# Event Management System

A full-stack web application designed for seamlessly creating, discovering, and booking events. Whether you're an organizer looking to host the next big tech conference or an attendee looking to buy tickets for a local music festival, this platform provides all the necessary tools to make it happen.

## 🌟 Key Features

### For Attendees
*   **Discover Events:** Browse a rich, responsive catalog of upcoming events categorized by Music, Technology, Sports, Arts, and Business.
*   **Secure Ticket Booking:** Seamlessly book tickets for events with an intuitive checkout flow.
*   **My Tickets Portal:** View all past and upcoming bookings, complete with scannable QR codes for event check-in.
*   **Mock Payments:** Experience a realistic checkout flow (Card & UPI) built for demo purposes. *(Note: No real transactions occur).*

### For Organizers
*   **Event Creation & Management:** Easily publish new events, update details, or delete listings through a dedicated organizer dashboard.
*   **Analytics Dashboard:** Access a powerful, visually-rich dashboard powered by Recharts to track total revenue, ticket sales trends, check-in rates, and top-performing events.
*   **Tenant Isolation:** Strict data isolation ensures that organizers only see analytics and manage events that they have explicitly created.

## 🛠️ Technology Stack

**Frontend:**
*   React.js (Vite)
*   Tailwind CSS (for responsive, modern UI design)
*   React Router DOM (client-side routing)
*   Recharts (for data visualization)
*   Axios (API integration)

**Backend:**
*   Node.js & Express.js
*   MongoDB & Mongoose (Database & ORM)
*   JSON Web Tokens (JWT) & bcryptjs (Authentication & Security)
*   qrcode (QR Code Generation)

## 🚀 How to Run Locally

To get this project up and running on your local machine, follow these steps:

### Prerequisites
*   Node.js installed on your machine
*   A running instance of MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd "Event Management System"
```

### 2. Backend Setup
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add your environment variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
npm run dev
# OR
node server.js
```
The backend should now be running on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend should now be running on `http://localhost:5173`.

## 💳 A Note on Payments
**This application uses a simulated mock payment flow.** 
During checkout, you will be prompted to enter Credit Card or UPI details. These are purely for demonstration and UX evaluation purposes. **No real transactions are processed, and no real financial data should be entered.** Upon clicking "Pay", the system will simulate a processing delay and mock a successful transaction to finalize the booking.

---

*Built with ❤️ for seamless event experiences.*
