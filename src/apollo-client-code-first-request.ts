import { ApolloClient, gql, MutationOptions, QueryOptions, SubscriptionOptions } from '@apollo/client';
import { ApolloFetchOptions, ApolloFetchResult, FetchType, Query, ResponseRef } from './interfaces';
import { createGql } from './utils';
import { parseApolloResponseData } from './utils/parse-apollo-response-data.util';

export class ApolloClientCodeFirstRequest {
    // 인스턴스 생성을 금지하기위해 생성자를 private으로 선언
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    static addQuery<
        N extends string,
        A extends Record<string, any>,
        R extends ResponseRef,
        Q extends Query<N, A, R>,
    >(...queries: Query<N, A, R>[]) {
        return {
            addQuery: <
                N2 extends string,
                A2 extends Record<string, any>,
                R2 extends ResponseRef,
            >(...queries2: Query<N2, A2, R2>[]) => this.addQuery<
                N | N2,
                A | A2,
                R | R2,
                Q | typeof queries2[number]
            >(...queries, ...queries2),
            fetch: async <T extends FetchType>(
                type: T,
                apolloClient: ApolloClient<any>,
                options?: ApolloFetchOptions<T>,
            ): Promise<ApolloFetchResult<T, Q>> => {
                const gqlQuery = `${type} {\n`
                    + `    ${queries.reduce((prev, curr) => (`${prev}${createGql(curr)}\n`), '')}`
                    + '}';
                const generatedGql = gql(gqlQuery);

                if(type === 'query') {
                    const response = await apolloClient.query({...options as QueryOptions<any>, query: generatedGql});

                    return {
                        ...response,
                        data: parseApolloResponseData<N, A, R>(queries, response.data),
                    } as unknown as ApolloFetchResult<T, Q>;
                }
                if(type === 'mutate') {
                    const response = await apolloClient.mutate({...options as MutationOptions<any>, mutation: generatedGql});

                    return {
                        ...response,
                        ...(response.data && { data: parseApolloResponseData<N, A, R>(queries, response.data) }),
                    } as unknown as ApolloFetchResult<T, Q>;
                }
                if(type === 'subscribe') {
                    return apolloClient
                        .subscribe(options as SubscriptionOptions<any>)
                        .map(response => {
                            return {
                                ...response,
                                ...(response.data && { data: parseApolloResponseData<N, A, R>(queries, response.data) }),
                            };
                        }) as unknown as ApolloFetchResult<T, Q>;
                }
            },
        };
    }
}