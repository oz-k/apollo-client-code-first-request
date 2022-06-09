import { Field } from '../decorators';
import { Type } from '../interfaces';
import { Metadata } from '../utils';
import { inheritPropertyInitializers } from './type-helpers.util';

export function PickType<T, K extends keyof T>(
    classRef: Type<T>,
    keys: readonly K[],
): Type<Pick<T, typeof keys[number]>> {
    const parentPropertyNames = Metadata.getPropertyNames(classRef.prototype);

    const isInheritedPredicate = (propertyKey: string) => keys.includes(propertyKey as K);
    abstract class PickObjectType {
        constructor() {
            inheritPropertyInitializers(this, classRef, isInheritedPredicate);
        }
    }

    parentPropertyNames
        .filter(propertyName => keys.includes(propertyName as K))
        .forEach(propertyName => {
            const fieldInfo = Metadata.getFieldInfo(classRef.prototype, propertyName);

            Field({
                ...fieldInfo,
                ...(fieldInfo.isArray && {type: [fieldInfo.type]}),
            })(PickObjectType.prototype, propertyName);
        });
    
    return PickObjectType as Type<Pick<T, typeof keys[number]>>;
}