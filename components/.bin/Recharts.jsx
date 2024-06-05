import React from 'react';
import { Treemap, Tooltip } from 'recharts';

const TreeMapChart = () => {
    const data = {
        name: 'Root',
        children: [
            {
                name: 'Node 1',
                size: 10,
            },
            {
                name: 'Node 2',
                size: 20,
            },
            {
                name: 'Node 3',
                size: 15,
            },
            // 추가적인 노드들...
        ],
    };

    return (
        <Treemap
            width={500}
            height={500}
            data={data}
            dataKey="size"
            ratio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
        >
            <Tooltip />
        </Treemap>
    );
};

export default TreeMapChart;
