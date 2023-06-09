import { any, array, assign, literal, object, optional, string, union } from 'superstruct'

import type { AssetPackage, CSSType, LibMetaType } from './base'
import { LibMetaTypeDescribe, ThirdLibTypeDescribe } from './base'
import type { FunctionPropType } from './node'
import type { CRootNodeDataType } from './rootNode'
import { CRootNodeDataTypeDescribe, FunctionPropertyTypeDescribe } from './rootNode'


export type ComponentMetaType = {
    componentName: string
} & LibMetaType

export enum RenderType {
    PAGE = 'PAGE',
    COMPONENT = 'COMPONENT',
}

export type CPageDataType = {
    version: string
    name: string
    css?: CSSType[]
    renderType?: RenderType
    methods?: FunctionPropType[]
    componentsMeta: ComponentMetaType[]
    thirdLibs?: LibMetaType[]
    componentsTree: CRootNodeDataType
    // runtime render need
    assets?: AssetPackage[]
}

export const CPageDataTypeDescribe = object({
    version: string(),
    name: string(),
    css: optional(string()),
    renderType: optional(union([literal(RenderType.COMPONENT), literal(RenderType.PAGE)])),
    methods: optional(array(FunctionPropertyTypeDescribe)),
    componentsMeta: array(
        assign(
            object({
                componentName: string(),
            }),
            LibMetaTypeDescribe,
        ),
    ),
    thirdLibs: optional(ThirdLibTypeDescribe),
    componentsTree: CRootNodeDataTypeDescribe,
    assets: optional(array(any())),
})
