// import { CircularProgress } from '@mui/material';
import styles from '@/styles/Base/Index.module.scss';
// import Game2048 from '#/game/2048.jsx';

const Temp = ({ children }) => {
    return (
        <div className={styles.wrap}>
            {children}
        </div>
    );
}

export const Loading = (props) => {
    const Wrap = props?.Wrap || Temp;
    return <Wrap>
        {/* <CircularProgress /> */}
    </Wrap>
}

/**
 * 업데이트 진행시 데이터 접근을 막는 함수
 * 
 * 업데이트 서버를 분리하면서 폐기 2023.06.24
 */
// export const Updating = (props) => {
//     const ref = useRef();
//     const Wrap = props?.wrap || Temp;
//     const [dots, setDots] = useState(0);
//     clearInterval(ref?.current);
//     ref.current = setInterval(() => { setDots(t => (t + 1) % 3) }, 300);

//     return <Wrap>
//         <p>데이터 업데이트 중입니다{'.'.repeat(1 + dots)}</p>
//         <h2>미니게임 즐기기</h2>
//         <Game2048 />
//     </Wrap>
// }

export const innerText = element => {
    if (typeof element === 'string') {
        return element;
    }
    if (Array.isArray(element)) {
        return element.map(innerText).join('');
    }
    if (element?.props?.children) {
        return innerText(element?.props?.children);
    }
    return '';
}