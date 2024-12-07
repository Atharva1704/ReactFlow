import React, { useCallback, useEffect, useState } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
} from '@xyflow/react';
import "./SchemaVisualizer.css"
import '@xyflow/react/dist/style.css';
import model from '../Nodes/model/model';
import enumNode from '../Nodes/enum/enumNode';
import { parseSchema } from '../utils/parseSchema';
import DownloadButton from '../Download/Download';

const rfStyle = {
    backgroundColor: '#343434',
};

export default function SchemaVisualizer({ code }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        const schemaText = code || localStorage.getItem('prisma_schema');

        if (schemaText) {
            const parsedSchema = parseSchema(schemaText);
            // console.log("Parsed Schema is:", parsedSchema);
            localStorage.setItem('parsed_schema', JSON.stringify(parsedSchema));

            const modelNodes = Object.entries(parsedSchema.models).map(([modelName, modelInfo], index) => ({
                id: `model-${modelName}`,
                type: 'model',
                position: { x: index * 500, y: 100 },
                data: {
                    label: modelName,
                    fields: modelInfo.fields,
                    relations: modelInfo.relations
                },
            }));

            const enumNodes = Object.entries(parsedSchema.enums).map(([enumName, enumInfo], index) => ({
                id: `enum-${enumName}`,
                type: 'enum',
                position: { x: index * 500, y: 500 },
                data: {
                    label: enumName,
                    values: enumInfo.vals
                },
            }));

            const newNodes = [...modelNodes, ...enumNodes];


            const modelEdges = Object.values(parsedSchema.models).flatMap(model =>
                model.relations.map(relation => ({
                    id: `edge-${model.name}-${relation.relatedModel}`,
                    source: `model-${model.name}`,
                    target: `model-${relation.relatedModel}`,
                    label: `${model.name} → ${relation.relatedModel}`, 
                    style: { stroke: '#fff', strokeWidth: 2 },
                    labelStyle: {
                        fill: '#343434',
                        fontWeight: 'bold',
                        fontSize: '10px'
                    }
                }))
            );

            const enumEdges = Object.entries(parsedSchema.enums).flatMap(([enumName, enumInfo]) =>
                enumInfo.vals?.map(value => ({
                    id: `edge-enum-${enumName}-model-${value}`,
                    source: `enum-${enumName}`,
                    target: `model-${value}`,
                    label: `${enumName} → ${value}`, 
                    style: { stroke: '#00f', strokeWidth: 2 },
                    labelStyle: {
                        fill: '#343434',
                        fontWeight: 'bold',
                        fontSize: '10px'
                    }
                }))
            );

            // console.log(parsedSchema);
            const newEdges = [...modelEdges, ...enumEdges];
            // console.log(newEdges);

            setNodes(newNodes);
            setEdges(newEdges);
        }
    }, [code]);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div className='schema-visualizer-container'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={{ model, enum: enumNode }}
                onConnect={onConnect}
                fitView
                style={rfStyle}
            >
                <Controls />
                {/* <DownloadButton /> */}
                {/* <Controls>
                    <DownloadButton />
                </Controls> */}
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}