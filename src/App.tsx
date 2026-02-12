import { RouterProvider } from 'react-router-dom';
import { Providers, router } from './app';

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
