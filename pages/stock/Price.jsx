import PriceChart from "@/component/chart/Price";

const PriceTable = ({ last }) => {
    const tbody = <>
        <tr><th>%B</th></tr>
    </>
    return <table>
        <tbody>{tbody}</tbody>
    </table>
}


const PriceElement = (props) => {
    const { stockPrice, stockMeta } = props;
    const chartProps = {
        prices: [stockPrice],
        metas: [{ amount: stockMeta?.amount }]
    }
    return <>
        <PriceChart {...chartProps} />
        <PriceTable {...props} />
    </>
}

export default PriceElement;