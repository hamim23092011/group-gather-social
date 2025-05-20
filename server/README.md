
# HobbyHub Backend API

This is the backend API for the HobbyHub application, built with Express and MongoDB.

## Getting Started

1. Install dependencies:
```
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

3. Start the server:
```
npm start
```
For development with auto-restart:
```
npm run dev
```

## API Endpoints

### Groups
- `GET /api/groups` - Get all groups
- `GET /api/groups/featured` - Get featured groups (limited to 6)
- `GET /api/groups/:id` - Get a specific group by ID
- `POST /api/groups` - Create a new group
- `PATCH /api/groups/:id` - Update a group
- `DELETE /api/groups/:id` - Delete a group
- `POST /api/groups/:id/join` - Join a group
- `GET /api/groups/user/:email` - Get groups created by a specific user

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Add a new category
