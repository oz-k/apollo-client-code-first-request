/* eslint-disable @typescript-eslint/ban-types */
export type PrimitiveJsToTs<T> = T extends String
    ? string
    : T extends Number
        ? number
        : T extends Boolean
            ? boolean
            : T extends Array<infer U>
                ? PrimitiveJsToTs<U>[]
                : T;