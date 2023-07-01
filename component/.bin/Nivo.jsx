// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/treemap
// import { ResponsiveTreeMapHtml } from '@nivo/treemap'
import { ResponsivePie } from '@nivo/pie';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
// export default function MyResponsiveTreeMapHtml({  /* see data tab */ }) {
//     return (
//         <ResponsiveTreeMapHtml
//             data={data()}
//             identity="name"
//             value="loc"
//             valueFormat=".02s"
//             margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
//             labelSkipSize={12}
//             labelTextColor={{
//                 from: 'color',
//                 modifiers: [
//                     [
//                         'darker',
//                         2
//                     ]
//                 ]
//             }}
//             parentLabelTextColor={{
//                 from: 'color',
//                 modifiers: [
//                     [
//                         'darker',
//                         3
//                     ]
//                 ]
//             }}
//             colors={{ scheme: 'yellow_orange_red' }}
//             borderColor={{
//                 from: 'color',
//                 modifiers: [
//                     [
//                         'darker',
//                         0.1
//                     ]
//                 ]
//             }} />
//     )
// }

export default function Pie() {
    return (
        <ResponsivePie
            data={pieData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }} />
    );
}

const data = () => {
    const data = [
        {
            id: "java",
            label: "java",
            value: 195,
            color: "hsl(90, 70%, 50%)"
        },
        {
            id: "erlang",
            label: "erlang",
            value: 419,
            color: "hsl(56, 70%, 50%)"
        },
        {
            id: "ruby",
            label: "ruby",
            value: 407,
            color: "hsl(103, 70%, 50%)"
        },
        {
            id: "haskell",
            label: "haskell",
            value: 474,
            color: "hsl(186, 70%, 50%)"
        },
        {
            id: "go",
            label: "go",
            value: 71,
            color: "hsl(104, 70%, 50%)"
        }
    ];
}

