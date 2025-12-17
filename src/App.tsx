import GlobalStyles from "./styles/GlobalStyles.tsx";
import {RouterProvider} from "react-router";
import {useEffect, useState} from "react";
import {auth} from "./firebase.ts";
import {onAuthStateChanged, type User} from "firebase/auth"
import router from "./router/router.tsx";
import Spinner from "./components/spinner/Spinner.tsx";

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);


    const initAuth = () => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setIsLoading(false);

        });
        return unsubscribe;
    }

    useEffect(() => initAuth(), []);

    return (
        <div>
            <GlobalStyles/>
            {isLoading ? <Spinner /> : <RouterProvider router={router(currentUser)}/>}
        </div>
    );
}

export default App;