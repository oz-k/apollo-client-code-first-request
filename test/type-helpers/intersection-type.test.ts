import { Metadata } from 'src/utils';
import { Field } from 'src/decorators';
import { IntersectionType } from 'src/type-helpers';
import { DateScalar } from '../__mocks__';

describe('IntersectionType', () => {
    it('클래스가 병합되어 상속받은 클래스 메타데이터에 부모 프로퍼티들이 등록되어있어야함', () => {
        class ParentA {
            @Field()
            prop1: string;
        }
        class ParentB {
            @Field()
            prop2: number;
        }
        class Child extends IntersectionType(ParentA, ParentB) {
            @Field()
            prop3: Date;
        }

        const result = Metadata.getPropertyNames(Child.prototype);

        expect(result).toEqual(['prop1', 'prop2', 'prop3']);
    });

    it('병합된 프로퍼티 메타데이터에 fieldInfo가 등록되어있어야함', () => {
        class ParentA {
            @Field()
            prop1: string;
        }
        class ParentB {
            @Field({type: [Date], scalar: DateScalar})
            prop2: Date[];
        }
        class Child extends IntersectionType(ParentA, ParentB) {
            @Field()
            prop3: number;
        }

        const result1 = Metadata.getFieldInfo(Child.prototype, 'prop1');
        const result2 = Metadata.getFieldInfo(Child.prototype, 'prop2');
        const result3 = Metadata.getFieldInfo(Child.prototype, 'prop3');

        expect(result1).toEqual({
            type: String,
            isArray: false,
        });
        expect(result2).toEqual({
            type: Date,
            isArray: true,
            scalar: DateScalar,
        });
        expect(result3).toEqual({
            type: Number,
            isArray: false,
        });
    });

    it('병합할 부모클래스간의 중복된 이름을 가진 프로퍼티가 존재하는경우 두번째 매개변수로 넘어온 부모클래스의 프로퍼티만 설정되어야함', () => {
        class ParentA {
            @Field()
            prop1: string;
        }
        class ParentB {
            @Field()
            prop1: number;
        }
        class Child extends IntersectionType(ParentA, ParentB) {}

        const propertyNames = Metadata.getPropertyNames(Child.prototype);
        const prop1FieldInfo = Metadata.getFieldInfo(Child.prototype, 'prop1');

        expect(propertyNames).toEqual(['prop1']);
        expect(prop1FieldInfo).toEqual({
            type: Number,
            isArray: false,
        });
    });
});