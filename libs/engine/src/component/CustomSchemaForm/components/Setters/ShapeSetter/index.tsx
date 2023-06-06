import { ConfigProvider } from 'antd'
import React, { useEffect, useRef } from 'react'

import type { MaterialPropType } from '@worldprinter/lowcode-model'
import { getMTitle, getMTitleTip } from '@worldprinter/lowcode-model'

import { getSetterList } from '../../../utils'
import { CForm } from '../../Form'
import { SetterSwitcher } from '../../SetterSwitcher'
import type { CSetter, CSetterProps } from '../type'

export type CShapeSetterProps = {
    elements: MaterialPropType[]
    initialValue?: Record<string, any>
    value: Record<string, any>
}

export const ShapeSetter: CSetter<CShapeSetterProps> = ({
    onValueChange,
    elements,
    value,
    setterContext,
}: CSetterProps<CShapeSetterProps>) => {
    const { keyPaths } = setterContext
    const formRef = useRef<CForm>(null)
    useEffect(() => {
        formRef.current?.setFields(value || {})
    }, [value])

    return (
        <ConfigProvider
            theme={{
                token: {
                    borderRadius: 4,
                },
            }}
        >
            <CForm
                ref={formRef}
                name={keyPaths.join('.')}
                initialValue={value || {}}
                onValueChange={(val) => {
                    onValueChange?.(val)
                }}
                customSetterMap={{}}
            >
                {elements.map((el, index) => {
                    const setters = getSetterList(el.setters)
                    const title = getMTitle(el.title)
                    const tip = getMTitleTip(el.title)
                    return (
                        <div key={index}>
                            <SetterSwitcher
                                name={el.name}
                                label={title}
                                tips={tip}
                                condition={el.condition}
                                keyPaths={[...keyPaths, el.name]}
                                setters={setters}
                            />
                        </div>
                    )
                })}
            </CForm>
        </ConfigProvider>
    )
}

ShapeSetter.setterName = '对象设置器'
