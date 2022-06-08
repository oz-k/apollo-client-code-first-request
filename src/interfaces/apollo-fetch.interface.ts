import { ApolloQueryResult, FetchResult, MutationOptions, Observable, QueryOptions, SubscriptionOptions } from '@apollo/client';
import { Query, QueryResult } from './query.interface';

export type FetchType = 'query' | 'mutate' | 'subscribe';

// 쿼리타입에 따른 분기타입
export type BranchByFetchType<T extends FetchType, Q, M, S> = T extends 'query'
    ? Q
    : T extends 'mutate'
        ? M
        : T extends 'subscribe'
            ? S
            : never;

// 쿼리타입에 따른 apollo 요청 옵션타입
export type ApolloFetchOptions<T extends FetchType> = BranchByFetchType<
    T,
    QueryOptions,
    MutationOptions,
    SubscriptionOptions
>;

// 쿼리타입에 따른 아폴로 요청결과타입
export type ApolloFetchResult<
    T extends FetchType,
    Q extends Query<any, any, any>,
> = BranchByFetchType<
    T,
    ApolloQueryResult<QueryResult<Q>>,
    FetchResult<QueryResult<Q>>,
    Observable<FetchResult<QueryResult<Q>>>
>;