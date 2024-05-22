import { useEffect, useState } from 'react';
import G6, { Graph } from '@antv/g6';

const App = () => {
    const [graph, setGraph] = useState<Graph | null>(null);
    const [length, setLength] = useState<number>(0);
    const [groups] = useState<string[]>(['group0', 'group1']);
    const [nodePositions, setNodePositions] = useState<{ [key: string]: { x: number, y: number } }>({});

    const updateGraph = () => {
        if (graph && groups.length > 0) {
            const nodes = [] as { id: string, groupId: string, style: { fill: string, stroke: string }, x: number, y: number }[];
            const edges = [] as { source: string, target: string }[];

            for (let i = 0; i < length; i++) {
                const isEven = i % 2 === 0;
                const fillColor = isEven ? '#ADD8E6' : '#FFCCCB';
                const strokeColor = isEven ? '#4682B4' : '#FF6347';

                const position = nodePositions[i] || { x: Math.random() * GRAPH_WIDTH, y: Math.random() * GRAPH_HEIGHT };
                setNodePositions(prevNodePositions => ({ ...prevNodePositions, [i]: position }));

                nodes.push({
                    id: `node${i}`,
                    groupId: `group${isEven ? '0' : '1'}`,
                    style: {
                        fill: fillColor,
                        stroke: strokeColor,
                    },
                    x: position.x,
                    y: position.y,
                });

                if (i > 1) {
                    edges.push({ source: `node${i - 2}`, target: `node${i}` });
                }
            }

            graph.changeData({ nodes, edges });

            // Render the graph first
            graph.render();

            // Create hulls after rendering the graph
            groups.forEach(groupId => {
                const hullNodes = nodes.filter(node => node.groupId === groupId).map(node => node.id);
                graph.createHull({
                    id: `${groupId}-hull`,
                    members: hullNodes,
                    padding: 10,
                    style: {
                        fill: groupId === 'group0' ? 'lightgreen' : 'yellow',
                        stroke: 'green',
                    },
                });
            });
        }
    };

    useEffect(() => {
        if (!graph) {
            const newGraph = new G6.Graph({
                container: 'graph-container',
                width: GRAPH_WIDTH,
                height: GRAPH_HEIGHT,
                layout: {
                    preventOverlap: true
                },
                modes: {
                    default: [
                        'drag-canvas',
                        'zoom-canvas',
                        'drag-node',
                        {
                            type: 'activate-relations',
                            trigger: 'click',
                        },
                    ],
                },
                defaultNode: {
                    type: 'circle',
                    size: NODE_SIZE,
                },
            });

            // Listen for node movement events
            newGraph.on('node:drag', (e) => {
                const { item } = e;
                const model = item?.getModel();
                const nodeId = model?.id;
                const nodeX = model?.x;
                const nodeY = model?.y;

                // Update node position in state
                if (nodeId && nodeX && nodeY) {
                    setNodePositions(prevNodePositions => ({
                        ...prevNodePositions,
                        [nodeId]: {x: nodeX, y: nodeY}
                    }));
                    updateGraph();
                }
            });

            setGraph(newGraph);
        }
    }, []);

    useEffect(() => {
        if (graph && length > 0) updateGraph();
    }, [graph, length]);

    return (
        <div>
            <div id="graph-container" style={{ width: `${GRAPH_WIDTH}px`, height: `${GRAPH_HEIGHT}px` }} />
            <button onClick={() => setLength(prevLength => prevLength + 1)}>Add Node</button>
        </div>
    );
};

const GRAPH_WIDTH = 800;
const GRAPH_HEIGHT = 600;
const NODE_SIZE = 50;

export default App;