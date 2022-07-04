import { PrimitiveJsToTs } from './primitive-js-to-ts.interface';
import { Type } from './type.interface';

// 요청옵션타입
export interface Request<A extends Record<string, any>> {
    argsRef: Type<A>;
    args: A;
}

export type ResponseRef = Type<Record<string, any>> | [Type<Record<string, any>>];

// 쿼리타입
export interface Query<N extends string, A extends Record<string, any>, R extends ResponseRef> {
    name: N;
    request?: Request<A>;
    responseRef: R;
}

// 쿼리 결과타입
export type QueryResult<Q extends Query<any, any, any>> = {
    [K in Q['name']]: Q extends Query<K, any, infer R>
        ? R extends [Type<infer R2>]
            ? PrimitiveJsToTs<R2>[]
            : R extends Type<infer R3>
                ? PrimitiveJsToTs<R3>
                : never
        : never;
};