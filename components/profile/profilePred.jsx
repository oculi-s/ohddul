import { QueueTable } from "@/components/baseStock/PredTable";


function ProfilePred({ meta, userPred }) {
    const queue = userPred?.queue;
    return <>
        <h3>대기중인 예측</h3>
        <QueueTable {...{ queue, meta }} />
    </>
}

export default ProfilePred;