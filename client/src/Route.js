import { useStateValue } from './StateProvider';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Login from './Login'
import Register from './Register'
import Home from './Home'



const Route = () => {
    const [state , ] = useStateValue();
    const router = createBrowserRouter([
        {
            path: "/",
            element: state.isLoggedIn ? <Home /> : <Login />,
        },
        {
            path: "/register",
            element: state.isLoggedIn ? <Home /> : <Register />,
        },
        ]);
    return (
        <>
        <RouterProvider router={router} />
        </>
    )
}

export default Route