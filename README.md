# 🏨 NestJS Hotel Booking API

A scalable backend API for a hotel booking platform built with [NestJS](https://nestjs.com/), [TypeORM](https://typeorm.io/), and PostgreSQL.

## 🚀 Features

- ✅ Hotel management with rooms and amenities, Booking and cancellation
- 🔍 Advanced hotel search with filters (price, rating, amenities, etc.)
- 📅 Room availability based on real-time booking dates
- 🛏️ Booking with Stripe payment integration
- ❤️ Add/remove favorites
- ✍️ Public hotel reviews
- 🧑 Auth with JWT (login/register)
- 🛠️ Admin dashboard for hotel and room management
- Role-based Authorization
- Email Notifications

---

## 🗂️ Project Structure

src/
├── auth/ # Authentication (JWT)
├── bookings/ # Booking logic
├── favorites/ # Favorites management
├── hotels/ # Hotel entity, search, and admin features
├── payments/ # Stripe payment integration
├── reviews/ # Hotel reviews (public)
├── rooms/ # Room entities, availability
├── users/ # User management
└── main.ts # App entry point

---

## 🛠️ Technologies Used

- **NestJS** - Node.js framework
- **TypeORM** - ORM for PostgreSQL
- **PostgreSQL** - Relational DB
- **Stripe API** - Payments
- **JWT** - Authentication
- **class-validator** - DTO validation

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amir2015/nestybooking.git
   cd nestybooking
   npm install
   npm run start:dev
   ```

📖 API Endpoints
  🔐 Auth
  POST /auth/register

  POST /auth/login

🏨 Hotels
  GET /hotels - List all hotels

  GET /hotels/:id - Hotel by ID

  POST /hotels/search - Search hotels with filters

  GET /hotels/:id/reviews - Public reviews for a hotel

🛏️ Rooms
  GET /rooms/:id - Room details

  GET /rooms/availability?hotelId=&checkIn=&checkOut= - Check availability

📅 Bookings
  POST /bookings - Create booking (with Stripe session)

  GET /bookings/:userId - User bookings

  POST /webhook - Stripe webhook (handle payment confirmation)

💳 Payments
  POST /payments/create-checkout-session - Create Stripe checkout session

❤️ Favorites
  POST /favorites/:hotelId - Add hotel to favorites

  DELETE /favorites/:hotelId - Remove from favorites

  GET /favorites - List user's favorites`

✍️ Reviews

  POST /reviews/:hotelId - Submit a review

  GET /hotels/:hotelId/reviews - Public reviews for a hotel

🛠️ Admin

  POST /admin/hotels - Add hotel

  PATCH /admin/hotels/:id - Edit hotel

  DELETE /admin/hotels/:id - Remove hotel

  POST /admin/rooms/:hotelId - Add room to hotel

...requires admin privileges (via role-based access)

👨‍💻 Author

Amir Zahran
Backend Developer | NestJS & TypeScript Enthusiast

📝 License
This project is licensed under the MIT License.

🚀 What’s Next?

1. 🧪 Tests

✅ Unit tests

✅ E2E tests

2.📦 Dockerize the App
3.🌐 Deploy It
4.📚 Add Swagger API Docs
