import { Query, ResponseRef, Type } from '../interfaces';
import { parseObjectByScalar } from './parse-object-by-scalar.util';

/** 
 * 응답객체를 필드 데코레이터에 정의해둔 스칼라에 따라 파싱하는 함수
 * @returns 파싱된 응답객체
 */
export function parseApolloResponseData<
    N extends string,
    A extends Record<string, any>,
    R extends ResponseRef,
>(queries: Query<N, A, R>[], data: Record<N, Record<keyof R, any>> | Record<N, Record<keyof R, any>[]>) {
    return (Object.keys(data) as N[]).reduce((prev, curr) => {
        const query = queries.find(({name}) => name === curr);
        if(!query) return prev;

        if(Array.isArray(data[curr]) !== Array.isArray(query.responseRef)) {
            throw new Error('responseRef must be Array when response is Array.');
        }

        if(Array.isArray(data[curr])) {
            prev[curr] = (data[curr] as Record<keyof R, any>[])
                .map(item => (
                    parseObjectByScalar<Record<string, any>>(
                        query.responseRef[0] as Type<Record<string, any>>,
                        item,
                    )
                )) as R extends [Type<infer S>] ? S[] : never;
        } else {
            prev[curr] = parseObjectByScalar<Record<string, any>>(
                query.responseRef as Type<Record<string, any>>,
                data[curr],
            ) as R extends [Type<infer S>] ? S[] : R extends Type<infer T> ? T : never;
        }

        return prev;
    }, {} as Record<N, R extends [Type<infer S>] ? S[] : R extends Type<infer T> ? T : never>);
}