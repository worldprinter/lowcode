import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import type { RenderInstance } from '@worldprinter/lowcode-render'
import { Box, createStyles } from '@worldprinter/wdesign-core'

import type { DragAndDropEventType } from '../../core/dragAndDrop'
import { animationFrame, isDOM } from '../../utils'
import type { DropPosType } from './util'

export type HighlightCanvasRefType = {
    update: () => void
}

export type DropAnchorPropsType = {
    instance: RenderInstance
    toolRender?: React.ReactNode
    mouseEvent: DragAndDropEventType['dragging'] | null
    style?: React.CSSProperties
    getRef?: (ref: React.RefObject<HighlightCanvasRefType>) => void
    onRefDestroy?: (ref: React.RefObject<HighlightCanvasRefType>) => void
    onDropInfoChange?: (dropInfo: DropPosType | null) => void
    dropInfo: DropPosType
}

const useStyles = createStyles(() => ({
    highlightBox: {
        position: 'absolute',
        willChange: 'transform, width, height, left, right',
    },
    borderDrawBox: {
        position: 'absolute',
        left: '0',
        top: '0',
        height: '100%',
        width: '100%',
        zIndex: 99,
        pointerEvents: 'none',
    },
    toolBox: {
        position: 'absolute',
        right: '0',
        top: '-20px',
        border: '1px solid black',
        boxSizing: 'border-box',
    },
    horizontal: {
        '&.before': { borderLeft: '2px solid #1890ff' },
        '&.after': { borderRight: '2px solid #1890ff' },
    },
    vertical: {
        '&.before': { borderTop: '2px solid #1890ff' },
        '&.after': { borderBottom: '2px solid #1890ff' },
    },
    current: {
        border: 'none !important',
        backgroundColor: 'rgba($color: #0084ff, $alpha: 0.42)',
    },
}))

export const DropAnchor = ({
    instance,
    toolRender,
    getRef,
    onRefDestroy,
    style,
    mouseEvent,
    onDropInfoChange,
    dropInfo,
}: DropAnchorPropsType) => {
    const { classes, cx } = useStyles()
    const [styleObj, setStyleObj] = useState<Record<string, string>>({})
    const [posClassName, setPosClassName] = useState<string[]>([])
    const [rect, setRect] = useState<DOMRect>()
    const ref = useRef<HighlightCanvasRefType>(null)
    const [toolBoxSize, setToolBoxSize] = useState({
        width: 0,
        height: 0,
    })
    const toolBoxRef = useRef<HTMLDivElement>(null)
    const [targetDom, setTargetDom] = useState<HTMLElement>()
    useEffect(() => {
        getRef?.(ref)
        if (instance?._STATUS === 'DESTROY') {
            return
        }
        // eslint-disable-next-line react/no-find-dom-node
        const dom = ReactDOM.findDOMNode(instance)
        if (isDOM(dom)) {
            setTargetDom(dom as unknown as HTMLElement)
        }
        return () => {
            onRefDestroy?.(ref)
        }
    }, [])

    const updateRef = useRef<() => void>()
    updateRef.current = () => {
        const toolBoxDom = toolBoxRef.current
        const toolRect = toolBoxDom?.getBoundingClientRect()
        if (toolRect) {
            setToolBoxSize({
                width: toolRect.width,
                height: toolRect.height,
            })
        }
    }
    useEffect(() => {
        const handle = animationFrame(() => {
            updateRef.current?.()
        })

        return () => {
            handle()
        }
    }, [])

    // 绘制落点
    const updatePos = useCallback(() => {
        let instanceDom: HTMLElement | null = null
        if (instance?._STATUS === 'DESTROY') {
            return
        }

        // eslint-disable-next-line react/no-find-dom-node
        const dom = ReactDOM.findDOMNode(instance)
        if (isDOM(dom)) {
            instanceDom = dom as unknown as HTMLElement
            setTargetDom(instanceDom)
        } else {
            return
        }

        if (!mouseEvent) {
            onDropInfoChange?.(null)
            return null
        }

        const node = instance?._NODE_MODEL
        if (!node) {
            console.warn('node not exits')
            return
        }

        // target node dom rect
        const tempRect = instanceDom.getBoundingClientRect()
        setRect(tempRect)
        if (dropInfo.pos === 'current') {
            const transformStr = `translate3d(${tempRect?.left}px, ${tempRect.top}px, 0)`
            setStyleObj({
                width: `${tempRect.width}px`,
                height: `${tempRect.height}px`,
                transform: transformStr,
            })
        } else {
            const space = 2
            const transformStr = `translate3d(${tempRect?.left - space}px, ${tempRect.top - space}px, 0)`
            const tempObj = {
                width: tempRect?.width + space * 2 + 'px',
                height: tempRect?.height + space * 2 + 'px',
                transform: transformStr,
            }
            const toolBoxDom = document.getElementById(instance?._UNIQUE_ID || '')
            if (toolBoxDom) {
                toolBoxDom.style.transform = transformStr
                toolBoxDom.style.width = tempRect?.width + 'px'
                toolBoxDom.style.height = tempRect?.height + 'px'
            }
            setStyleObj(tempObj)
        }

        const classNameMap = {
            horizontal: classes.horizontal,
            vertical: classes.vertical,
            before: 'before',
            after: 'after',
            current: classes.current,
        }
        const classList = [classNameMap[dropInfo.direction], classNameMap[dropInfo.pos]]
        setPosClassName(classList)

        if (mouseEvent?.extraData.dropInfo) {
            dropInfo = {
                ...dropInfo,
                ...mouseEvent?.extraData.dropInfo,
            }
        }
        onDropInfoChange?.(dropInfo)
    }, [instance, mouseEvent])

    useEffect(() => {
        updatePos()
    }, [instance, mouseEvent])
    ;(ref as any).current = {
        update() {
            updatePos()
        },
    }

    if (!targetDom || !instance) {
        return <></>
    }
    return (
        <div
            className={cx([classes.highlightBox, ...posClassName])}
            id={instance?._UNIQUE_ID}
            style={{
                ...style,
                ...styleObj,
                opacity: rect ? 1 : 0,
            }}
        >
            {toolRender && (
                <Box
                    ref={toolBoxRef}
                    className={cx(classes.toolBox)}
                    style={{
                        top: `-${toolBoxSize.height + 5}px`,
                        opacity: toolBoxSize.width ? 1 : 0,
                    }}
                >
                    {toolRender}
                </Box>
            )}
        </div>
    )
}

