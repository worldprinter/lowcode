import { DeleteOutlined } from '@ant-design/icons'
import React, { useEffect, useRef } from 'react'

import type { SetterObjType } from '@worldprinter/lowcode-model'

import { CForm } from '../../Form'
import { SetterSwitcher } from '../../SetterSwitcher'

export function ArrayItem(props: {
    index: number
    keyPaths: string[]
    value: Record<string, any>
    setters: SetterObjType[]
    style: React.CSSProperties
    onValueChange: (val: Record<string, any>) => void
    onDelete: () => void
}) {
    const { index, keyPaths, setters } = props

    const style = {
        ...props.style,
    }
    const objectValue = {
        [index]: props.value,
    }
    const formRef = useRef<CForm>(null)
    useEffect(() => {
        formRef.current?.setFields({
            [index]: props.value,
        })
    }, [props.value])

    return (
        <div style={style}>
            <CForm
                ref={formRef}
                name={String(index)}
                initialValue={objectValue || {}}
                onValueChange={props.onValueChange}
                customSetterMap={{}}
            >
                <SetterSwitcher
                    suffix={
                        <div
                            onClick={props.onDelete}
                            style={{
                                marginLeft: '8px',
                                cursor: 'pointer',
                                fontSize: '12px',
                            }}
                        >
                            <DeleteOutlined />
                        </div>
                    }
                    name={String(index)}
                    label={`元素${index}`}
                    keyPaths={[...keyPaths, String(index)]}
                    setters={setters}
                ></SetterSwitcher>
            </CForm>
        </div>
    )
}
