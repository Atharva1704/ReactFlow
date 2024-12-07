import { Handle, Position } from '@xyflow/react';
import Table from '../../Table/Table';

function model({ data, isConnectable }) {
    // Extract model name and fields from data
    const modelName = data.label;

    // Prepare columns and data for the Table component
    const columns = ["Field", "Type", "Constraints"];
    const tableData = Object.entries(data.fields || {}).map(([fieldName, fieldInfo]) => ({
        Field: fieldName,
        Type: fieldInfo.type + (fieldInfo.isArray ? '[]' : '') + (fieldInfo.isOptional ? '?' : ''),
        Constraints: fieldInfo.constraints.join(', ') || 'None'
    }));

    return (
        <div className="model-node" style={{
            border: '1px solid #777',
            borderRadius: '5px',
            backgroundColor: '#f0f0f0',
            width: '500px',
            maxHeight: '800px',
            overflow: 'auto'
        }}>
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
                style={{ background: '#555' }}
            />

            <div style={{ padding: '10px' }}>
                <h3 style={{
                    margin: '0 0 10px 0',
                    textAlign: 'center',
                    backgroundColor: '#e0e0e0',
                    padding: '5px',
                    borderBottom: '1px solid #ccc'
                }}>
                    {modelName}
                </h3>

                <Table
                    columns={columns}
                    data={tableData}
                />

                {/* Display relations if exist */}
                {data.relations && data.relations.length > 0 && (
                    <div style={{
                        marginTop: '10px',
                        fontSize: '0.8em',
                        borderTop: '1px solid #ccc',
                        paddingTop: '5px'
                    }}>
                        <strong>Relations:</strong>
                        {data.relations.map((relation, index) => (
                            <div key={index}>
                                {relation.field}: {relation.relatedModel}
                                (FK: {relation.foreignKey})
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                isConnectable={isConnectable}
                style={{ background: '#555' }}
            />
        </div>
    );
}

export default model;