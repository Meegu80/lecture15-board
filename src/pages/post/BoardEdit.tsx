// firebase auth에서 User 타입만 가져옴 (실제 코드에는 포함되지 않음, 타입 전용)
import type { User } from "firebase/auth";

// react-router에서 페이지 이동(navigate)과 URL 파라미터(id) 사용
import { useNavigate, useParams } from "react-router";

// 공통으로 정의해둔 styled-components들
import { Container, Form, Input, Title } from "../../styles/auth.tsx";
import { ActionButton, Textarea } from "../../styles/styles.tsx";

// react-hook-form 사용
import { useForm } from "react-hook-form";

// firestore 문서 조회 / 수정 관련 함수
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.ts";

// 리액트 기본 훅
import { useEffect, useState } from "react";

// 게시글 타입
import type { PostType } from "../../types/post.ts";

// styled-components
import styled from "styled-components";

/**
 * 부모 컴포넌트로부터 현재 로그인한 사용자 정보 전달받음
 */
type Props = {
    currentUser: User | null;
};

/**
 * 게시글 수정 폼에서 사용할 데이터 타입
 * react-hook-form의 제네릭으로 사용됨
 */
export type PostFormData = {
    title: string;
    content: string;
};

/**
 * 하단 버튼들을 오른쪽에 정렬하기 위한 wrapper
 */
const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

function BoardEdit({ currentUser }: Props) {
    /**
     * URL 파라미터에서 게시글 id 추출
     * 예: /post/edit/123 → id = "123"
     */
    const { id } = useParams();

    /**
     * 페이지 이동을 위한 navigate 함수
     */
    const navigate = useNavigate();

    /**
     * 불러온 게시글 데이터 상태
     */
    const [post, setPost] = useState<PostType | null>(null);

    /**
     * 게시글 로딩 상태
     */
    const [loading, setLoading] = useState(true);

    /**
     * react-hook-form 설정
     */
    const {
        register, // input과 form을 연결
        handleSubmit, // submit 이벤트 핸들링
        formState: { errors }, // 유효성 에러 모음
        setValue, // 폼 값을 강제로 세팅 (초기 데이터 채울 때 사용)
        setError, // 임의의 에러 설정 (권한 에러 등)
    } = useForm<PostFormData>();

    /**
     * Firestore에서 게시글을 가져오는 함수
     */
    const fetchPost = async () => {
        // id가 없으면 실행 중단
        if (!id) return;

        try {
            // posts 컬렉션의 해당 문서 참조
            const postRef = doc(db, "posts", id);

            // 문서 조회
            const snapshot = await getDoc(postRef);

            // 문서가 존재하는 경우
            if (snapshot.exists()) {
                const postData = snapshot.data();

                /**
                 * Firestore 문서 데이터를
                 * 프론트에서 쓰기 좋은 형태로 가공
                 */
                const fetchedPost = {
                    id: snapshot.id,
                    title: postData.title,
                    content: postData.content,
                    userId: postData.userId,
                    username: postData.username,
                    views: postData.views,
                    createdAt: postData.createdAt,
                };

                // 상태에 게시글 저장
                setPost(fetchedPost);

                // react-hook-form에 초기값 세팅
                setValue("title", fetchedPost.title);
                setValue("content", fetchedPost.content);
            } else {
                // 문서가 없는 경우
                alert("게시글을 찾을 수 없습니다.");
                navigate("/");
            }
        } catch (e) {
            console.error(e);
            alert("게시글을 불러오는데 실패했습니다.");
            navigate("/");
        } finally {
            // 성공 / 실패 상관없이 로딩 종료
            setLoading(false);
        }
    };

    /**
     * 폼 제출 시 실행되는 함수
     */
    const onSubmit = async (data: PostFormData) => {
        // 필수 조건 체크
        if (!id || !currentUser || !post) return;

        /**
         * 현재 로그인한 유저와
         * 게시글 작성자가 다르면 수정 불가
         */
        if (currentUser.uid !== post.userId) {
            setError("root", { message: "수정 권한이 없습니다." });
            return;
        }

        try {
            // 수정할 게시글 문서 참조
            const postRef = doc(db, "posts", id);

            // Firestore 문서 업데이트
            await updateDoc(postRef, {
                title: data.title,
                content: data.content,
            });

            alert("게시글이 수정되었습니다.");

            // 수정 완료 후 상세 페이지로 이동
            navigate(`/post/${id}`);
        } catch (e) {
            console.error(e);
            setError("root", { message: "수정에 실패했습니다." });
        }
    };

    /**
     * 취소 버튼 클릭 시
     * 게시글 상세 페이지로 이동
     */
    const onCancel = () => {
        navigate(`/post/${id}`);
    };

    /**
     * 컴포넌트 최초 마운트 시
     * 게시글 데이터 불러오기
     */
    useEffect(() => {
        fetchPost();
    }, []);

    /**
     * 개발 중 상태 확인용 로그
     */
    console.log("currentUser:", currentUser);
    console.log("post:", post);
    console.log("loading:", loading);

    /**
     * 게시글 로딩 중일 때
     */
    if (loading) return <div>Loading...</div>;

    /**
     * 게시글을 불러오지 못했을 때
     */
    if (!post) {
        return (
            <Container>
                <Title>게시글을 불러올 수 없습니다.</Title>
            </Container>
        );
    }

    /**
     * 로그인하지 않은 사용자
     */
    if (!currentUser) {
        return (
            <Container>
                <Title>로그인이 필요합니다.</Title>
                <ActionButton onClick={() => navigate("/login")}>
                    로그인하러 가기
                </ActionButton>
            </Container>
        );
    }

    /**
     * 작성자가 아닌 경우
     */
    if (currentUser.uid !== post.userId) {
        return (
            <Container>
                <Title>수정 권한이 없습니다.</Title>
                <p>작성자: {post.username?.split("@")[0]}</p>
                <p>현재 사용자: {currentUser.email?.split("@")[0]}</p>
                <ActionButton onClick={() => navigate("/")}>
                    목록으로 돌아가기
                </ActionButton>
            </Container>
        );
    }

    /**
     * 정상적으로 수정 권한이 있을 때
     * 게시글 수정 폼 렌더링
     */
    return (
        <Container>
            <Title>게시글 수정</Title>

            {/* react-hook-form과 연결된 form */}
            <Form onSubmit={handleSubmit(onSubmit)}>
                {/* 제목 입력 */}
                <Input
                    {...register("title", {
                        required: "제목은 필수 입력입니다.",
                    })}
                    placeholder="제목을 입력해주세요."
                />
                {errors.title && <p>{errors.title.message}</p>}

                {/* 내용 입력 */}
                <Textarea
                    {...register("content", {
                        required: "내용은 필수 입력입니다.",
                    })}
                    placeholder="내용을 입력해주세요."
                />
                {errors.content && <p>{errors.content.message}</p>}

                {/* 버튼 영역 */}
                <ButtonGroup>
                    <ActionButton
                        type="button"
                        onClick={onCancel}
                        style={{ backgroundColor: "#6c757d" }}
                    >
                        취소
                    </ActionButton>

                    {/* submit 버튼 */}
                    <ActionButton>수정</ActionButton>
                </ButtonGroup>

                {/* 권한 / 서버 에러 */}
                {errors.root && <p>{errors.root.message}</p>}
            </Form>
        </Container>
    );
}

export default BoardEdit;
