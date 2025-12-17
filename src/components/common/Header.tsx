import { Link } from "react-router";
import styled from "styled-components";

function Header() {

    return (

            <Head>
                <Nav>
                    <Link to={"/"}>React Board </Link>
                    <AuthBox>
                        <Logo to={"/login"}>로그인 </Logo>
                        <Logo to={"/register"}>회원가입 </Logo>
                    </AuthBox>
                </Nav>

            </Head>

    );
}

export default Header;

const Head = styled.header`
    background-color:#eee;
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #ccc;
`
const Nav = styled.nav`
    display: flex;
    justify-content:space-between;
    align-items:center;
    width: 100%;
    max-width: 1200px;
    padding: 10px 20px;
`
const Logo = styled(Link)`
    font-size: 1.2rem;
    font-weight: bold;  
    color: #333;
`
const AuthBox = styled.div`
    display: flex;
    gap: 15px;
`
