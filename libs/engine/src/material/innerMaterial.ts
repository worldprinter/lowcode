import { capitalize } from 'lodash-es'

import type { CMaterialPropsType, CMaterialType } from '@worldprinter/lowcode-model'
import { HTMl_TAGS } from '@worldprinter/lowcode-model'





const customAttributesMeta: CMaterialPropsType[number] = {
    name: '$$attributes',
    title: '属性',
    valueType: 'object',
    setters: [
        {
            componentName: 'ArraySetter',
            props: {
                item: {
                    setters: [
                        {
                            componentName: 'ShapeSetter',
                            props: {
                                elements: [
                                    {
                                        name: 'key',
                                        title: '属性名',
                                        valueType: 'string',
                                        setters: ['StringSetter'],
                                    },
                                    {
                                        name: 'value',
                                        title: '值',
                                        valueType: 'string',
                                        setters: [
                                            'StringSetter',
                                            'NumberSetter',
                                            'JSONSetter',
                                            'FunctionSetter',
                                            'ExpressionSetter',
                                        ],
                                    },
                                ],
                                collapse: false,
                            },
                            initialValue: {},
                        },
                    ],
                    initialValue: {},
                },
            },
            initialValue: [],
        },
    ],
}

const widthPropsMeta: CMaterialPropsType[number] = {
    name: 'width',
    title: '宽度',
    valueType: 'string',
    setters: ['StringSetter', 'ExpressionSetter'],
}

const heightPropsMeta: CMaterialPropsType[number] = {
    name: 'height',
    title: '高度',
    valueType: 'string',
    setters: ['StringSetter', 'ExpressionSetter'],
}

const htmlNativeComponentMeta = HTMl_TAGS.map((tag) => {
    const DivMeta: CMaterialType = {
        title: capitalize(tag),
        componentName: tag,
        props: [customAttributesMeta],
        snippets: [],
    }

    return DivMeta
})

const BaseComponentMeta: CMaterialType[] = [
    {
        title: '块',
        componentName: 'CBlock',
        props: [
            widthPropsMeta,
            heightPropsMeta,
            {
                name: 'children',
                title: '文本',
                valueType: 'string',
                setters: ['StringSetter', 'ExpressionSetter'],
            },
            customAttributesMeta,
        ],
        groupName: '原子组件',
        snippets: [
            {
                title: '块',
                snapshotText: 'Block',
                category: '基础组件',
                schema: {
                    props: {
                        width: '100%',
                        height: '100px',
                    },
                },
            },
        ],
    },
    {
        title: '容器',
        componentName: 'CContainer',
        isContainer: true,
        props: [
            widthPropsMeta,
            heightPropsMeta,
            {
                name: 'afterMount',
                title: '渲染之后',
                valueType: 'function',
                setters: ['FunctionSetter', 'ExpressionSetter', 'TestSetter' as any],
            },
            {
                name: 'beforeDestroy',
                title: '销毁之前',
                valueType: 'function',
                setters: ['FunctionSetter', 'ExpressionSetter'],
            },
            customAttributesMeta,
        ],
        groupName: '原子组件',
        snippets: [
            {
                title: '容器',
                snapshotText: 'Con',
                category: '基础组件',
                schema: {
                    props: {
                        width: '100%',
                        height: '100px',
                    },
                },
            },
        ],
    },
    {
        title: '图片',
        componentName: 'CImage',
        props: [
            {
                name: 'src',
                title: '地址',
                valueType: 'string',
                setters: ['StringSetter', 'ExpressionSetter'],
            },
            widthPropsMeta,
            heightPropsMeta,
            customAttributesMeta,
        ],
        groupName: '原子组件',
        snippets: [
            {
                title: '图片',
                snapshotText: 'Img',
                category: '基础组件',
                schema: {
                    props: {
                        width: '300px',
                        height: '150px',
                    },
                },
            },
        ],
    },
    {
        title: '视频',
        componentName: 'CVideo',
        props: [
            {
                name: 'src',
                title: '地址',
                valueType: 'string',
                setters: ['StringSetter', 'ExpressionSetter'],
            },
            {
                name: 'autoPlay',
                title: '自动播放',
                valueType: 'string',
                setters: ['BooleanSetter', 'ExpressionSetter'],
            },
            {
                name: 'controls',
                title: '控制面板',
                valueType: 'string',
                setters: ['BooleanSetter', 'ExpressionSetter'],
                defaultValue: true,
            },
            widthPropsMeta,
            heightPropsMeta,
            customAttributesMeta,
        ],
        fixedProps: {
            autoPlay: false,
        },
        groupName: '原子组件',
        snippets: [
            {
                title: '视频',
                snapshotText: 'Video',
                category: '基础组件',
                schema: {
                    props: {
                        width: '300px',
                        height: '150px',
                        src: 'https://vjs.zencdn.net/v/oceans.mp4',
                    },
                },
            },
        ],
    },
    {
        title: '音频',
        groupName: '原子组件',
        componentName: 'CAudio',
        props: [
            {
                name: 'src',
                title: '地址',
                valueType: 'string',
                setters: ['StringSetter', 'ExpressionSetter'],
            },
            {
                name: 'autoPlay',
                title: '自动播放',
                valueType: 'string',
                setters: ['BooleanSetter', 'ExpressionSetter'],
            },
            {
                name: 'controls',
                title: '控制面板',
                valueType: 'string',
                setters: ['BooleanSetter', 'ExpressionSetter'],
            },
            widthPropsMeta,
            heightPropsMeta,
            customAttributesMeta,
        ],
        snippets: [
            {
                title: '音频',
                snapshotText: 'Audio',
                category: '基础组件',
                schema: {
                    props: {
                        src: 'https://vjs.zencdn.net/v/oceans.mp4',
                    },
                },
            },
        ],
    },
    {
        title: '文本',
        componentName: 'CText',
        groupName: '原子组件',
        props: [
            {
                name: 'content',
                title: '内容',
                valueType: 'string',
                setters: [{ componentName: 'StringSetter', initialValue: '文本内容' }, 'ExpressionSetter'],
            },
            customAttributesMeta,
        ],
        snippets: [
            {
                title: '文本',
                snapshotText: 'Text',
                category: '基础组件',
                schema: {
                    props: {},
                },
            },
        ],
    },
    {
        title: 'Canvas',
        componentName: 'CCanvas',
        props: [widthPropsMeta, heightPropsMeta, customAttributesMeta],
        groupName: '原子组件',
        snippets: [
            {
                title: '画布',
                snapshotText: 'Cavs',
                category: '基础组件',
                schema: {
                    props: {
                        width: '300px',
                        height: '150px',
                    },
                },
            },
        ],
    },
    {
        title: 'HTML 标签',
        componentName: 'CNativeTag',
        props: [
            {
                name: 'htmlTag',
                title: '标签名',
                valueType: 'string',
                setters: [
                    {
                        componentName: 'SelectSetter',
                        props: {
                            options: HTMl_TAGS.map((tag) => {
                                return {
                                    name: tag,
                                    value: tag,
                                }
                            }),
                        },
                    },
                ],
            },
            customAttributesMeta,
        ],
        isContainer: true,
        groupName: '原子组件',
        snippets: [
            {
                title: 'HTML',
                snapshotText: 'HTML',
                category: '基础组件',
                schema: {
                    props: {
                        htmlTag: 'div',
                    },
                },
            },
        ],
    },
]

export const InnerComponentMeta = [...BaseComponentMeta, ...htmlNativeComponentMeta]
