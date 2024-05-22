import Graphin, { Behaviors, Components, GraphinData, HullCfg, IUserNode, Utils } from '@antv/graphin';
import './App.css'
import '@antv/graphin-icons/dist/index.css';
import { useState } from "react";

function App() {
    const layout = {
        type: 'random',
        nodeSize: 50,
    };

    const [graphData, setGraphData] = useState<GraphinData>({
        nodes: [],
        edges: [],
        combos: [
            { id: 'comboRoot' }, // Define comboRoot
            { id: 'oddCombo', parentId: 'comboRoot' },
            { id: 'evenCombo', parentId: 'comboRoot' },
        ],
    });

    const [hullOptions, setHullOptions] = useState<HullCfg[]>([
        { members: [] },
        { members: [] },
    ]);

    const handleAddNode = () => {
        const index = graphData.nodes.length;
        const newNode: IUserNode = {
            id: Utils.uuid(),
            style: {
                keyshape: {
                    fill: index % 2 === 0 ? '#ADD8E6' : '#FFCCCB',
                    fillOpacity: 0.4,
                    lineWidth: 2,
                    stroke: index % 2 === 0 ? '#4682B4' : '#FF6347',
                },
                label: { value: 'New Node' },
            },
        };

        const isEven = index % 2 === 0;
        const comboId = isEven ? 'evenCombo' : 'oddCombo'; // Determine which combo to assign the new node to
        const hullIndex = isEven ? 1 : 0; // Determine which hull configuration to update

        setGraphData(prevData => {
            const newNodes = [...prevData.nodes, newNode];
            const combos = prevData.combos || []; // Use empty array if combos is null or undefined

            return {
                ...prevData,
                nodes: newNodes,
                combos: [
                    ...combos, // Spread existing combos
                    { id: comboId, parentId: 'comboRoot', children: [newNode.id] }, // Assign new node to the corresponding combo
                ],
            };
        });

        setHullOptions(prevState => {
            const newHullOptions = [...prevState];
            newHullOptions[hullIndex] = {
                members: [...(newHullOptions[hullIndex]?.members || []), newNode.id], // Add the new node to the corresponding hull configuration
            };
            return newHullOptions;
        });
    };

    return (
        <div style={{ width: '800px', height: '600px' }}>
            <Graphin data={graphData} layout={layout}>
                <Behaviors.DragCanvas />
                <Behaviors.ZoomCanvas enableOptimize />
                <Behaviors.DragNode />
                <Behaviors.ActivateRelations trigger="click" />
                {hullOptions.map((option, i) => (
                    option.members.length > 1 && <Components.Hull key={i} options={hullOptions} />
                ))}
            </Graphin>
            <button onClick={handleAddNode}>Add Node</button>
        </div>
    );
}

export default App;