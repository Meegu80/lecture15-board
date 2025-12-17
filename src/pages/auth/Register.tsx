import { Link, useNavigate } from "react-router";
import { ActionButton } from "../../styles/styles.tsx";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.ts";
import { FirebaseError } from "firebase/app";
import { Container, Form, Input, Switcher, Title } from "../../styles/auth.tsx";

export type AuthFormType = {
    email: string;
    password: string;
};

function Register() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<AuthFormType>();

    const onSubmit = async (data: AuthFormType) => {
        try {
            await createUserWithEmailAndPassword(auth, data.email, data.password);
            navigate("/login");
        } catch (e) {
            if (e instanceof FirebaseError) {
                if (e.code === "auth/email-already-in-use") {
                    setError("root", { message: "이미 사용 중인 이메일입니다." });
                }
            } else {
                setError("root", { message: "회원가입이 실패되었습니다." });
            }
        }
    };

    return (
        <Container>
            <Title>회원가입</Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    {...register("email", { required: "이메일은 필수 입력입니다." })}
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
                <ActionButton>회원가입</ActionButton>
                {errors.root && <p>{errors.root.message}</p>}
            </Form>
            <Switcher>
                이미 계정이 있으신가요? <Link to={"/login"}>로그인</Link>
            </Switcher>
        </Container>
    );
}

export default Register;