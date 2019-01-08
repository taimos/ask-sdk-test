import { ResponseValidator, SequenceItem, SkillSettings } from '../types';
export declare class AlexaTest {
    private readonly handler;
    private settings;
    private validators;
    private dynamoDBTable;
    private partitionKeyName;
    private attributesName;
    constructor(handler: Function, settings: SkillSettings);
    addValidator(validator: ResponseValidator): AlexaTest;
    /**
     * Activates mocking of DynamoDB backed attributes
     * @param {string} tableName name of the DynamoDB Table
     * @param {string} partitionKeyName the key to be used as id (default: id)
     * @param {string} attributesName the key to be used for the attributes (default: attributes)
     */
    withDynamoDBPersistence(tableName: string, partitionKeyName?: string, attributesName?: string): AlexaTest;
    test(sequence: SequenceItem[], testDescription?: string): void;
    private runSingleTest;
    private mockDynamoDB;
    private mockProfileAPI;
}
