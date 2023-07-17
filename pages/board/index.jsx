import dir from "@/module/dir"
import json from "@/module/json"
import styles from '$/Board/Index.module.scss';
import Link from "next/link";

export async function getServerSideProps(ctx) {
    const ids = json.read(dir.user.ids);
    const board = json.read(dir.board.ideas);
    const p = parseInt(ctx?.query?.p || 1);
    const N = parseInt(ctx?.query?.N || 15);
    const T = Object.keys(board)?.length || 0;

    const props = { p, N, T, board }
    return { props }
}

export default function Index({ session, board }) {
    return <>
        <h2>의견게시판</h2>

        <table className={styles.table}>
            <colgroup>
                <col width={30} />
                <col />
                <col width={80} />
                <col width={80} />
                <col width={30} />
            </colgroup>
            <thead align='center'><tr><th>번호</th><th>제목</th><th>작성자</th><th>등록일</th><th>조회수</th></tr></thead>
            <tbody>

            </tbody>
        </table>
        <Link href={'/editor'}>글쓰기</Link>
    </>
}