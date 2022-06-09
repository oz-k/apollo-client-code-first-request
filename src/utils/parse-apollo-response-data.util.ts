import { Query } from '../interfaces';
import { parseObjectByScalar } from './parse-object-by-scalar.util';

/** 
 * 응답객체를 필드 데코레이터에 정의해둔 스칼라에 따라 파싱하는 함수
 * @returns 파싱된 응답객체
 */
export function parseApolloResponseData<
    N extends string,
    A extends Record<string, any>,
    R extends Record<string, any>,
>(queries: Query<N, A, R>[], data: Record<N, Record<keyof R, any>>) {
    return (Object.keys(data) as N[]).reduce((prev, curr) => {
        const query = queries.find(({name}) => name === curr);
        if(!query) return prev;

        prev[curr] = parseObjectByScalar(query.responseRef, data[curr]);

        return prev;
    }, {} as Record<N, R>);
}