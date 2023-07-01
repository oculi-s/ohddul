import dynamic from 'next/dynamic';
const Plot = dynamic(() => { return import("react-plotly.js") }, { ssr: false })
export default Plot;