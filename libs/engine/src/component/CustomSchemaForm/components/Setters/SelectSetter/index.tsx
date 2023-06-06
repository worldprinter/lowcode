import type { SelectProps } from 'antd'
import { ConfigProvider, Select } from 'antd'
import React from 'react'

import type { CSetter, CSetterProps } from '../type'

export const SelectSetter: CSetter<SelectProps> = ({
    onValueChange,
    setterContext,
    ...props
}: CSetterProps<SelectProps>) => {
    const { keyPaths, onSetterChange } = setterContext

    return (
        <ConfigProvider
            theme={{
                token: {
                    borderRadius: 4,
                },
            }}
        >
            <Select
                showSearch
                style={{
                    width: '100%',
                }}
                {...props}
                onChange={(val, option) => {
                    props.onChange?.(val, option)
                    onValueChange?.(val)
                }}
            />
        </ConfigProvider>
    )
}

SelectSetter.setterName = '选择设置器'
