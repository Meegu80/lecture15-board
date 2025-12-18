import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Container, Title } from "../styles/auth.tsx";
import { Link } from "react-router";
import { ActionButton } from "../styles/styles.tsx";
import styled from "styled-components";
import { db } from "../firebase.ts";
import type { PostType } from "../types/post.ts";

const Table = styled.table`
    width: 100%;
    // border-collapse : 테이블의 테두리를 어떻게 표현할 것인지를 결정하는 CSS
    // 원래 table의 웹브라우저 기본 디자인은 셀의 테두리와 표의 테두리 두 개를 표현함
    // collapse를 쓰게 되면, 셀의 테두리 하나만 남음
    border-collapse: collapse;
`;

const Th = styled.th<{ width?: string }>`
    background-color: #f2f2f2;
    padding: 10px;
    border-bottom: 2px solid #ddd;
    width: ${props => props.width || "auto"};
`;

const Td = styled.td<{ center?: boolean }>`
    padding: 10px;
    border-bottom: 1px solid #eee;
    text-align: ${props => (props.center ? "center" : "left")};
`;

function BoardList() {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<PostType[]>([]);

    const fetchPosts = async () => {
        setLoading(true);

        try {
            // 1. query 문을 작성
            // firestore에서 데이터를 검색해오는 명령(query)를 작성
            // query(콜렉션정보, 검색조건)
            const querySnapshot = query(
                collection(db, "posts"),
                orderBy("createdAt", "desc")
            );

            // 2. 데이터를 요청하고
            const snapshot = await getDocs(querySnapshot);

            // 3. 데이터 받아온 것을 가공하고
            // 실질적으로 도착한 데이터 중 우리가 필요한 내용은 snapshot.docs에 있음 (docs는 Array)
            // Array 내부 요소는 객체로 존재 item = {
            //                                     data: data(), -> 이게 우리가 작성한 데이터
            //                                     id: id, -> 이 요소의 고유한 id
            //                                   }

            const results = snapshot.docs.map(item => {
                const data = item.data();
                return {
                    id: item.id,
                    title: data.title,
                    content: data.content,
                    createdAt: data.createdAt,
                    userId: data.userid,
                    username: data.username,
                    views: data.views,
                };
            });

            // 4. 가공한 데이터를 setPosts에 저장하고
            setPosts(results);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <Title>자유게시판</Title>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
                <Link to={"/post/write"}>
                    <ActionButton>글쓰기</ActionButton>
                </Link>
            </div>

            <Table>
                <thead>
                    <tr>
                        <Th width={"10%"}>#</Th>
                        <Th width={"55%"}>제목</Th>
                        <Th width={"15%"}>작성일</Th>
                        <Th width={"10%"}>작성자</Th>
                        <Th width={"10%"}>조회수</Th>
                    </tr>
                </thead>
                <tbody>
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <tr key={index}>
                                <Td center={true}>{posts.length - index}</Td>
                                <Td>
                                    <Link to={`/post/${post.id}`}>{post.title}</Link>
                                </Td>
                                <Td center={true}>
                                    {post.createdAt.toDate().toLocaleDateString()}
                                </Td>
                                <Td center={true}>{post.username?.split("@")[0]}</Td>
                                <Td center={true}>{post.views}</Td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} style={{ textAlign: "center" }}>
                                게시글이 없습니다! 첫 글을 작성해보세요!
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
}

export default BoardList;
