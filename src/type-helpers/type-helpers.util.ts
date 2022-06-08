import { Type } from 'src/interfaces';

export function inheritPropertyInitializers(
    target: Record<string, any>,
    sourceClass: Type<any>,
    isPropertyInherited: (key?: string) => boolean = () => true,
) {
    const tempInstance = new sourceClass();
    const propertyNames = Object.getOwnPropertyNames(tempInstance);

    propertyNames
        .filter(propertyName => (
            typeof tempInstance[propertyName] !== 'undefined'
            && typeof target[propertyName] === 'undefined'
        ))
        .filter(propertyName => isPropertyInherited(propertyName))
        .forEach(propertyName => { target[propertyName] = tempInstance[propertyName] });
}