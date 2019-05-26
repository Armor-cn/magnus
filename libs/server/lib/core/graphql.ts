import { ConnectionOptions, Connection, EntityMetadata, Code } from "typeorm";
import { createConnection } from 'typeorm';
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
export class CoreGraphql {
    static code: string = ``;

    constructor(
        protected _options: ConnectionOptions,
        protected _connection?: Connection
    ) { }


    createGraphql() {
        let code = CoreGraphql.code;
        if (this._connection) {
            // type
            const metadatas: EntityMetadata[] = this._connection.entityMetadatas;
            metadatas.map(meta => {
                code += this.createTypeByEntity(meta)
            });

            // query
            code += `type Query{\n`;
            metadatas.map(meta => {
                code += this.createQueryByEntity(meta)
            });
            code += `}\n`;

            // mutation
            code += `type Mutation{\n`;
            metadatas.map(meta => {
                code += this.createMutationByEntity(meta)
            });
            code += `}\n`;
        }
        return code;
    }

    async init() {
        this._connection = await createConnection(this._options);
    }

    createSystemType() {
        let code = ``;
        return code;
    }

    createTypeByEntity(entity: EntityMetadata): string {
        let code = ``;
        if (this._connection) {
            code += `type ${entity.name} {\n`
            entity.columns.map((column: ColumnMetadata) => {
                code += `\t${column.databaseName}: `;
                const type = (column.type as any).name;
                if (type === 'String') {
                    code += `String`;
                } else {
                    code += type;
                }
                if (!column.isNullable) {
                    code += `!\n`
                }
            });
            code += `}\n`;
        }
        return code;
    }

    createQueryByEntity(meta: EntityMetadata) {
        let code = ``
        return code;
    }

    createMutationByEntity(meta: EntityMetadata) {
        let code = ``
        return code;
    }
}