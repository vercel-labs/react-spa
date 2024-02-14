import { createBrowserRouter, RouterProvider, Link } from "react-router-dom"
import Feed from "./feed"
import Profile from "./profile"
import { RootLayout, ProfileLayout } from "./components/layouts"

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Feed /> },
      {
        path: ":username",
        // Nested layout
        element: <ProfileLayout />,
        children: [{ index: true, element: <Profile /> }],
      },
      { path: "*", element: <NoMatch /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}

// Catch-all route
function NoMatch() {
  return (
    <div>
      <h2>Uh oh!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  )
}
