import type { User } from "firebase/auth";
import styled from "styled-components";
import { ActionButton } from "../styles/styles.tsx";
import { useForm } from "react-hook-form";
import {addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, Timestamp} from "firebase/firestore";
import {db} from "../firebase.ts";
import {useNavigate} from "react-router";
import { useCallback, useEffect, useState } from "react";

// Props 타입 정의: 게시글 ID와 현재 로그인한 사용자 정보
type Props = {
    postId: string;
    currentUser: User | null;
};

// 댓글 작성 폼 데이터 타입
type CommentFormData = {
    content: string;  // 댓글 내용
};

// 댓글 데이터 타입
type CommentType = {
    id: string,          // 문서 ID
    content: string,     // 댓글 내용
    createdAt: Timestamp, // 작성 시간
    userId: string,      // 작성자 ID
    username: string,    // 작성자 이름(이메일)
}

function CommentContainer({ postId, currentUser}: Props) {
    const navigate = useNavigate();
    const [comments, setComments] = useState<CommentType[]>([]);  // 댓글 목록 상태

    // react-hook-form 초기화
    const {
        register,      // input 등록 함수
        handleSubmit,  // 폼 제출 핸들러
        formState: { errors, isSubmitting },  // 에러와 제출 상태
        reset,         // 폼 초기화 함수
    } = useForm<CommentFormData>();

    // 댓글 작성 핸들러
    const onSubmit = async (data: CommentFormData) => {
        if (!currentUser) return;  // 로그인 체크

        // 서브 컬렉션: posts/{postId}/comments 경로에 저장
        try {
            const newComment = {
                content: data.content,          // 댓글 내용
                userId: currentUser.uid,        // 작성자 ID
                username: currentUser.email,    // 작성자 이메일
                createdAt: Timestamp.now()      // 현재 시간
            }

            // Firebase에 댓글 추가 (서브 컬렉션 사용)
            await addDoc(
                collection(db,"posts", postId, "comments"),  // 경로: posts > postId > comments
                newComment,
            )
            reset();   // 입력 필드 초기화

            await fetchComments();  // 댓글 목록 새로고침
        } catch (e) {
            alert("댓글을 작성하지 못 했습니다.");
            console.log(e);
        }
    }

    // 댓글 목록 불러오기 (useCallback으로 메모이제이션)
    const fetchComments = useCallback(
        async () => {
            try {
                // 쿼리 생성: 최신순 정렬
                const querySnapshot = query(
                    collection(db, "posts", postId, "comments"),
                    orderBy("createdAt", "desc")  // 최신 댓글이 위로
                );
                const snapshot = await getDocs(querySnapshot);

                // Firestore 문서를 CommentType 배열로 변환
                const loadedComments = snapshot.docs.map(
                    (item) => {
                        const data = item.data();
                        return {
                            id: item.id,              // 문서 ID
                            content: data.content,
                            createdAt: data.createdAt,
                            userId: data.userId,
                            username: data.username,
                        }
                    }
                )

                // state에 저장
                setComments(loadedComments);
            } catch (e) {
                console.log(e);
            }
        },
        [postId]  // postId가 바뀔 때만 함수 재생성
    )

    // 컴포넌트 마운트 시 댓글 불러오기
    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const onDelete = async (id: string) => {
        //  아니오 하면 return
        if(!confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            // posts라고 하는 컬렉션 안에 코멘트라는 sub collection 중 id를 갖는 것을 삭제 요청
            await deleteDoc(doc(db, "posts", postId, "comments", id));

            await fetchComments();

        } catch (e) {
            alert("삭제에 실패하였습니다. " + e);
        }
    }

    return (
        <Section>
            {/* 댓글 개수 표시 */}
            <CommentCount>{comments.length} 개</CommentCount>

            {/* 댓글 작성 폼 */}
            <Form onSubmit={handleSubmit(onSubmit)}>
                <InputWrapper>
                    <Textarea
                        placeholder={"댓글을 입력해주세요"}
                        disabled={!currentUser || isSubmitting}  // 비로그인 또는 제출중 비활성화
                        {...register("content", {
                            required: "댓글 내용을 입력해주세요.",  // 필수 입력
                            minLength: { value: 2, message: "최소 2글자 이상 입력해주세요." },  // 최소 길이
                        })}
                    />
                    <ActionButton disabled={!currentUser || isSubmitting}>
                        {isSubmitting ? "등록 중..." : "등록"}
                    </ActionButton>
                </InputWrapper>
                {/* 유효성 검사 에러 메시지 */}
                {errors.content && <ErrorMessage>{errors.content.message}</ErrorMessage>}
            </Form>

            {/* 댓글 목록 */}
            <CommentList>
                {comments.map((item, index) => (
                    <CommentItem key={index}>
                        <Meta>
                            <div>
                                {/* 이메일에서 @ 앞부분만 표시 */}
                                <strong>{item.username.split("@")[0]}</strong>
                                {/* 날짜 포맷팅 */}
                                <span>{item.createdAt.toDate().toLocaleDateString()}</span>
                            </div>
                            {/* 삭제 버튼 (TODO: 본인 댓글에만 표시하도록 수정 필요) */}
                            <DeleteButton onClick={() => onDelete(item.id)}>삭제</DeleteButton>
                        </Meta>
                        {/* 댓글 내용 */}
                        <div>{item.content}</div>
                    </CommentItem>
                ))}
            </CommentList>
        </Section>
    );
}

export default CommentContainer;



// 스타일 컴포넌트들
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
//
//
// ### 5️⃣ **전체 흐름 다이어그램**
// ```
// [사용자 입력]
//     ↓
// data.content (폼 데이터)
//     ↓
// newComment 객체 생성 {
//     content: data.content
//     userId: currentUser.uid      ← Firebase Auth에서 가져옴
//     username: currentUser.email  ← Firebase Auth에서 가져옴
//     createdAt: Timestamp.now()
// }
//     ↓
// addDoc(collection(db, "posts", postId, "comments"), newComment)
//     ↓
// [Firebase Firestore]
// posts/{postId}/comments/{자동생성ID} 문서로 저장
//     ↓
// fetchComments()로 다시 불러오기
//     ↓
// snapshot.docs.map()으로 변환
//     ↓
// setComments(loadedComments)
//     ↓
// [화면에 렌더링]