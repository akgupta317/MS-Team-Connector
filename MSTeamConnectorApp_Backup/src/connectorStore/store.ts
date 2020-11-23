export class ConnectorStore {
    private store:Array<connectorConfig>;
    private static token:string;

    constructor() {
        this.store = [];
        ConnectorStore.token="";
    }

    set(obj:connectorConfig) {
        this.store.push(obj);
    }
    static setToken(token:string) {
        ConnectorStore.token=token;
    }
    static getToken() {
        return ConnectorStore.token;
    }
    getAll() {
        return this.store;
    }
}

interface connectorConfig {
    message:string;
    interval:number;
    team:string;
    tenant:string;
    channel:string;
    configuredBy:string;
    webhook:string;
}