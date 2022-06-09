import type { Type } from '../interfaces';
import { Metadata } from './metadata.util';

/**
 * 스칼라로 오브젝트를 파싱하는 함수
 * @returns 파싱된 오브젝트
 */
export function parseObjectByScalar<
    R extends Record<string, any>,
>(classRef: Type<R>, object: Record<keyof R, any>): R {
    const propertyNames: (keyof R)[] = Metadata.getPropertyNames(classRef.prototype);
    if(!propertyNames.length) return object;

    const parsedObject = new classRef();

    propertyNames.forEach(propertyName => {
        const {type, isArray, scalar} = Metadata.getFieldInfo(classRef.prototype, propertyName as string);

        const propertyValues: any[] = isArray ? [...object[propertyName]] : [object[propertyName]];

        propertyValues.forEach((value, index) => {
            propertyValues[index] = parseObjectByScalar(type, value);

            if(value && scalar) {
                propertyValues[index] = new scalar().parseValue(propertyValues[index]);
            }
        });

        parsedObject[propertyName] = isArray ? propertyValues : propertyValues[0];
    });

    return parsedObject;
}