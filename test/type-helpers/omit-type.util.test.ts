import { Metadata } from 'src/utils';
import { Field } from 'src/decorators';
import { OmitType } from 'src/type-helpers';
import { DateScalar } from '../__mocks__';

describe('OmitType', () => {
    it('상속받은 클래스 메타데이터에 부모클래스에서 제외한 프로퍼티들이 등록되어있어야함', () => {
        class Parent {
            @Field()
            prop1: string;

            @Field()
            prop2: string;

            @Field()
            prop3: string;
        }
        class Child extends OmitType(Parent, ['prop1', 'prop3']) {
            @Field()
            prop4: string;
        }

        const result = Metadata.getPropertyNames(Child.prototype);

        expect(result).toEqual(['prop2', 'prop4']);
    });

    it('상속된 프로퍼티 메타데이터에 fieldInfo가 등록되어있어야함', () => {
        class Parent {
            @Field({scalar: DateScalar})
            prop1: Date;

            @Field()
            prop2: string;

            @Field()
            prop3: number;
        }
        class Child extends OmitType(Parent, ['prop2']) {}

        const result1 = Metadata.getFieldInfo(Child.prototype, 'prop1');
        const result3 = Metadata.getFieldInfo(Child.prototype, 'prop3');

        expect(result1).toEqual({
            type: Date,
            isArray: false,
            scalar: DateScalar,
        });
        expect(result3).toEqual({
            type: Number,
            isArray: false,
        });
    });
});