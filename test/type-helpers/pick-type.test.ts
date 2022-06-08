import { Metadata } from 'src/utils';
import { Field } from 'src/decorators';
import { PickType } from 'src/type-helpers';
import { DollarScalar } from '../__mocks__';

describe('PickType', () => {
    it('상속받은 클래스 메타데이터에 부모클래스에서 선택한 프로퍼티들이 등록되어있어야함', () => {
        class Parent {
            @Field()
            prop1: string;

            @Field()
            prop2: number;

            @Field()
            prop3: Date;

            @Field()
            prop4: boolean;
        }
        class Child extends PickType(Parent, ['prop1', 'prop4']) {
            @Field()
            prop5: string;
        }

        const result = Metadata.getPropertyNames(Child.prototype);

        expect(result).toEqual(['prop1', 'prop4', 'prop5']);
    });

    it('상속된 프로퍼티 메타데이터에 fieldInfo가 등록되어있어야함', () => {
        class Parent {
            @Field()
            prop1: string;

            @Field({type: [Number], scalar: DollarScalar})
            prop2: number[];
        }
        class Child extends PickType(Parent, ['prop1', 'prop2']) {}

        const result1 = Metadata.getFieldInfo(Child.prototype, 'prop1');
        const result2 = Metadata.getFieldInfo(Child.prototype, 'prop2');

        expect(result1).toEqual({
            type: String,
            isArray: false,
        });
        expect(result2).toEqual({
            type: Number,
            isArray: true,
            scalar: DollarScalar,
        });
    });
});