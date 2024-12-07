import React from 'react';
import { Handle, Position } from '@xyflow/react';
import Table from '../../Table/Table';
import './enumNode.css';

function enumNode({ data, isConnectable }) {
    // Prepare columns and data for the Table component
    const columns = ["Value"];
    const tableData = data.values.map(value => ({ Value: value }));

    return (
        <div className="enum-node">
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
                style={{ background: '#6a5acd' }}
            />

            <div className="enum-node-content">
                <h3 className="enum-node-title">{data.label}</h3>

                <Table
                    columns={columns}
                    data={tableData}
                />
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
                style={{ background: '#6a5acd' }}
            />
        </div>
    );
}

export default enumNode;