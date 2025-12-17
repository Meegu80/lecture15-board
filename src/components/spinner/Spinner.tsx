import styled from "styled-components";

const SpinnerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Loader = styled.div`
  width: 88px;
  height: 88px;
  border: 6px solid rgba(255, 255, 255, 0.2); /* 회색 링 */
  border-top-color: white; /* 돌아가는 포인트 */
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Spinner = () => {
  return (
    <SpinnerContainer>
      <Loader />
    </SpinnerContainer>
  );
};

export default Spinner;
