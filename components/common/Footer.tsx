import { Inner } from '@/components';
import Link from 'next/link';
import { FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className='py-20 border-t-1 bg-trade-700 shadow-lg'>
            <Inner className="max-w-header">
                <div>Service by <Link href='https://lint.im' target='_blank' className='text-indigo-400'>LINT</Link></div>
                <div className='pt-5 flex justify-between'>
                    <div className='flex gap-2'>
                        <Link href='/term'>이용약관</Link>
                        <span>|</span>
                        <Link href='/privacy'>개인정보처리방침</Link>
                    </div>
                    <div>
                        <Link href="https://github.com/oculi-s" target='_blank' className='text-gray-200'>
                            <FaGithub className='w-6 h-6' />
                        </Link>
                    </div>
                </div>
            </Inner>
        </footer>
    )
}