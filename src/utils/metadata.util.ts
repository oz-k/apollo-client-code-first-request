import 'reflect-metadata';
import { FIELD_METADATA, PROPERTY_NAMES_METADATA } from 'src/constants';
import { FieldInfo } from 'src/interfaces';

export class Metadata {
    static getType(target: any, propertyKey?: string | symbol) {
        return Reflect.getMetadata('design:type', target, propertyKey);
    }
    
    static addPropertyKey(propertyName: string, target: any, propertyKey?: string) {
        const prevPropertyNames = this.getPropertyNames(target, propertyKey);
    
        if(!prevPropertyNames.includes(propertyName)) {
            Reflect.defineMetadata(
                PROPERTY_NAMES_METADATA,
                [...prevPropertyNames, propertyName],
                target,
                propertyKey,
            );
        }
    }

    static getPropertyNames(target: any, propertyKey?: string): string[] {
        return Reflect.getMetadata(PROPERTY_NAMES_METADATA, target, propertyKey) || [];
    }
    
    static setFieldInfo(fieldInfo: FieldInfo, target: any, propertyKey?: string) {
        Reflect.defineMetadata(
            FIELD_METADATA,
            fieldInfo,
            target,
            propertyKey,
        );
    }

    static getFieldInfo(target: Record<string, any>, propertyKey?: string): FieldInfo {
        return Reflect.getMetadata(FIELD_METADATA, target, propertyKey);
    }
}