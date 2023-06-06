/* eslint-disable @typescript-eslint/no-empty-function */
import type { Ref } from 'react'
import React from 'react'

import type { CustomSchemaFormInstance } from '.'
import type { CPluginCtx } from '../../core/pluginManager'
import type { CForm } from './components/Form'

export type ContextState = Record<string, any>

export type CCustomSchemaFormContextData = {
    onSetterChange: (keyPaths: string[], setterName: string) => void
    defaultSetterConfig: Record<string, { name: string; setter: string }>
    formRef?: Ref<CustomSchemaFormInstance | CForm>
    pluginCtx?: CPluginCtx
}

export const CCustomSchemaFormContext = React.createContext<CCustomSchemaFormContextData>({
    defaultSetterConfig: {},
    onSetterChange: () => {},
})
