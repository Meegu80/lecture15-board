import GlobalStyles from "./styles/GlobalStyles.tsx";
import { RouterProvider } from "react-router";
import router from "./router/router.tsx";
import { useEffect, useState } from "react";
import { auth } from "./firebase.ts";
import { onAuthStateChanged, type User } from "firebase/auth";

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // auth.authStateReady() 를 통해서 이 프로그램 내부에 사용자에 대한 정보 저장은 가능하나
    // 그것이 화면에 바로 반영되지 않음

    const initAuth = () => {
        // subscribe 라는 단어는 구독 이라는 단어 입니다.
        // onAuthStateChange : 로그인이 되어져 있거나, 로그인이 안되어져 있다는 사용자 정보를
        //                     지속적으로 감지하여 값을 반영해주는 메소드
        // onAuthStateChange(auth, 사용자 정보가 변경되면 실행될 함수)
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setIsLoading(false);
        });

        return unsubscribe;
    };

    // 초기 렌더링이 끝난 이후, useEffect 내에 기재한 함수가 실행되며,
    // 그 함수는 return initAuth()를 내보냄에 따라 initAuth()가 실행됨
    useEffect(() => initAuth(), []);

    return (
        <>
            <GlobalStyles />
            {isLoading ? (
                <h1>인증 상태 확인중...</h1>
            ) : (
                <RouterProvider router={router(currentUser)} />
            )}
        </>
    );
}

export default App;
