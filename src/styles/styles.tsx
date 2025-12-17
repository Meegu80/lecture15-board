import styled from "styled-components";

export const ActionButton = styled.button<{ outlined?: boolean }>`
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;

    border: ${props => (props.outlined ? "1px solid #3b82f6" : "none")};
    background-color: ${props => (props.outlined ? "white" : "#3b82f6")};
    color: ${props => (props.outlined ? "#3b82f6" : "white")};
`;