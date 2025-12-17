import {useNavigate} from "react-router";
import styled from "styled-components";

type Props = {
    code?: string;
    title?: string;
    message?: string;

}

function ErrorPage({
                       code = "404",
                       title = "page not found",
                       message = "입력하신 주소가 정확한지 다시 한번 확인해주세요",
                   }: Props) {
    const navigate = useNavigate();
    return <Container>
        <ErrorCode>{code}</ErrorCode>
        <ErrorTitle>{title}</ErrorTitle>
        <ErrorMessage>{message}</ErrorMessage>
        <ButtonGroup>
            <ActionButton onClick={() => navigate(-1)}>이전 페이지</ActionButton>
            <ActionButton outlined={true} onClick={() => navigate("/")}>홈으로 가기</ActionButton></ButtonGroup>

    </Container>
}

export default ErrorPage;
const Container = styled.div`
    display: flex;
    width: 100vw;
    height: 100dvh;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`
const ErrorCode = styled.h1`
    font-size: 6rem;
    color: #e0e0e0;

`
const ErrorTitle = styled.h2`
    font-size: 1.5rem;
    margin: 10px 0;
    color: #333;
`
const ErrorMessage = styled.p`
    margin-bottom: 30px;
    color: #666;
`
const ButtonGroup = styled.div`
    display: flex;
    gap: 15px;
`
const ActionButton = styled.button<{ outlined?: boolean }>`
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    
    border: ${props => (props.outlined ? '1px solid #3b82f6' : 'none')};
    background-color:${props => (props.outlined ? '#fff' : '#3b82f6')};
    color: ${props => (props.outlined ? '#3b82f6' : '#fff')};
    

`