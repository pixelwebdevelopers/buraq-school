import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import router from '@/routes';
import { Toaster } from 'react-hot-toast';

/**
 * App — root component.
 * Wraps the entire application with global providers.
 */
export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
