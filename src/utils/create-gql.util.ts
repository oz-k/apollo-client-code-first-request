import { Query, Type } from '../interfaces';
import { Metadata } from './metadata.util';

/**
 * 인자를 필드 데코레이터에 정의해둔 스칼라에 따라 직렬화하는 함수
 * @returns 직렬화된 인자
 */
function serializeArguments(argsRefPrototype: any, args: Record<string, any>) {
    const propertyNames = Metadata.getPropertyNames(argsRefPrototype);
    if(!propertyNames.length) return args;

    const serializedArguments: Record<string, any> = {};

    propertyNames.forEach(propertyName => {
        const {type, isArray, scalar} = Metadata.getFieldInfo(argsRefPrototype, propertyName);
        const propertyValues: any[] = isArray ? [...args[propertyName]] : [args[propertyName]];
        
        propertyValues.forEach((value, index) => {
            propertyValues[index] = serializeArguments(
                type.prototype,
                propertyValues[index],
            );
            if(value && scalar) {
                // eslint-disable-next-line new-cap
                propertyValues[index] = new scalar().serialize(propertyValues[index]);
            }
        });

        serializedArguments[propertyName] = isArray ? propertyValues : propertyValues[0];
    });

    return serializedArguments;
}

/**
 * gql query 중 argument 정의부를 만드는 함수
 * @returns ex) '(input1: 'input1' input2: 'input2')'
 */
function createGqlArgument(request?: Query<any, any, any>['request']) {
    if(!request) return '';

    const serializedArguments = serializeArguments(request.argsRef.prototype, request.args);

    return `(${
        JSON.stringify(serializedArguments)
            // FIXME: ,로만 replace 시 key or value에 ,가 들어갔을경우 버그를 일으킬 수 있음 정확한 정규식 필요함
            .replace(/,/g, ', ')
            // property key를 ""로 감싸지 않도록 변경
            .replace(/"([^"]+)":/g, '$1: ')
            // 앞뒤 중괄호 제거
            .slice(1, -1)
    })`;
}

/**
 * gql query 중 응답 시 받을 필드 정의부를 만드는 함수
 * @returns ex) '{field1 field2}'
 */
function createGqlBody(responseRef: Type<any> | [Type<any>]): string {
    const resRef: Type<any> = Array.isArray(responseRef) ? responseRef[0] : responseRef;
    const propertyNames = Metadata.getPropertyNames(resRef.prototype);
    if(!propertyNames.length) return '';
        
    const body = propertyNames
        .reduce((prev, curr) => {
            const { type } = Metadata.getFieldInfo(resRef.prototype, curr);
            const nestedField = createGqlBody(type);

            return `${prev}${curr} ${nestedField ? `${nestedField} ` : ''}`;
        }, '')
        // 'field1 field2 ... '로 마지막에 공백이 있기때문에 조형미를 위해 마지막공백을 slice한 후 중괄호로 감싸줌
        .slice(0, -1);

    return `{${body}}`;
}

/**
 * gql query를 만드는 함수
 * @returns ex) 'queryName(input1: 'input1' input2: 'input2') { field1, field2 }'
 */
export function createGql(query: Query<any, any, any>) {
    const gqlQueryArgument = createGqlArgument(query.request);
    const gqlQueryBody = createGqlBody(query.responseRef);

    return `${query.name}${gqlQueryArgument} ${gqlQueryBody}`;
}