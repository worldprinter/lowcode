import { ConfigProvider } from 'antd'
import type { Ref } from 'react'
import React from 'react'

import type { CMaterialPropsType } from '@worldprinter/lowcode-model'
import { getMTitle, getMTitleTip, isSpecialMaterialPropType } from '@worldprinter/lowcode-model'

import type { CPluginCtx } from '../../core/pluginManager'
import { CForm } from './components/Form'
import type { CFormContextData } from './components/Form/context'
import { SetterSwitcher } from './components/SetterSwitcher'
import { CCustomSchemaFormContext } from './context'
import styles from './style.module.scss'
import { getSetterList } from './utils'


export type CustomSchemaFormInstance = CForm

export type CustomSchemaFormProps = {
    pluginCtx?: CPluginCtx
    initialValue: Record<string, any>
    properties: CMaterialPropsType<any>
    onValueChange?: (val: any) => void
    onSetterChange: (keyPaths: string[], setterName: string) => void
    /** 存储每个字段上次使用的 setter */
    defaultSetterConfig: Record<string, { name: string; setter: string }>
    customSetterMap?: CFormContextData['customSetterMap']
}

const CustomSchemaFormCore = (props: CustomSchemaFormProps, ref: Ref<CustomSchemaFormInstance | CForm>) => {
    const {
        properties: originProperties,
        initialValue,
        onValueChange,
        onSetterChange,
        defaultSetterConfig,
        pluginCtx,
        customSetterMap,
    } = props
    const properties: CMaterialPropsType = originProperties
    return (
        <CCustomSchemaFormContext.Provider
            value={{
                defaultSetterConfig,
                onSetterChange,
                formRef: ref,
                pluginCtx: pluginCtx,
            }}
        >
            <ConfigProvider
                theme={{
                    token: {
                        borderRadius: 4,
                    },
                }}
            >
                <div
                    className={styles.CFromRenderBox}
                    style={{
                        overflow: 'auto',
                        height: '100%',
                    }}
                >
                    <CForm
                        ref={ref as any}
                        name='root-form'
                        initialValue={initialValue}
                        customSetterMap={customSetterMap}
                        onValueChange={(val) => {
                            onValueChange?.(val)
                        }}
                    >
                        {properties.map((property) => {
                            if (isSpecialMaterialPropType(property)) {
                                property.content
                            } else {
                                const title = getMTitle(property.title)
                                const tip = getMTitleTip(property.title)
                                const setterList = getSetterList(property.setters)
                                const keyPaths = [property.name]
                                return (
                                    <SetterSwitcher
                                        key={property.name}
                                        condition={property.condition}
                                        keyPaths={keyPaths}
                                        setters={setterList}
                                        label={title}
                                        name={property.name || ''}
                                        tips={tip}
                                    />
                                )
                            }
                        })}
                    </CForm>
                </div>
            </ConfigProvider>
        </CCustomSchemaFormContext.Provider>
    )
}

export const CustomSchemaForm = React.forwardRef(CustomSchemaFormCore)
