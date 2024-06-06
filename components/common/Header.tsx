import { Logo } from '@/components/base/base';
import Search from '@/components/common/Search';
import Link from 'next/link';
import { useState } from 'react';
import { IoMenuOutline } from "react-icons/io5";

export default function Header(props) {
    const [view, setView] = useState(false);
    return <nav className="fixed bg-trade-700 border-b-1 z-50 w-full top-0 left-0 py-3 px-3 shadow-lg h-header">
        <div className="flex justify-between items-center">
            <div className='flex gap-3 items-center'>
                <Link href="/">
                    <Logo />
                </Link>
                <Link href="/help" className='hover:brightness-110'>도움말</Link>
                {/* <div className={styles.button}><Link href="/board">의견게시판</Link></div> */}
            </div>
            <IoMenuOutline
                className='w-5 h-5 cursor-pointer lg:hidden'
                onClick={() => {
                    props?.setAsideShow();
                }} />
            <Search {...{ ...props, view, setView }} />
        </div>
    </nav >
}