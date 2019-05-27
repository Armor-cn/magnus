import { ConnectionOptions, Connection, EntityMetadata } from "typeorm";
import { createConnection } from 'typeorm';
import { CodeManager } from './code';
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
            const manager = new CodeManager(metadatas);
            code += manager.create();
        }
        return code;
    }

    async init() {
        this._connection = await createConnection(this._options);
    }
}
