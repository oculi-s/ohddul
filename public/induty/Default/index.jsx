import 의약품 from './의약품.svg';
import 동물약 from './동물약.svg';
import 한약 from './한약.svg';
import 빵 from './빵.svg'
import 식료품 from './식료품.svg';
import 육류_가공 from './육류 가공.svg'
import 수산물_가공 from './수산물 가공.svg'
import 곡물_가공 from './곡물 가공.svg'
import 과일 from './과일.svg';
import 유제품 from './유제품.svg';
import 커피 from './커피.svg';
import 조미료 from './조미료.svg';
import 과자 from './과자.svg';

const indutyImg = {
    의약품, 동물약, 한약,
    식료품, 빵, 육류_가공, 수산물_가공, 곡물_가공, 과일, 유제품, 커피, 조미료, 과자
}

export default function IndutyImg({ name }) {
    name = name?.replace(/\s+/g, '_');
    if (!indutyImg[name]) return;
    return <span>{indutyImg[name]({ width: '100%' })}</span>
};
