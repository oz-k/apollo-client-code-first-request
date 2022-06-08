import { Field } from 'src/decorators';
import { Type } from 'src/interfaces';
import { Metadata } from '../utils';
import { inheritPropertyInitializers } from './type-helpers.util';

export function IntersectionType<A, B>(
    classARef: Type<A>,
    classBRef: Type<B>,
): Type<A & B> {
    const parentAPropertyNames = Metadata.getPropertyNames(classARef.prototype);
    const parentBPropertyNames = Metadata.getPropertyNames(classBRef.prototype);

    abstract class IntersectionObjectType {
        constructor() {
            inheritPropertyInitializers(this, classARef);
            inheritPropertyInitializers(this, classBRef);
        }
    }

    parentAPropertyNames.forEach(propertyName => {
        const fieldInfo = Metadata.getFieldInfo(classARef.prototype, propertyName);

        Field({
            ...fieldInfo,
            ...(fieldInfo.isArray && {type: [fieldInfo.type]}),
        })(IntersectionObjectType.prototype, propertyName);
    });
    parentBPropertyNames.forEach(propertyName => {
        const fieldInfo = Metadata.getFieldInfo(classBRef.prototype, propertyName);
        
        Field({
            ...fieldInfo,
            ...(fieldInfo.isArray && {type: [fieldInfo.type]}),
        })(IntersectionObjectType.prototype, propertyName);
    });

    return IntersectionObjectType as Type<A & B>;
}