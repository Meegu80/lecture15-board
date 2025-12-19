import type { User } from "firebase/auth";
import styled from "styled-components";
import { ActionButton } from "../styles/styles.tsx";
import { useForm } from "react-hook-form";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    Timestamp,
} from "firebase/firestore";
import { db } from "../firebase.ts";
import { useNavigate } from "react-router";
import { useCallback, useEffect, useState } from "react";

type Props = {
    postId: string;
    currentUser: User | null;
};

const Section = styled.section`
    margin-top: 40px;
    border-top: 2px solid #eee;
    padding-top: 20px;
`;

const CommentCount = styled.h3`
    font-size: 18px;
    margin-bottom: 15px;
    color: #333;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 30px;
`;

const InputWrapper = styled.div`
    display: flex;
    gap: 10px;
    width: 100%;
`;

const Textarea = styled.textarea`
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: none;
    height: 60px;

    &:focus {
        outline: none;
        border-color: #007bff;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
`;

const CommentList = styled.ul`
    list-style: none;
`;

const CommentItem = styled.li`
    padding: 15px 0;
    border-bottom: 1px solid #f1f1f1;
`;

const Meta = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 13px;
    color: #888;

    strong {
        color: #333;
        margin-right: 10px;
    }
`;

const DeleteButton = styled.button`
    background: none;
    border: none;
    color: tomato;
    font-size: 12px;
    cursor: pointer;
    text-decoration: underline;

    &:hover {
        color: #a71d2a;
    }
`;

type CommentFormData = {
    content: string;
};

type CommentType = {
    id: string;
    content: string;
    createdAt: Timestamp;
    userId: string;
    username: string;
};

function CommentContainer({ postId, currentUser }: Props) {
    const navigate = useNavigate();
    const [comments, setComments] = useState<CommentType[]>([]);

    // 1-1. 댓글을 작성하는 폼 만들기
    // 1-2. 폼데이터(textarea)를 submit할 때 firebase에 쓰는 핸들러(function) 만들기

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CommentFormData>();

    const onSubmit = async (data: CommentFormData) => {
        if (!currentUser) return;
        // 일반적인 컬렉션에 저장하는 것이 아니라,
        // 그 posts 컬렉션의 하위 컬렉션인 comments 하위 컬렉션(sub collection)에 저장

        try {
            const newComment = {
                content: data.content,
                userId: currentUser.uid,
                username: currentUser.email,
                createdAt: Timestamp.now(),
            };

            await addDoc(collection(db, "posts", postId, "comments"), newComment);
            reset(); // 폼에 입력되어져 있는 값 초기화

            await fetchComments();
        } catch (e) {
            alert("댓글을 작성하지 못 했습니다.");
            console.log(e);
        }
    };

    // 2-1. 댓글의 내용을 불러오기
    // 2-2. 댓글의 내용을 화면에 출력해주기
    const fetchComments = useCallback(async () => {
        try {
            // 데이터를 불러오고
            const querySnapshot = query(
                collection(db, "posts", postId, "comments"),
                orderBy("createdAt", "desc"),
            );
            const snapshot = await getDocs(querySnapshot);

            // 데이터를 가공하고
            const loadedComments = snapshot.docs.map(item => {
                const data = item.data();
                return {
                    id: item.id,
                    content: data.content,
                    createdAt: data.createdAt,
                    userId: data.userId,
                    username: data.username,
                };
            });

            // 데이터를 state에 저장
            setComments(loadedComments);
        } catch (e) {
            console.log(e);
        }
    }, [postId]);

    // 3-1. 댓글의 목록 중, 본인이 작성한 댓글에는 삭제 버튼 출력해주기
    // 3-2. 삭제 버튼 누르면 삭제하기

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const onDelete = async (id: string) => {
        // confirm이 false이면, !를 붙여서 true로 변경한 뒤 return
        if (!confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            // posts라고 하는 collection 안에 comments라는 sub collection 중 id를 갖는 것을 삭제 요청
            await deleteDoc(doc(db, "posts", postId, "comments", id));

            // 목록 갱신
            await fetchComments();
        } catch (e) {
            alert("삭제에 실패하였습니다." + e);
        }
    };

    return (
        <Section>
            <CommentCount>댓글 {comments.length}개</CommentCount>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <InputWrapper>
                    <Textarea
                        placeholder={"댓글을 입력해주세요"}
                        disabled={!currentUser || isSubmitting}
                        {...register("content", {
                            required: "댓글 내용을 입력해주세요.",
                            minLength: { value: 2, message: "최소 2글자 이상 입력해주세요." },
                        })}
                    />
                    <ActionButton disabled={!currentUser || isSubmitting}>
                        {isSubmitting ? "등록 중..." : "등록"}
                    </ActionButton>
                </InputWrapper>
                {errors.content && <ErrorMessage>{errors.content.message}</ErrorMessage>}
            </Form>

            <CommentList>
                {comments.map((item, index) => (
                    <CommentItem key={index}>
                        <Meta>
                            <div>
                                <strong>{item.username.split("@")[0]}</strong>
                                <span>{item.createdAt.toDate().toLocaleDateString()}</span>
                            </div>
                            {currentUser && item.userId === currentUser.uid && (
                                <DeleteButton onClick={() => onDelete(item.id)}>삭제</DeleteButton>
                            )}
                        </Meta>
                        <div>{item.content}</div>
                    </CommentItem>
                ))}
            </CommentList>
        </Section>
    );
}

export default CommentContainer;
