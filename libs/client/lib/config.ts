export interface ClientConfig {
    host: string,
    grpcPort: number,
    graphqlPort: number,
    magnusHost: string,
    magnusPort: number
}
export function getConfig() {
    const options: ClientConfig = {
        host: 'localhost',
        grpcPort: 3000,
        graphqlPort: 9000,
        magnusHost: 'localhost',
        magnusPort: 9000,
        ...process.env as any
    }
    return options;
}
