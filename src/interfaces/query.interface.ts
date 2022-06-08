import { Type } from './type.interface';

// 요청옵션타입
export interface Request<A extends Record<string, any>> {
    argsRef: Type<A>;
    args: A;
}

// 쿼리타입
export interface Query<N extends string, A extends Record<string, any>, R extends Record<string, any>> {
    name: N;
    request?: Request<A>;
    responseRef: Type<R>;
}

// 쿼리 결과타입
export type QueryResult<Q extends Query<any, any, any>> = {
    [K in Q['name']]: Q extends Query<K, any, infer R> ? R : never;
};