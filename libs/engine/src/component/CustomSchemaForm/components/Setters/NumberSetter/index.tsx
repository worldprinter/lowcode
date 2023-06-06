import type { InputNumberProps } from 'antd'
import { ConfigProvider, InputNumber } from 'antd'
import React from 'react'

import type { CSetter, CSetterProps } from '../type'

export const NumberSetter: CSetter<InputNumberProps> = ({
    onValueChange,
    setterContext,
    ...props
}: CSetterProps<InputNumberProps>) => {
    const { keyPaths, onSetterChange } = setterContext

    return (
        <ConfigProvider
            theme={{
                token: {
                    borderRadius: 4,
                },
            }}
        >
            <InputNumber
                style={{
                    width: '100%',
                }}
                {...props}
                onChange={(value) => {
                    props.onChange?.(value)
                    onValueChange?.(value)
                }}
            />
        </ConfigProvider>
    )
}

NumberSetter.setterName = '数字设置器'
