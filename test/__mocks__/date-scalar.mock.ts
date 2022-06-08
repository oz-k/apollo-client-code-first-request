import { Scalar } from 'src/interfaces';

export class DateScalar implements Scalar {
    parseValue(value: string): any {
        return new Date(value);
    }
    serialize(value: Date): any {
        return value.toISOString();
    }
}