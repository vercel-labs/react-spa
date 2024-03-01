## React SPA 

A minimum X clone using CRA and a split client/server architecture. 

**Client**
- JS and CRA
- **Styling:** Tailwind 
- **Routing:** react-router-dom
- **Data Fetching:** axios w/ `useEffect`
- **Forms:** Custom

**Server:**
- **API Endpoints**: Express and Knex.js
- **Auth and Session Management:** Custom - jsonwebtoken, bcrypt, cookier-parser
- **Database**: vercel/postgres

## User Actions

- Login
- Like/dislike posts
- Visit profile 

## Running the App

Client: 
```
cd client
npm i
npm start
```

Server: 
```
cd server
npm i
npm run dev
```
