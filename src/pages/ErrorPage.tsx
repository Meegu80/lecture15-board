import { useNavigate } from "react-router";
import styled from "styled-components";
import { ActionButton } from "../styles/styles.tsx";

type Props = {
    code?: string | number;
    title?: string;
    message?: string;
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100dvh;
`;

const ErrorCode = styled.h1`
    font-size: 6rem;
    color: #e0e0e0;
`;

const ErrorTitle = styled.h2`
    font-size: 1.5rem;
    margin: 10px 0;
    color: #333;
`;

const ErrorMessage = styled.p`
    margin-bottom: 30px;
    color: #666;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 15px;
`;

// function에서 매개변수가 들어오지 않을 때의 기본값을 설정할 때에는,
// 선언부에 code = 뭐뭐뭐 형식으로 적을 수 있음
function ErrorPage({
    code = "404",
    title = "페이지를 찾을 수 없습니다.",
    message = "입력하신 주소가 정확한지 다시 한 번 확인해주세요",
}: Props) {
    const navigate = useNavigate();

    return (
        <Container>
            <ErrorCode>{code}</ErrorCode>
            <ErrorTitle>{title}</ErrorTitle>
            <ErrorMessage>{message}</ErrorMessage>

            <ButtonGroup>
                <ActionButton onClick={() => navigate(-1)}>이전 페이지</ActionButton>
                <ActionButton outlined={true} onClick={() => navigate("/")}>
                    홈으로 가기
                </ActionButton>
            </ButtonGroup>
        </Container>
    );
}

export default ErrorPage;
