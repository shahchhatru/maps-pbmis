import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";

import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/LoginPage";
import MapComponent from "./Map";
/**--- 3. Main App Component --- */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <ProtectedRoute path="/maps">
            <MapComponent />
          </ProtectedRoute>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;