export const DropAnchorCanvasCore = (
    {
        instances,
        toolRender,
        style,
        mouseEvent,
        dropInfos,
    }: {
        instances: RenderInstance[]
        mouseEvent: DragAndDropEventType['dragging'] | null
        toolRender?: React.ReactNode
        style?: React.CSSProperties
        onDropInfoChange?: (dropInfo: DropPosType | null) => void
        dropInfos: DropPosType[]
    },
    ref: React.Ref<HighlightCanvasRefType>,
) => {
    const { cx, classes } = useStyles()
    const [_, updateRender] = useState(0)
    const allBoxRef = useRef<React.RefObject<HighlightCanvasRefType>[]>([])
    useImperativeHandle(
        ref,
        () => {
            return {
                update() {
                    updateRender(_ + 1)
                    // 更新所有的高亮框位置
                    allBoxRef.current.forEach((el) => {
                        el.current?.update()
                    })
                },
            }
        },
        [updateRender, _],
    )
    const onRefDestroy = (ref: React.RefObject<HighlightCanvasRefType>) => {
        const list = allBoxRef.current || []
        allBoxRef.current = list.filter((el) => el !== ref)
    }

    return (
        <Box className={cx(`border-draw-box`, classes.borderDrawBox)}>
            {instances.map((el, index) => {
                if (!el) {
                    return null
                }
                return (
                    <DropAnchor
                        mouseEvent={mouseEvent}
                        style={style}
                        key={el?._UNIQUE_ID}
                        instance={el}
                        toolRender={toolRender}
                        dropInfo={dropInfos[index]}
                        getRef={(ref) => {
                            if (ref.current) {
                                allBoxRef.current.push(ref)
                            }
                        }}
                        onRefDestroy={onRefDestroy}
                    />
                )
            })}
        </Box>
    )
}

export const DropAnchorCanvas = React.forwardRef(DropAnchorCanvasCore)
