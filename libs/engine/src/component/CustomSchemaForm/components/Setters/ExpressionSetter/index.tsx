import { ConfigProvider, Input } from 'antd'
import type { ChangeEventHandler } from 'react'

import { CNodePropsTypeEnum } from '@worldprinter/lowcode-model'

import type { CSetter, CSetterProps } from '../type'

export type ExpressionSetterProps = CSetterProps<{
    value: {
        type: string
        value: string
    }
    onChange: ChangeEventHandler<HTMLTextAreaElement>
}>

export const ExpressionSetter: CSetter<ExpressionSetterProps> = ({
    onValueChange,
    initialValue,
    ...props
}: ExpressionSetterProps) => {
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
                value={props.value?.value ?? (initialValue || '')}
                onChange={(e) => {
                    props.onChange?.(e)
                    onValueChange?.({
                        type: CNodePropsTypeEnum.EXPRESSION,
                        value: e.target.value,
                    })
                }}
            />
        </ConfigProvider>
    )
}

ExpressionSetter.setterName = '表达式设置器'
