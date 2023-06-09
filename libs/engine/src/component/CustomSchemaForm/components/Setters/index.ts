import { ArraySetter } from './ArraySetter'
import { BooleanSetter } from './BooleanSetter'
import { CSSValueSetter } from './CSSValueSetter'
import { ExpressionSetter } from './ExpressionSetter'
import { FunctionSetter } from './FunctionSetter'
import { JSONSetter } from './JSONSetter'
import { NumberSetter } from './NumberSetter'
import { SelectSetter } from './SelectSetter'
import { ShapeSetter } from './ShapeSetter'
import { StringSetter } from './StringSetter'
import { TextAreaSetter } from './TextAreaSetter'
import type { CSetter } from './type'


export default {
    StringSetter,
    ArraySetter,
    ShapeSetter,
    NumberSetter,
    ExpressionSetter,
    BooleanSetter,
    SelectSetter,
    JSONSetter,
    FunctionSetter,
    TextAreaSetter,
    CSSValueSetter,
} as Record<string, CSetter>
