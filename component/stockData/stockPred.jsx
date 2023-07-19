import { QueueTable } from '#/baseStock/PredTable';

function PredElement({ meta, ids, pred }) {
    return <>
        <h3>예측모음</h3>
        <QueueTable
            queue={pred?.queue}
            meta={meta}
            by='user'
            ids={ids}
        />
    </>;
}

export default PredElement;