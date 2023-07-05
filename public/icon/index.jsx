import FullScreen from './fullScreen.svg';

const Icons = {
    FullScreen
}

export default function Icon({ name }) {
    return Icons[name]()
}