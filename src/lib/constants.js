export const API_URL =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.REACT_APP_VERCEL_URL}/api`
    : "http://localhost:5001/api"
