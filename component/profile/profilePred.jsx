import { QueueTable } from "#/baseStock/PredTable"


function ProfilePred(props) {
    return <>

        <h3>대기중인 예측</h3>
        <QueueTable {...props} />
    </>
}

export default ProfilePred;