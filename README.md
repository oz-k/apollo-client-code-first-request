## Apollo Client Code First Request
[![npm version](https://badge.fury.io/js/apollo-client-code-first-request.svg)](https://www.npmjs.com/package/apollo-client-code-first-request)

Apollo Client Code First Request is a **type-safety** module that allows you to use the Apollo client using Typescript's decorators **without using raw GraphQL query**.

This module is inspired by the code first approach of [Nest.js GraphQL](https://github.com/nestjs/graphql).

## Installation
**NPM:**
```bash
npm install apollo-client-code-first-request
```
**Yarn:**
```bash
yarn add apollo-client-code-first-request
```

## Example
<details>
<summary><b>Basic</b></summary>

```typescript
import { ApolloClientCodeFirstRequest } from 'apollo-client-code-first-request';
import { ApolloClient } from '@apollo/client';

class Query1Args {
    @Field()
    arg1: string;
}

class Query1Response {
    @Field()
    field1: string;

    @Field()
    field2: number;
}

const apolloClient = new ApolloClient();

const query1Args: Query1Args = {
    arg1: 'arg1',
};

const { data: { query1 } } = await ApolloClientCodeFirstRequest
    .addQuery({
        name: 'query1',
        request: {
            argsRef: Query1Args,
            args: query1Args,
        },
        responseRef: Query1Response,
    })
    .fetch('query', apolloClient);

/**
 * Equivalent to:
 * const { data: query1 } = await apolloClient.query<Query1Response, Query1Args>({
 *     query: gql`
 *         query Q($arg1: String!) {
 *             query1(arg1: $arg1) {
 *                 field1
 *                 field2
 *             }
 *         }
 *     `,
 *     variables: query1Args,
 * });
 */
```
</details>
<details>
<summary><b>Multiple Queries</b></summary>

```typescript
import { ApolloClientCodeFirstRequest } from 'apollo-client-code-first-request';
import { ApolloClient } from '@apollo/client';

class Query1Args {
    @Field()
    arg1: string;
}

class Query1Response {
    @Field()
    field1: string;

    @Field()
    field2: number;
}

class Query2Args {
    @Field()
    arg2: string;
}

class Query2Response {
    @Field()
    field3: string;

    @Field()
    field4: number;
}

const apolloClient = new ApolloClient();

const query1Args: Query1Args = {
    arg1: 'arg1',
};

const query2Args: Query2Args = {
    arg2: 'arg2',
};

const { data: { query1, query2 } } = await ApolloClientCodeFirstRequest
    .addQuery({
        name: 'query1',
        request: {
            argsRef: Query1Args,
            args: query1Args,
        },
        responseRef: Query1Response,
    })
    .addQuery({
        name: 'query2',
        request: {
            argsRef: Query2Args,
            args: query2Args,
        },
        responseRef: Query2Response,
    })
    .fetch('query', apolloClient);

/**
 * Equivalent to:
 * const { data: { query1, query2 } } = await apolloClient.query<{
 *     query1: Query1Response,
 *     query2: Query2Response,
 * }, {
 *     query1: Query1Args,
 *     query2: Query2Args,
 * >({
 *     query: gql`
 *         query Q($arg1: String!, $arg2: String!) {
 *             query1(arg1: $arg1) {
 *                 field1
 *                 field2
 *             }
 *             query2(arg2: $arg2) {
 *                 field3
 *                 field4
 *             }
 *         }
 *     `,
 *     variables: {
 *        ...query1Args,
 *        ...query2Args,
 *     },
 * });
 */
```
</details>
<details>
<summary><b>Mapped Type</b></summary>

> This section is equivalent to as [Nest.js GraphQL Mapped Type](https://docs.nestjs.com/graphql/mapped-types) except for PartialType.

```typescript
import { PickType, OmitType, IntersectionType } from 'apollo-client-code-first-request';

class Response {
    @Field()
    field1: string;

    @Field()
    field2: number;

    @Field()
    field3: string;

    @Field()
    field4: number;
}

// PickType
class PickedResponse extends PickType(Response, ['field1', 'field2'] as const) {}
// Equivalent to:
// class PickedResponse {
//     @Field()
//     field1: string;
//
//     @Field()
//     field2: number;
// }

// OmitType
class OmittedResponse extends OmitType(Response, ['field2', 'field4'] as const) {}
// Equivalent to:
// class OmittedResponse {
//     @Field()
//     field1: string;
//
//     @Field()
//     field3: string;
// }

// IntersectionType
class MixedResponse extends IntersectionType(PickedResponse, OmittedResponse) {}
// Equivalent to:
// class MixedResponse {
//     @Field()
//     field1: string;
//
//     @Field()
//     field2: number;
//
//     @Field()
//     field3: string;
// }
```
</details>
<details open>
<summary><b>Scalar</b></summary>

> ⚠️ This section is implemented but not yet documented.
</details>
<details open>
<summary><b>Array</b></summary>

> ⚠️ This section is implemented but not yet documented.
</details>
<details open>
<summary><b>Nested Field Argument</b></summary>

> ⚠️ This section is not yet implemented.
</details>

