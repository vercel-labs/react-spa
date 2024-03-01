export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001/api"
    : `https://${process.env.PUBLIC_URL}/api`
