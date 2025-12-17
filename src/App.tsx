import GlobalStyles from "./styles/GlobalStyles.tsx";
import {RouterProvider} from "react-router";
import {router} from "./router/router.tsx";

function App() {

    return (
        <div>
            <GlobalStyles />
            <RouterProvider router={router} />
        </div>
    );
}

export default App;