import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Route, Redirect } from 'react-router-dom';

export default function ProtectedRoute({ children, ...rest }) {
  let auth = useAuth();
  
  if (auth.isLoading) {
    return <FullScreenLoader message="Authenticating..."/>;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}


function FullScreenLoader({ message = "Loading..." }) {
    // This component still uses Tailwind classes. You can replace them 
    // with your own CSS solution or a library like styled-components.
    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f7fafc'}}>
            <div style={{textAlign: 'center'}}>
                <svg style={{height: '2rem', width: '2rem', color: '#3b82f6', margin: '0 auto 1rem auto', animation: 'spin 1s linear infinite'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle style={{opacity: '0.25'}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{opacity: '0.75'}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p style={{fontSize: '1.125rem', fontWeight: '600', color: '#4a5568'}}>{message}</p>
            </div>
        </div>
    );
}

