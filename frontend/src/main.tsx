import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from './components/ui/provider.tsx'
import { Toaster } from '@/components/ui/toaster.tsx'
import { router } from '@/router.tsx'
import { RouterProvider } from 'react-router-dom'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
    
  </StrictMode>
)
