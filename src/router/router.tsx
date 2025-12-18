import { createBrowserRouter } from "react-router";
import BoardList from "../pages/BoardList.tsx";
import BoardDetail from "../pages/post/BoardDetail.tsx";
import BoardWrite from "../pages/post/BoardWrite.tsx";
import BoardEdit from "../pages/post/BoardEdit.tsx";
import Login from "../pages/(auth)/Login.tsx";
import Register from "../pages/(auth)/Register.tsx";
import Layout from "../layouts/Layout.tsx";
import ErrorPage from "../pages/ErrorPage.tsx";
import type { User } from "firebase/auth";

const router = (currentUser: User | null) =>
    createBrowserRouter([
        {
            element: <Layout currentUser={currentUser} />,
            children: [
                { path: "/", element: <BoardList /> },
                { path: "/post/:id", element: <BoardDetail currentUser={currentUser} /> },
                { path: "/post/write", element: <BoardWrite currentUser={currentUser} /> },
                { path: "/post/edit/:id", element: <BoardEdit currentUser={currentUser} /> },
                { path: "/login", element: <Login /> },
                { path: "/register", element: <Register /> },
            ],
        },
        // 우리가 지정해준 주소 외의 모든 주소는 path: "*"를 해준 쪽으로 접근됨
        { path: "*", element: <ErrorPage /> },
    ]);

export default router;
