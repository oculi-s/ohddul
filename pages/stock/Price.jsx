import PriceChart from "@/component/chart/PriceLine";

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
        price: stockPrice,
        meta: stockMeta
    }
    return <>
        <PriceChart {...chartProps} />
        <PriceTable {...props} />
    </>
}

export default PriceElement;