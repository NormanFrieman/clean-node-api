import { Collection, MongoClient, MongoClientOptions } from 'mongodb';

export const MongoHelper = {
    client: null as MongoClient,

    async connect(uri: string): Promise<void>{
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as MongoClientOptions;

        this.client = await MongoClient.connect(uri, options);
    },

    async disconnect(): Promise<void>{
        await this.client.close();
    },

    getCollection(name: string): Collection{
        return this.client.db().collection(name);
    },

    map(collection: any): any{
        const { _id, ...colletionWithoutId } = collection;
        return Object.assign({}, colletionWithoutId, { id: _id.toHexString() });
    }
};