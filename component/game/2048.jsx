const { useEffect } = require("react")

const Map = () => {

}

const Game2048 = () => {
    useEffect(() => {
        document.addEventListener('keydown', e => {
            if (e.key == 'ArrowLeft') {
            }
        })
    })

    const data = Array(4).map(e => {
        return (<tr>
            {Array(4).map(c => {
                return <th>asdf</th>
            })}
        </tr>)
    })

    return (
        <table>
            <tbody>
                {data}
            </tbody>
        </table>
    )
}

export default Game2048;