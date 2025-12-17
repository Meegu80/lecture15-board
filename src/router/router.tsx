import {createBrowserRouter} from "react-router";
import Layout from "../layouts/Layout.tsx";
import BoardList from "../pages/BoardList.tsx";
import BoardDetail from "../pages/post/BoardDetail.tsx";
import BoardWrite from "../pages/post/BoardWrite.tsx";
import BoardEdit from "../pages/post/BoardEdit.tsx";
import Login from "../pages/auth/Login.tsx";
import Register from "../pages/auth/Register.tsx";
import ErrorPage from "../pages/ErrorPage.tsx";

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {path: "/", element: <BoardList/>},
            {path: "/post/:id", element: <BoardDetail/>},
            {path: "/post/write", element: <BoardWrite/>},
            {path: "/post/edit", element: <BoardEdit/>},
            {path: "/login", element: <Login/>},
            {path: "/register", element: <Register/>},
        ]
    },
    {path: "*", element: <ErrorPage />},
]);