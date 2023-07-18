import { QueueTable } from '#/baseStock/PredTable';

function PredElement(props) {
    const pred = props?.pred;
    return <>
        <h3>예측모음</h3>
        <QueueTable
            queue={pred?.queue}
            meta={props?.meta}
            by='user'
            ids={props?.ids}
        />
    </>;
}

export default PredElement;