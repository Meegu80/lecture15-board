import { Outlet } from "react-router";
import Header from "../components/common/Header.tsx";
import type { User } from "firebase/auth";

type Props = {
    currentUser: User | null;
};

function Layout({ currentUser }: Props) {
    return (
        <>
            <Header currentUser={currentUser} />
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default Layout;
