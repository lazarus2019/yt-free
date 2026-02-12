import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { HomePage, SearchPage, LibraryPage, PlaylistPage } from '@/pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'library',
        element: <LibraryPage />,
      },
      {
        path: 'playlist/:playlistId',
        element: <PlaylistPage />,
      },
    ],
  },
]);
