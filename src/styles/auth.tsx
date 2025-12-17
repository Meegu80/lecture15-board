import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
    color: #333;
    text-align: center;
    margin-bottom: 20px;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 4px;
`;

export const Input = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
`;

export const Switcher = styled.p`
    margin-top: 20px;
    text-align: center;

    a {
        color: #3b82f6;
    }
`;