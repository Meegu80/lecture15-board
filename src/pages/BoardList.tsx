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

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
`;

const PageButton = styled.button<{
    $active?: boolean;
}>`
    min-width: 32px;
    height: 32px;
    padding: 0 6px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;

    background-color: ${props => (props.$active ? "#007bff" : "#ffffff")};
    color: ${props => (props.$active ? "#ffffff" : "#333333")};
    font-weight: ${props => (props.$active ? "bold" : "normal")};

    &:disabled {
        background-color: #eee;
        color: #ccc;
        cursor: not-allowed;
    }
    
`;

const POSTS_PER_PAGE = 5;

function BoardList() {
    const [loading, setLoading] = useState(true);

    // 화면에 출력이 될 글들을 담는 Array state
    const [currentPosts, setCurrentPosts] = useState<PostType[]>([]);
    // 모든 데이터의 글들을 담는 Array state
    const [allPosts, setAllPosts] = useState<PostType[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchPosts = async () => {
        setLoading(true);

        try {
            // 1. query 문을 작성
            // firestore에서 데이터를 검색해오는 명령(query)를 작성
            // query(콜렉션정보, 검색조건)
            const querySnapshot = query(collection(db, "posts"), orderBy("createdAt", "desc"));

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
            setAllPosts(results);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(allPosts.length / POSTS_PER_PAGE));
    }, [allPosts]);

    useEffect(() => {
        // 1. 첫 시작 때 : fetchPosts가 동작이 되면서 allPosts의 값이 바뀌므로 그 때 동작해야 함
        // 2. 사용자가 페이지 변경을 위해 currentPage 값을 바꿨을 때에 동작해야 함

        if (allPosts.length === 0) {
            setCurrentPosts([]);
            return;
        }

        // 페이지가 1번 : 0 ~ 4
        // 페이지 2번 : 5 ~ 8
        // 페이지 3번 : 9 ~ 14
        // .............
        // 코드로서 구현
        // allPosts.slice(0, 5); => [0, 1, 2, 3, 4]
        // allPosts.slice(5, 10); => [5, 6, 7, 8, 9]
        // Array를 자르는 명령은 slice(시작인덱스번호, 마지막인덱스 뒷번호)
        const indexOfLastPost = currentPage * POSTS_PER_PAGE;
        const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;

        const slicedPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);
        setCurrentPosts(slicedPosts);
    }, [allPosts, currentPage]);

    const onPageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

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
                    {currentPosts.length > 0 ? (
                        currentPosts.map((post, index) => (
                            <tr key={index}>
                                {/* 1페이지에서 첫번째 글이라면, 11번 */}
                                {/* 2페이지에서 첫 번째 글이라면, 1페이지는 5개, 그 다음 6번 */}
                                {/* 3페이지에서 첫 번째 글이라면, 1페이지는 5개니까, 총 10개가 빠지니까, 그 다음은 1번 */}
                                <Td center={true}>
                                    {allPosts.length - (currentPage - 1) * POSTS_PER_PAGE - index}
                                </Td>
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

            <PaginationContainer>
                {/* 이전 버튼 */}
                <PageButton
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}>
                    &lt;
                </PageButton>

                {/* 페이지 번호를 출력해주는 버튼들 */}
                {/* 1, 2, 3 */}
                {/* array 에 대한 map을 통해 동일한 컴포넌트를 갯수만큼 뽑아주는 기능을 이용 */}
                {/* 근데 array가 마련이 안되었음.
                     => 원하는 요소 갯수만큼 빈 Array를 만드는 명령 : Array.from({ length: 숫자 }) */}
                {Array.from({ length: totalPages }).map((_, index) => (
                    <PageButton
                        key={index}
                        onClick={() => onPageChange(index + 1)}
                        $active={index + 1 === currentPage}>
                        {index + 1}
                    </PageButton>
                ))}

                {/* 다음 버튼 */}
                <PageButton
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}>
                    &gt;
                </PageButton>
            </PaginationContainer>
        </Container>
    );
}

export default BoardList;
