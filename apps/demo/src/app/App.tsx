import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { EditorPage } from './Editor'


const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ul>
                <li>
                    <a href={'/editor'}>editor</a>
                </li>
                <li>
                    <a href={'/preview'}>preview</a>
                </li>
            </ul>
        ),
    },
    {
        path: '/editor',
        element: <EditorPage />,
    },
])

export function App() {
    return <RouterProvider router={router} />
}

export default App
