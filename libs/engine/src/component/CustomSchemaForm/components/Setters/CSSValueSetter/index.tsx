import { useDebounceFn } from 'ahooks'
import { AutoComplete, ConfigProvider } from 'antd'
import clsx from 'clsx'
import type { BaseSelectRef } from 'rc-select'
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'

import type { CSSPropertiesKey } from '../../../../CSSPropertiesEditor/cssProperties'
import { CSSProperties } from '../../../../CSSPropertiesEditor/cssProperties'
import type { CSetter, CSetterProps } from '../type'
import styles from './style.module.scss'

type CSSValueSetterProps = {
    propertyKey: string
}

export const CSSValueSetter: CSetter<CSSValueSetterProps> = ({
    onValueChange,
    setterContext,
    propertyKey = '',
    value,
    ...props
}: CSetterProps<CSSValueSetterProps>) => {
    const { keyPaths, onSetterChange } = setterContext
    const propertyValueRef = useRef<BaseSelectRef | null>(null)
    const [innerValue, setInnerVal] = useState<any>(value || '')
    const [focusState, setFocusState] = useState(false)
    const updateOuterValue = () => {
        onValueChange?.(innerValue)
    }
    useLayoutEffect(() => {
        setInnerVal(value)
    }, [value])
    const { run: updateOuterValueDebounce } = useDebounceFn(updateOuterValue, {
        wait: 10,
    })

    const optionsValue = useMemo(() => {
        const list = CSSProperties[propertyKey as unknown as CSSPropertiesKey]?.values || []
        return list.map((el) => {
            return {
                value: el,
            }
        })
    }, [propertyKey])

    return (
        <ConfigProvider
            theme={{
                token: {
                    borderRadius: 4,
                },
            }}
        >
            <AutoComplete
                ref={propertyValueRef}
                dropdownMatchSelectWidth={200}
                bordered={false}
                value={innerValue}
                onChange={(val) => {
                    setInnerVal(val)
                    updateOuterValueDebounce()
                }}
                style={{
                    flex: 1,
                }}
                onFocus={() => {
                    setFocusState(true)
                }}
                onBlur={() => {
                    setFocusState(false)
                }}
                className={clsx([styles.inputAuto, focusState && styles.active])}
                placeholder='value'
                options={optionsValue}
            ></AutoComplete>
        </ConfigProvider>
    )
}

CSSValueSetter.setterName = 'CSS 值设置器'
