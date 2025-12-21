import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Provides authentication state and user information from the global AuthContext.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
