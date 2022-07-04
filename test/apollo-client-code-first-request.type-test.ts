import { ApolloClientCodeFirstRequest } from 'src/apollo-client-code-first-request';

/**
 * test tool
 */
type Expect<T extends true> = T;
type Equal<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? true : false;

class Q1Response {
    res1: number;
    res2: string;
}

class Q2Response {
    res1: number[];
    res2: {
        res21: string;
        res22: {
            res221: number;
        };
    };
}

class Q3Response {
    res1: boolean;
    res2: {
        res21: string;
        res22: {
            res221: number;
        };
    };
}

/**
 * ApolloClientCodeFirstRequest fetch return type test
 */
ApolloClientCodeFirstRequest
    .addQuery({
        name: 'q1',
        responseRef: [Q1Response],
    })
    .addQuery({
        name: 'q2',
        responseRef: [Q2Response],
    })
    .addQuery({
        name: 'q3',
        responseRef: Q3Response,
    })
    .addQuery({
        name: 'q4',
        responseRef: String,
    })
    .addQuery({
        name: 'q5',
        responseRef: [String],
    })
    .fetch('query', null)
    .then(result => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        type Cases = [
            Expect<Equal<typeof result.data.q1, Q1Response[]>>,
            Expect<Equal<typeof result.data.q2, Q2Response[]>>,
            Expect<Equal<typeof result.data.q3, Q3Response>>,
            Expect<Equal<typeof result.data.q4, string>>,
            Expect<Equal<typeof result.data.q5, string[]>>,
        ];
    });