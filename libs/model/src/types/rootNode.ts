import { assign, literal, object, omit, string } from 'superstruct'

import { CNodePropsTypeEnum } from '../const'
import type { CNodeDataType } from './node'
import { CNodeDataStructDescribe } from './node'

export enum InnerComponentNameEnum {
    ROOT_CONTAINER = 'RootContainer',
}

export type CRootNodeDataType = CNodeDataType & {
    componentName: InnerComponentNameEnum | `${InnerComponentNameEnum}`
}

export const FunctionPropertyTypeDescribe = object({
    type: literal(CNodePropsTypeEnum.FUNCTION),
    value: string(),
})

export const CRootNodeDataTypeDescribe = assign(
    omit(CNodeDataStructDescribe, ['componentName']),
    object({
        componentName: literal(InnerComponentNameEnum.ROOT_CONTAINER),
    }),
)
