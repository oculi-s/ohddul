import FullScreen from './fullScreen.svg';
import Tistory from './tistory.svg';
import Github from './github.svg';

const Icons = {
    FullScreen,
    Tistory,
    Github,
}

export default function Icon({ name }) {
    if (!Icons[name]) return;
    return <div>{Icons[name]({ width: '100%' })}</div>
}