import { board as dir } from "@/module/dir"
import json from "@/module/json"

export async function getServerSideProps(ctx) {
    const board = json.read(dir.ideas);
    const props = {}
    return { props }
}

export default function Index() {
    return <>
        <h2>의견게시판</h2>

        <table>
            <thead align='center'><tr><th>번호</th><th>제목</th><th>작성자</th><th>등록일</th><th>조회수</th></tr></thead>
        </table>
    </>
}