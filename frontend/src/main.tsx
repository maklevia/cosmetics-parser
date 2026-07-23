import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from './components/ui/provider.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginScreen from '@/components/auth/screens/LoginScreen/LoginScreen.tsx'
import SignUpScreen from '@/components/auth/screens/SignUpScreen/SignUpScreen.tsx'
import { CollectionScreen } from '@/components/collection/screens/CollectionScreen.tsx'
import { Toaster } from '@/components/ui/toaster.tsx'
import { ProfileScreen } from '@/components/profile/ProfileScreen.tsx'

const router = createBrowserRouter([
  {path: '/', element: <App />},
  {path: '/login', element: <LoginScreen />},
  {path: '/signup', element: <SignUpScreen />},
  {path: '/collection', element: <CollectionScreen />},
  {path: '/profile', element: <ProfileScreen />},
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
    
  </StrictMode>
)