// const data = () => {
//     return {
//         "name": "nivo",
//         "color": "hsl(43, 70%, 50%)",
//         "children": [
//             {
//                 "name": "viz",
//                 "color": "hsl(18, 70%, 50%)",
//                 "children": [
//                     {
//                         "name": "stack",
//                         "color": "hsl(57, 70%, 50%)",
//                         "children": [
//                             {
//                                 "name": "cchart",
//                                 "color": "hsl(158, 70%, 50%)",
//                                 "loc": 148651
//                             },
//                             {
//                                 "name": "xAxis",
//                                 "color": "hsl(315, 70%, 50%)",
//                                 "loc": 141064
//                             },
//                             {
//                                 "name": "yAxis",
//                                 "color": "hsl(354, 70%, 50%)",
//                                 "loc": 104486
//                             },
//                             {
//                                 "name": "layers",
//                                 "color": "hsl(251, 70%, 50%)",
//                                 "loc": 135362
//                             }
//                         ]
//                     },
//                     {
//                         "name": "ppie",
//                         "color": "hsl(289, 70%, 50%)",
//                         "children": [
//                             {
//                                 "name": "chart",
//                                 "color": "hsl(341, 70%, 50%)",
//                                 "children": [
//                                     {
//                                         "name": "pie",
//                                         "color": "hsl(338, 70%, 50%)",
//                                         "children": [
//                                             {
//                                                 "name": "outline",
//                                                 "color": "hsl(325, 70%, 50%)",
//                                                 "loc": 196328
//                                             },
//                                             {
//                                                 "name": "slices",
//                                                 "color": "hsl(290, 70%, 50%)",
//                                                 "loc": 167843
//                                             },
//                                             {
//                                                 "name": "bbox",
//                                                 "color": "hsl(27, 70%, 50%)",
//                                                 "loc": 65421
//                                             }
//                                         ]
//                                     },
//                                     {
//                                         "name": "donut",
//                                         "color": "hsl(35, 70%, 50%)",
//                                         "loc": 162106
//                                     },
//                                     {
//                                         "name": "gauge",
//                                         "color": "hsl(71, 70%, 50%)",
//                                         "loc": 130085
//                                     }
//                                 ]
//                             },
//                             {
//                                 "name": "legends",
//                                 "color": "hsl(192, 70%, 50%)",
//                                 "loc": 58979
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "name": "colors",
//                 "color": "hsl(126, 70%, 50%)",
//                 "children": [
//                     {
//                         "name": "rgb",
//                         "color": "hsl(239, 70%, 50%)",
//                         "loc": 110555
//                     },
//                     {
//                         "name": "hsl",
//                         "color": "hsl(36, 70%, 50%)",
//                         "loc": 127539
//                     }
//                 ]
//             },
//             {
//                 "name": "utils",
//                 "color": "hsl(345, 70%, 50%)",
//                 "children": [
//                     {
//                         "name": "randomize",
//                         "color": "hsl(336, 70%, 50%)",
//                         "loc": 793
//                     },
//                     {
//                         "name": "resetClock",
//                         "color": "hsl(45, 70%, 50%)",
//                         "loc": 92082
//                     },
//                     {
//                         "name": "noop",
//                         "color": "hsl(200, 70%, 50%)",
//                         "loc": 193414
//                     },
//                     {
//                         "name": "tick",
//                         "color": "hsl(220, 70%, 50%)",
//                         "loc": 182369
//                     },
//                     {
//                         "name": "forceGC",
//                         "color": "hsl(286, 70%, 50%)",
//                         "loc": 140318
//                     },
//                     {
//                         "name": "stackTrace",
//                         "color": "hsl(61, 70%, 50%)",
//                         "loc": 146452
//                     },
//                     {
//                         "name": "dbg",
//                         "color": "hsl(280, 70%, 50%)",
//                         "loc": 49064
//                     }
//                 ]
//             },
//             {
//                 "name": "generators",
//                 "color": "hsl(14, 70%, 50%)",
//                 "children": [
//                     {
//                         "name": "address",
//                         "color": "hsl(62, 70%, 50%)",
//                         "loc": 184470
//                     },
//                     {
//                         "name": "city",
//                         "color": "hsl(90, 70%, 50%)",
//                         "loc": 175471
//                     },
//                     {
//                         "name": "animal",
//                         "color": "hsl(350, 70%, 50%)",
//                         "loc": 170424
//                     },
//                     {
//                         "name": "movie",
//                         "color": "hsl(275, 70%, 50%)",
//                         "loc": 176257
//                     },
//                     {
//                         "name": "user",
//                         "color": "hsl(202, 70%, 50%)",
//                         "loc": 17024
//                     }
//                 ]
//             },
//             {
//                 "name": "set",
//                 "color": "hsl(353, 70%, 50%)",
//                 "children": [
//                     {
//                         "name": "clone",
//                         "color": "hsl(126, 70%, 50%)",
//                         "loc": 24279
//                     },
//                     {
//                         "name": "intersect",
//                         "color": "hsl(212, 70%, 50%)",
//                         "loc": 87066
//                     },
//                     {
//                         "name": "merge",
//                         "color": "hsl(36, 70%, 50%)",
//                         "loc": 176375
//                     },
//                     {
//                         "name": "reverse",
//                         "color": "hsl(75, 70%, 50%)",
//                         "loc": 158782
//                     },
//                     {
//                         "name": "toArray",
//                         "color": "hsl(309, 70%, 50%)",
//                         "loc": 167028
//                     },
//                     {
//                         "name": "toObject",
//                         "color": "hsl(79, 70%, 50%)",
//                         "loc": 139673
//                     },
//                     {
//                         "name": "fromCSV",
//                         "color": "hsl(162, 70%, 50%)",
//                         "loc": 101661
//                     },
//                     {
//                         "name": "slice",
//                         "color": "hsl(291, 70%, 50%)",
//                         "loc": 49830
//                     },
//                     {
//                         "name": "append",
//                         "color": "hsl(338, 70%, 50%)",
//                         "loc": 144340
//                     },
//                     {
//                         "name": "prepend",
//                         "color": "hsl(56, 70%, 50%)",
//                         "loc": 191980
//                     },
//                     {
//                         "name": "shuffle",
//                         "color": "hsl(199, 70%, 50%)",
//                         "loc": 123991
//                     },
//                     {
//                         "name": "pick",
//                         "color": "hsl(291, 70%, 50%)",
//                         "loc": 143363
//                     },
//                     {
//                         "name": "plouc",
//                         "color": "hsl(133, 70%, 50%)",
//                         "loc": 13979
//                     }
//                 ]
//             },
//             {
//                 "name": "text",
//                 "color": "hsl(241, 70%, 50%)",
//                 "children": [
//                     {
//                         "name": "trim",
//                         "color": "hsl(114, 70%, 50%)",
//                         "loc": 84151
//                     },
//                     {
//                         "name": "slugify",
//                         "color": "hsl(317, 70%, 50%)",
//                         "loc": 117522
//                     },
//                     {
//                         "name": "snakeCase",
//                         "color": "hsl(230, 70%, 50%)",
//                         "loc": 8148
//                     },
//                     {
//                         "name": "camelCase",
//                         "color": "hsl(132, 70%, 50%)",
//                         "loc": 140392
//                     },
//                     {
//                         "name": "repeat",
//                         "color": "hsl(36, 70%, 50%)",
//                         "loc": 87947
//                     },
//                     {
//                         "name": "padLeft",
//                         "color": "hsl(209, 70%, 50%)",
//                         "loc": 116337
//                     },
//                     {
//                         "name": "padRight",
//                         "color": "hsl(263, 70%, 50%)",
//                         "loc": 25671
//                     },
//                     {
//                         "name": "sanitize",
//                         "color": "hsl(58, 70%, 50%)",
//                         "loc": 64638
//                     },
//                     {
//                         "name": "ploucify",
//                         "color": "hsl(79, 70%, 50%)",
//                         "loc": 186495
//                     }
//                 ]
//             },
//             {
//                 "name": "misc",
//                 "color": "hsl(191, 70%, 50%)",
//                 "children": [
//                     {
//                         "name": "greetings",
//                         "color": "hsl(227, 70%, 50%)",
//                         "children": [
//                             {
//                                 "name": "hey",
//                                 "color": "hsl(54, 70%, 50%)",
//                                 "loc": 140780
//                             },
//                             {
//                                 "name": "HOWDY",
//                                 "color": "hsl(179, 70%, 50%)",
//                                 "loc": 183515
//                             },
//                             {
//                                 "name": "aloha",
//                                 "color": "hsl(225, 70%, 50%)",
//                                 "loc": 12952
//                             },
//                             {
//                                 "name": "AHOY",
//                                 "color": "hsl(181, 70%, 50%)",
//                                 "loc": 154749
//                             }
//                         ]
//                     },
//                     {
//                         "name": "other",
//                         "color": "hsl(308, 70%, 50%)",
//                         "loc": 143068
//                     },
//                     {
//                         "name": "path",
//                         "color": "hsl(327, 70%, 50%)",
//                         "children": [
//                             {
//                                 "name": "pathA",
//                                 "color": "hsl(130, 70%, 50%)",
//                                 "loc": 156912
//                             },
//                             {
//                                 "name": "pathB",
//                                 "color": "hsl(179, 70%, 50%)",
//                                 "children": [
//                                     {
//                                         "name": "pathB1",
//                                         "color": "hsl(81, 70%, 50%)",
//                                         "loc": 21712
//                                     },
//                                     {
//                                         "name": "pathB2",
//                                         "color": "hsl(104, 70%, 50%)",
//                                         "loc": 134099
//                                     },
//                                     {
//                                         "name": "pathB3",
//                                         "color": "hsl(27, 70%, 50%)",
//                                         "loc": 42325
//                                     },
//                                     {
//                                         "name": "pathB4",
//                                         "color": "hsl(166, 70%, 50%)",
//                                         "loc": 29724
//                                     }
//                                 ]
//                             },
//                             {
//                                 "name": "pathC",
//                                 "color": "hsl(153, 70%, 50%)",
//                                 "children": [
//                                     {
//                                         "name": "pathC1",
//                                         "color": "hsl(338, 70%, 50%)",
//                                         "loc": 182677
//                                     },
//                                     {
//                                         "name": "pathC2",
//                                         "color": "hsl(119, 70%, 50%)",
//                                         "loc": 110290
//                                     },
//                                     {
//                                         "name": "pathC3",
//                                         "color": "hsl(356, 70%, 50%)",
//                                         "loc": 111553
//                                     },
//                                     {
//                                         "name": "pathC4",
//                                         "color": "hsl(218, 70%, 50%)",
//                                         "loc": 47427
//                                     },
//                                     {
//                                         "name": "pathC5",
//                                         "color": "hsl(286, 70%, 50%)",
//                                         "loc": 143006
//                                     },
//                                     {
//                                         "name": "pathC6",
//                                         "color": "hsl(96, 70%, 50%)",
//                                         "loc": 106131
//                                     },
//                                     {
//                                         "name": "pathC7",
//                                         "color": "hsl(186, 70%, 50%)",
//                                         "loc": 182598
//                                     },
//                                     {
//                                         "name": "pathC8",
//                                         "color": "hsl(60, 70%, 50%)",
//                                         "loc": 101861
//                                     },
//                                     {
//                                         "name": "pathC9",
//                                         "color": "hsl(28, 70%, 50%)",
//                                         "loc": 1980
//                                     }
//                                 ]
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     }
// }