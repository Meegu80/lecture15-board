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

export const Textarea = styled.textarea`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    min-height: 200px;
    resize: vertical;
`;