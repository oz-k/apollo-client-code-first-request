import { Type } from '../interfaces';

export function PartialType<T>(
    classRef: Type<T>,
): Type<Partial<T>> {
    return classRef as Type<Partial<T>>;
}