import { Field } from 'src/decorators';
import { createGql } from 'src/utils';
import { DateScalar, DollarScalar } from '../__mocks__';

describe('createGql', () => {
    it('request.args의 값이 중첩오브젝트, 배열도 정상적으로 직렬화된 후 쿼리화되어야함', () => {
        class RequestDepth2 {
            @Field()
            arg1: string;

            @Field({scalar: DateScalar})
            arg2: Date;
        }
        class Request {
            @Field()
            arg1: string;

            @Field({type: [String], scalar: DollarScalar})
            arg2: string[];

            @Field({type: [RequestDepth2]})
            arg3: RequestDepth2[];
        }

        const result = createGql({
            name: 'test',
            request: {
                argsRef: Request,
                args: {
                    arg1: 'test',
                    arg2: ['$100', '$200'],
                    arg3: [
                        {
                            arg1: 'test1',
                            arg2: new Date('2020-01-01'),
                        },
                        {
                            arg1: 'test2',
                            arg2: new Date('2020-01-02'),
                        },
                    ],
                },
            },
            responseRef: String,
        });

        expect(result).toEqual('test(arg1: "test", arg2: [100, 200], arg3: [{arg1: "test1", arg2: "2020-01-01T00:00:00.000Z"}, {arg1: "test2", arg2: "2020-01-02T00:00:00.000Z"}]) ');
    });

    it('응답객체에 중첩오브젝트가 쿼리에 반영되어야함', () => {
        class Depth3 {
            @Field()
            prop1: string;

            @Field()
            prop2: number;
        }
        class Depth2 {
            @Field()
            prop1: string;

            @Field()
            depth3: Depth3;
        }
        class Depth1 {
            @Field()
            depth2: Depth2;
        }

        const result = createGql({
            name: 'test',
            responseRef: Depth1,
        });

        expect(result).toEqual('test {depth2 {prop1 depth3 {prop1 prop2}}}');
    });

    it('응답객체에 배열타입은 아이템타입으로 치환되어야함', () => {
        class Depth2 {
            @Field({type: [Number]})
            prop1: number[];
        }
        class Depth1 {
            @Field({type: [String]})
            prop1: string[];

            @Field({type: [Depth2]})
            depth2: Depth2[];
        }

        const result = createGql({
            name: 'test',
            responseRef: Depth1,
        });

        expect(result).toEqual('test {prop1 depth2 {prop1}}');
    });

    it('응답객체가 배열인 경우 배열의 0번째 타입으로 치환되어야함', () => {
        class Response {
            @Field()
            prop1: string;
        }

        const result = createGql({
            name: 'test',
            responseRef: [Response],
        });
        
        expect(result).toEqual('test {prop1}');
    });
});