import { Link } from "react-router";
import styled from "styled-components";
import type { User } from "firebase/auth";
import { ActionButton } from "../../styles/styles.tsx";
import { auth } from "../../firebase.ts";

const Head = styled.header`
    background-color: #eee;
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #ccc;
`;

const Nav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    padding: 10px 20px;
`;

const Logo = styled(Link)`
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
`;

const AuthBox = styled.div`
    display: flex;
    gap: 15px;
`;

type Props = {
    currentUser: User | null;
};

function Header({ currentUser }: Props) {
    const onLogout = async () => {
        try {
            await auth.signOut();
            alert("로그아웃 되었습니다.");
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Head>
            <Nav>
                <Logo to={"/"}>React Board</Logo>
                {currentUser ? (
                    <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                        <span style={{ color: "#555" }}>
                            {/* string 타입에서 사용할 수 있는 메소드 : split() */}
                            {/* split : string에서 어떠한 글자를 기준으로 분리할 수 있는 메소드 */}
                            {/*         결과는 array 형태로 저장됨 */}
                            {/* 예시 : "abc@abc.com"을 "@"로 split 하면, ["abc", "abc.com"] 으로 반환 */}
                            환영합니다, {currentUser.email?.split("@")[0]}님!
                        </span>
                        <ActionButton onClick={onLogout}>로그아웃</ActionButton>
                    </div>
                ) : (
                    <AuthBox>
                        <Link to={"/login"}>로그인</Link>
                        <Link to={"/register"}>회원가입</Link>
                    </AuthBox>
                )}
            </Nav>
        </Head>
    );
}

export default Header;