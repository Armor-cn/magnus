import { ObjectType, ConnectionOptions, Connection, EntityMetadata } from "typeorm";
import { createConnection } from 'typeorm';
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";
export class CoreGraphql {

    constructor(
        protected _options: ConnectionOptions,
        protected _connection?: Connection
    ) { }

    createGraphql() {
        let code = ``;
        if (this._connection) {
            const metadatas: EntityMetadata[] = this._connection.entityMetadatas;
            metadatas.map(meta => {
                code += this.createGraphqlByEntity(meta)
            })
        }
        return code;
    }
    async init() {
        this._connection = await createConnection(this._options);
    }
    createGraphqlByEntity(entity: EntityMetadata): string {
        let code = ``;
        if (this._connection) {
            code += `type ${entity.name} {\t`
            entity.columns.map((column: ColumnMetadata) => {
                code += `${column.databaseName}: `;
                const type = column.type.toString();
                if (type === 'String') {
                    code += `String`;
                }

                if (column.isNullable) { 
                    code += `!\n`
                }
            });
            code += `}`
        }
        return code;
    }
}