import {Outlet} from "react-router";
import Header from "../components/common/Header.tsx";

function Layout() {

    return (
        <>
            <Header />
            <main>
                <Outlet/>
            </main>
        </>
    );
}

export default Layout;