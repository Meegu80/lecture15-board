import GlobalStyles from "./styles/GlobalStyles.tsx";
import {RouterProvider} from "react-router";
import {router} from "./router/router.tsx";
import {useEffect, useState} from "react";
import {auth} from "./firebase.ts";

function App() {
    const [isLoading, setIsLoading] = useState(true);

    const init = () => {
        return auth.authStateReady().then(
            () => setIsLoading(false),
        )
    }
    useEffect(() => {
        init().then(() => {

        })

    }, []);

    return (
        <div>
            <GlobalStyles/>
            {isLoading ? <h1>인증 상태 확인중...</h1> : <RouterProvider router={router}/>}
        </div>
    );
}

export default App;