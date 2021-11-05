import { Navigate, useLocation } from 'react-router-dom';

/**
 * A wrapper around the element which checks if the user is authenticated
 * If authenticated, renders the passed element
 * If not authenticated, redirects the user to Login page.
 */

 function RequireAuth({ children }) {
  let location = useLocation();

  if (!localStorage.getItem("accessToken")) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}

export default RequireAuth;