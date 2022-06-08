import { Scalar } from './scalar.interface';
import { Type } from './type.interface';

export interface FieldInfo {
    type: Type<any>;
    isArray: boolean;
    scalar?: Type<Scalar>;
}

export interface FieldOptions {
    type?: FieldInfo['type'] | [FieldInfo['type']];
    scalar?: FieldInfo['scalar'];
}