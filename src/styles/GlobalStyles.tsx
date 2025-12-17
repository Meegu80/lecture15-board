import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    a {
        text-decoration: none;
        color: inherit;
    }
    
    input {
        &:focus {
            outline: none;
        }
    }
    
    button {
        &:focus {
            outline: none;
        }
    }
`;

export default GlobalStyles;