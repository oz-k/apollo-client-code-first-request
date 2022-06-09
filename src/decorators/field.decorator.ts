import { FieldInfo, FieldOptions } from '../interfaces';
import { Metadata } from '../utils';

function getFieldTypeAndIsArray(
    target: Record<string, any>,
    propertyKey: string,
    type?: FieldOptions['type'],
): Pick<FieldInfo, 'type' | 'isArray'> {
    if(type) {
        if(Array.isArray(type)) {
            return {
                type: type[0],
                isArray: true,
            };
        }
        return {
            type,
            isArray: false,
        };
    }
    return {
        type: Metadata.getType(target, propertyKey),
        isArray: false,
    };
}

export function Field(options: FieldOptions = {}): PropertyDecorator {
    return (target: Record<string, any>, propertyKey: string) => {
        // 부모객체 메타데이터에 해당 프로퍼티 추가
        Metadata.addPropertyKey(propertyKey, target);
        // 프로퍼티 메타데이터에 필드속성 추가
        Metadata.setFieldInfo({
            ...getFieldTypeAndIsArray(target, propertyKey, options?.type),
            scalar: options?.scalar,
        }, target, propertyKey);
    };
}