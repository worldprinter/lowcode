import { ConfigProvider, Input } from 'antd'
import type { TextAreaProps } from 'antd/es/input'
import React from 'react'

import type { CSetter, CSetterProps } from '../type'

export const TextAreaSetter: CSetter<TextAreaProps> = ({
    onValueChange,
    setterContext,
    ...props
}: CSetterProps<TextAreaProps>) => {
    const { keyPaths, onSetterChange } = setterContext
    return (
        <ConfigProvider
            theme={{
                token: {
                    borderRadius: 4,
                },
            }}
        >
            <Input.TextArea
                {...props}
                onChange={(e) => {
                    props.onChange?.(e)
                    onValueChange?.(e.target.value)
                }}
            />
        </ConfigProvider>
    )
}

TextAreaSetter.setterName = '长文本设置器'
