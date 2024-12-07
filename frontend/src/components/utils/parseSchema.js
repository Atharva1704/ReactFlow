export const parseSchema = (schemaText) => {
    const cleanSchemaText = schemaText.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

    const schemaInfo = {
        models: {},
        enums: {},
        datasources: [],
        generators: []
    };

    const modelPattern = /model\s+(\w+)\s*{([\s\S]*?)}/g;
    const enumPattern = /enum\s+(\w+)\s*{([\s\S]*?)}/g;
    const datasourcePattern = /datasource\s+(\w+)\s*{([\s\S]*?)}/g;
    const generatorPattern = /generator\s+(\w+)\s*{([\s\S]*?)}/g;

    const modelMatches = [...cleanSchemaText.matchAll(modelPattern)];
    modelMatches.forEach(match => {
        const modelName = match[1];
        const modelContent = match[2];

        schemaInfo.models[modelName] = {
            name: modelName,
            fields: {},
            relations: []
        };

        const fieldPattern = /(\w+)\s+(\w+)(\[\])?(\?)?(\s*@.*)?/g;
        const fieldMatches = [...modelContent.matchAll(fieldPattern)];

        fieldMatches.forEach(fieldMatch => {
            const [, fieldName, fieldType, isArray, isOptional, annotations] = fieldMatch;

            const fieldInfo = {
                name: fieldName,
                type: fieldType,
                isArray: !!isArray,
                isOptional: !!isOptional,
                constraints: []
            };

            if (annotations) {
                const constraintMatches = annotations.match(/@\w+(\(.*?\))?/g);
                if (constraintMatches) {
                    constraintMatches.forEach(constraint => {
                        fieldInfo.constraints.push(constraint);
                    });
                }

                const relationMatch = annotations.match(/@relation\(fields:\s*\[(\w+)\],\s*references:\s*\[(\w+)\]\)/);
                if (relationMatch) {
                    schemaInfo.models[modelName].relations.push({
                        field: fieldName,
                        relatedModel: fieldType,
                        foreignKey: relationMatch[1],
                        referencedKey: relationMatch[2]
                    });
                }
            }

            schemaInfo.models[modelName].fields[fieldName] = fieldInfo;
        });
    });

    const enumMatches = [...cleanSchemaText.matchAll(enumPattern)];
    enumMatches.forEach(match => {
        const enumName = match[1];
        const enumValues = match[2].trim().split(/\s+/).map(v => v.replace(/,/g, ''));

        schemaInfo.enums[enumName] = {
            name: enumName,
            vals: enumValues
        };
    });

    const datasourceMatches = [...cleanSchemaText.matchAll(datasourcePattern)];
    datasourceMatches.forEach(match => {
        const datasourceName = match[1];
        const datasourceContent = match[2];

        const providerMatch = datasourceContent.match(/provider\s*=\s*"(\w+)"/);
        const urlMatch = datasourceContent.match(/url\s*=\s*env\("(\w+)"\)/);

        schemaInfo.datasources.push({
            name: datasourceName,
            provider: providerMatch ? providerMatch[1] : null,
            urlEnv: urlMatch ? urlMatch[1] : null
        });
    });

    const generatorMatches = [...cleanSchemaText.matchAll(generatorPattern)];
    generatorMatches.forEach(match => {
        const generatorName = match[1];
        const generatorContent = match[2];

        const providerMatch = generatorContent.match(/provider\s*=\s*"([\w-]+)"/);

        schemaInfo.generators.push({
            name: generatorName,
            provider: providerMatch ? providerMatch[1] : null
        });
    });

    return schemaInfo;
};
