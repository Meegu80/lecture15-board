import type { User } from "firebase/auth";
import { useNavigate, useParams } from "react-router";
import { Container, Form, Input, Title } from "../../styles/auth.tsx";
import { ActionButton, Textarea } from "../../styles/styles.tsx";
import { useForm } from "react-hook-form";
import type { PostFormData } from "./BoardWrite.tsx";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.ts";

type Props = {
    currentUser: User | null;
};

function BoardEdit({ currentUser }: Props) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [postUserId, setPostUserId] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<PostFormData>();

    const fetchPost = async () => {
        if (!id) return;

        try {
            // 1개의 데이터만 요청하면 됨 > 쿼리 작성 필요 없음
            const postRef = doc(db, "posts", id);
            const snapshot = await getDoc(postRef);

            if (snapshot.exists()) {
                const postData = snapshot.data();

                setValue("title", postData.title);
                setValue("content", postData.content);
                setPostUserId(postData.userId);
            } else {
                alert("게시글을 찾을 수 없습니다.");
                navigate("/");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, []);


    // 화면은 BoardWrite와 동일하게 출력해주되, 가져온 값을 input과 textarea에 넣어줄 것

    // submit을 할 때에는 updateDoc를 사용해서 값을 업데이트 해줄 것
    const onSubmit = async (data: PostFormData) => {
        if (!id) return;

        try {
            // updateDoc을 통해 firebase에 업데이트 요청
            const postRef = doc(db, "posts", id);
            await updateDoc(postRef, {
                title: data.title,
                content: data.content,
            });
            alert("게시글이 수정되었습니다.");
            navigate(`/post/${id}`);
        } catch (e) {
            alert("작업에 실패했습니다. " + e)
        }
    }

    if (loading) return <div>Loading...</div>
    // 접근한 사용자가 글 작성자가 아닐 경우 alert을 띄워주고 뒤로가기 시키기
    // 1. currentUser 정보가 없거나
    // 2. postUserId 정보가 없거나
    // 3. currentUser.uid의 값과 postUserId의 값이 다를 경우
    if (!currentUser || !postUserId || currentUser.uid !== postUserId) {
        navigate(-1);
    }

    return (
        <Container>
            <Title>게시글 수정</Title>
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

export default BoardEdit;
