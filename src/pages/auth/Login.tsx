import {Form, Link, useNavigate} from "react-router";
import {useForm} from "react-hook-form";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../firebase.ts";
import {FirebaseError} from "firebase/app";
import {Container, Input, Switcher, Title} from "../../styles/auth.tsx";
import {ActionButton} from "../../styles/styles.tsx";
import type {AuthFormType} from "./Register.tsx";
import {signInWithEmailAndPassword} from "firebase/auth/cordova";

function Login() {

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: {errors},
        setError,
    } = useForm<AuthFormType>();

    const onSubmit = async (data: AuthFormType) => {
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            navigate("/");

        } catch (e) {
            if (e instanceof FirebaseError) {
                if (e.code === "auth/invalid-credential") {
                    setError("root", {message: "이메일 또는 비밀번호가 올바르지 않습니다. "})
                } else {
                    setError("root", {message: "로그인에 실패하였습니다. "})
                }
            }
        }
    };

    return (
        <Container>
            <Title>로그인</Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    {...register("email", {required: "이메일은 필수 입력입니다."})}
                    type={"email"}
                    placeholder={"이메일"}
                />
                {errors.email && <p>{errors.email.message}</p>}
                <Input
                    {...register("password", {
                        required: "비밀번호는 필수 입력입니다.",
                        minLength: {
                            value: 6,
                            message: "비밀번호는 6자 이상이어야 합니다.",
                        },
                    })}
                    type={"password"}
                    placeholder={"비밀번호 (6자 이상)"}
                />
                {errors.password && <p>{errors.password.message}</p>}
                <ActionButton>로그인</ActionButton>
                {errors.root && <p>{errors.root.message}</p>}
            </Form>
            <Switcher>
                이미 계정이 있으신가요? <Link to={"/login"}>로그인</Link>
            </Switcher>
        </Container>
    );
}

export default Login;