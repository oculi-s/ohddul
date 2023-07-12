import { board as dir } from "@/module/dir"
import json from "@/module/json"
import styles from '$/Board/Index.module.scss';
import Link from "next/link";

export async function getServerSideProps(ctx) {
    const board = json.read(dir.ideas);
    const props = { board }
    return { props }
}

export default function Index({ session }) {
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