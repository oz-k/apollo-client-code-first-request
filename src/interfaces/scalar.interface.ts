export interface Scalar {
    parseValue(value: any): any;
    serialize(value: any): any;
}