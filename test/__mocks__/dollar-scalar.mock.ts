import { Scalar } from 'src/interfaces';

export class DollarScalar implements Scalar {
    parseValue(value: number) {
        return `$${value.toString()}`;
    }
    serialize(value: string) {
        return parseInt(value.replace(/^\$/, ''), 10);
    }
}