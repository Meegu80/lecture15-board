import type { User } from "firebase/auth";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { PostType } from "../../types/post.ts";
import { Container, Title } from "../../styles/auth.tsx";
import styled from "styled-components";
import { ActionButton } from "../../styles/styles.tsx";
import { deleteDoc, doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.ts";
import CommentContainer from "../../components/CommentContainer.tsx";

type Props = {
    currentUser: User | null;
};

const PostMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 14px;
    color: #666;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
`;

const PostContent = styled.div`
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 4px;
    margin-top: 20px;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
`;

function BoardDetail({ currentUser }: Props) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState<PostType | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchPost = async () => {
        if (!id) return;

        try {
            // 1개의 데이터만 요청하면 됨 > 쿼리 작성 필요 없음
            const postRef = doc(db, "posts", id);
            const snapshot = await getDoc(postRef);

            if (snapshot.exists()) {
                const postData = snapshot.data();

                setPost({
                    id: snapshot.id,
                    title: postData.title,
                    content: postData.content,
                    userId: postData.userId,
                    username: postData.username,
                    views: postData.views,
                    createdAt: postData.createdAt,
                });

                // 2. 조회수 증가 처리
                await updateDoc(postRef, { views: increment(1) });
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

    const onDelete = async () => {
        // 사용자에게 confirm을 통해 확인을 받고, 확인을 눌르면 삭제하고 사용자 이동
        // const ok = confirm("정말로 이 게시글을 삭제하시겠습니까?")
        //
        // if (ok) {
        //
        // }
        if (!id) return;

        if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            try {
                // 삭제할 대상을 지정하고
                const postRef = doc(db, "posts", id);
                // 삭제 요청
                await deleteDoc(postRef);
                alert("게시글이 삭제되었습니다.");
                navigate("/");
            } catch (e) {
                alert("삭제에 실패했습니다." + e);
            }
        }
    };

    useEffect(() => {
        fetchPost();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!post)
        return (
            <Container>
                <Title>게시글을 불러올 수 없습니다.</Title>
            </Container>
        );

    const isWriter = currentUser && currentUser.uid === post.userId;

    return (
        <Container>
            <Title>{post.title}</Title>
            <PostMeta>
                <span>작성자: {post.username?.split("@")[0]}</span>
                <span>작성일: {post.createdAt.toDate().toLocaleDateString()}</span>
                <span>조회수: {post.views}</span>
            </PostMeta>

            <PostContent>{post.content}</PostContent>

            <ButtonGroup>
                <Link to={"/"}>
                    <ActionButton outlined={true}>목록</ActionButton>
                </Link>

                {isWriter && (
                    <>
                        <Link to={`/post/edit/${post.id}`}>
                            <ActionButton>수정</ActionButton>
                        </Link>

                        <ActionButton style={{ backgroundColor: "#dc3545" }} onClick={onDelete}>
                            삭제
                        </ActionButton>
                    </>
                )}
            </ButtonGroup>

            {/* 코멘트 컨테이너에게 2가지 전달이 필요함 */}
            {/* 1. 이 글과 관련되어져 있는 코멘트를 불러와야 하므로, 글번호(id) 전달 */}
            {/* 2. 코멘트를 작성하는 사람, 코멘트를 삭제하는 사람의 정보가 필요하므로 currentUser 전달 */}
            {id && <CommentContainer postId={id} currentUser={currentUser} />}
        </Container>
    );
}

export default BoardDetail;
