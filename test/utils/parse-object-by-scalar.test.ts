import { Field } from 'src/decorators';
import { parseObjectByScalar } from 'src/utils';
import { DateScalar, DollarScalar } from '../__mocks__';

describe('parseObjectByScalar', () => {
    it('scalar가 지정된 프로퍼티는 파싱되어 반환되어야함', () => {
        class Response {
            @Field({scalar: DateScalar})
            prop1: Date;
            
            @Field()
            prop2: Date;
        }

        const result = parseObjectByScalar(Response, {
            prop1: '2020-01-01',
            prop2: '2020-01-02',
        });

        expect(result).toEqual({
            prop1: new Date('2020-01-01'),
            prop2: '2020-01-02',
        });
    });

    it('중첩오브젝트, 배열도 정상적으로 파싱되어야함', () => {
        class Depth3 {
            @Field({scalar: DateScalar})
            date: Date;

            @Field({scalar: DollarScalar})
            amount?: string;
        }
        class Depth2 {
            @Field({type: [Depth3]})
            depth3: Depth3[];

            @Field({type: [Date], scalar: DateScalar})
            dates: Date[];
        }
        class Depth1 {
            @Field()
            depth2: Depth2;
        }
        
        const result = parseObjectByScalar(Depth1, {
            depth2: {
                depth3: [{
                    date: '2020-01-01',
                    amount: '100',
                }, {
                    date: '2020-01-02',
                    amount: '200',
                }, {
                    date: '2020-01-03',
                }],
                dates: [
                    '2020-02-01',
                    '2020-02-02',
                ],
            },
        });

        expect(result).toEqual({
            depth2: {
                depth3: [{
                    date: new Date('2020-01-01'),
                    amount: '$100',
                }, {
                    date: new Date('2020-01-02'),
                    amount: '$200',
                }, {
                    date: new Date('2020-01-03'),
                }],
                dates: [
                    new Date('2020-02-01'),
                    new Date('2020-02-02'),
                ],
            },
        });
    });
});