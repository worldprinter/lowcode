import type { InputProps } from 'antd'
import { ConfigProvider, Input } from 'antd'
import React from 'react'

import type { CSetter, CSetterProps } from '../type'

export const StringSetter: CSetter<InputProps> = ({
    onValueChange,
    initialValue,
    ...props
}: CSetterProps<InputProps>) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    borderRadius: 4,
                },
            }}
        >
            <Input
                {...props}
                value={props.value ?? initialValue}
                onChange={(e) => {
                    props.onChange?.(e)
                    onValueChange?.(e.target.value)
                }}
            />
        </ConfigProvider>
    )
}

StringSetter.setterName = '字符设置器'
