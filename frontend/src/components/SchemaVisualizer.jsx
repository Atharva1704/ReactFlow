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
import model from '../components/Nodes/model/model';
import enumNode from '../components/Nodes/enum/enumNode';
import { parseSchema } from './parseSchema';
import DownloadButton from './Download/Download';

const rfStyle = {
    backgroundColor: '#343434',
};

export default function SchemaVisualizer({ code }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        // Get schema from either prop or localStorage
        const schemaText = code || localStorage.getItem('prisma_schema');

        if (schemaText) {
            // Parse the schema
            const parsedSchema = parseSchema(schemaText);
            console.log("Parsed Schema is:", parsedSchema);
            // Save parsed schema to localStorage
            localStorage.setItem('parsed_schema', JSON.stringify(parsedSchema));

            // Create model nodes
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

            // Create enum nodes
            const enumNodes = Object.entries(parsedSchema.enums).map(([enumName, enumInfo], index) => ({
                id: `enum-${enumName}`,
                type: 'enum',
                position: { x: index * 500, y: 500 },
                data: {
                    label: enumName,
                    values: enumInfo.vals
                },
            }));

            // Combine nodes
            const newNodes = [...modelNodes, ...enumNodes];


            // Create edges based on model-to-model relations
            const modelEdges = Object.values(parsedSchema.models).flatMap(model =>
                model.relations.map(relation => ({
                    id: `edge-${model.name}-${relation.relatedModel}`,
                    source: `model-${model.name}`,
                    target: `model-${relation.relatedModel}`,
                    label: `${model.name} → ${relation.relatedModel}`, // Add label showing connection
                    style: { stroke: '#fff', strokeWidth: 2 }, // Optional: improve edge visibility
                    labelStyle: {
                        fill: '#343434',
                        fontWeight: 'bold',
                        fontSize: '10px'
                    }
                }))
            );

            // Create edges between enums and their related models
            const enumEdges = Object.entries(parsedSchema.enums).flatMap(([enumName, enumInfo]) =>
                enumInfo.vals?.map(value => ({
                    id: `edge-enum-${enumName}-model-${value}`,
                    source: `enum-${enumName}`,
                    target: `model-${value}`,
                    label: `${enumName} → ${value}`, // Label showing the connection
                    style: { stroke: '#00f', strokeWidth: 2 },
                    labelStyle: {
                        fill: '#343434',
                        fontWeight: 'bold',
                        fontSize: '10px'
                    }
                }))
            );

            console.log(parsedSchema);
            // Combine all edges
            const newEdges = [...modelEdges, ...enumEdges];
            console.log(newEdges);

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