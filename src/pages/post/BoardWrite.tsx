import type { User } from "firebase/auth";
import { useNavigate } from "react-router";
import { Container, Form, Input, Title } from "../../styles/auth.tsx";
import { ActionButton, Textarea } from "../../styles/styles.tsx";
import { useForm } from "react-hook-form";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../firebase.ts";

type Props = {
    currentUser: User | null;
};

export type PostFormData = {
    title: string;
    content: string;
};

function BoardWrite({ currentUser }: Props) {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PostFormData>();

    const onSubmit = async (data: PostFormData) => {
        if (!currentUser) {
            alert("로그인 후 이용해 주세요.");
            return;
        }

        try {
            // 게시글 작성에 필요한 객체를 생성
            const newPost = {
                title: data.title,
                content: data.content,
                userId: currentUser.uid,
                username: currentUser.email,
                // new Date() : 지금 현재 시간을 출력하는 Javascript 내장 메소드
                // Timestamp.now() : 현재 시간을 출력하는 Firestore 제공 메소드
                createdAt: Timestamp.now(),
                views: 0,
            };

            // firestore에 게시글 추가
            await addDoc(collection(db, "posts"), newPost);
            alert("게시글이 성공적으로 작성되었습니다.");
            navigate("/");
        } catch (e) {
            alert("작업에 실패했습니다. " + e);
        }
    };

    return (
        <Container>
            <Title>게시글 작성</Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    placeholder={"제목을 입력해주세요."}
                    {...register("title", { required: "제목은 필수 항목입니다." })}
                />
                {errors.title && <p>{errors.title.message}</p>}
                <Textarea
                    placeholder={"내용을 입력해주세요."}
                    {...register("content", { required: "내용은 필수 항목입니다." })}
                />
                {errors.content && <p>{errors.content.message}</p>}
                <ActionButton disabled={isSubmitting}>
                    {isSubmitting ? "처리 중..." : "저장"}
                </ActionButton>
            </Form>
        </Container>
    );
}

export default BoardWrite;
