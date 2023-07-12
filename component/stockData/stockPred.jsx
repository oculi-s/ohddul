import { QueueTable } from '#/baseStock/PredTable';

function PredElement(props) {
    const stockPred = props?.stockPred;
    return <>
        <h3>예측모음</h3>
        <QueueTable
            queue={stockPred?.queue}
            meta={props?.meta}
            by='user'
            ids={props?.ids}
        />
    </>;
}

export default PredElement;