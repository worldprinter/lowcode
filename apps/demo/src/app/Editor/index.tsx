import { Button, message, Modal } from 'antd'
import { get } from 'lodash-es'
import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMClient from 'react-dom/client'

import type { EnginContext } from '@worldprinter/lowcode-engine'
import { DEFAULT_PLUGIN_LIST, Engine, InnerComponentMeta, plugins } from '@worldprinter/lowcode-engine'
import type { LayoutPropsType } from '@worldprinter/lowcode-layout'
import { collectVariable, flatObject } from '@worldprinter/lowcode-layout'
import { BasePage } from '@worldprinter/lowcode-model'
import * as RawCRender from '@worldprinter/lowcode-render'
import { Box } from '@worldprinter/wdesign-core'

const win = window as any
win.React = React
win.ReactDOM = ReactDOM
win.ReactDOMClient = ReactDOMClient

const { DisplaySourceSchema } = plugins

function injectWindow(name: string, value: any, target?: any) {
    if (!target) {
        target = window
    }

    target[name] = value
}

const beforeInitRender: LayoutPropsType['beforeInitRender'] = async ({ iframe }) => {
    const subWin = iframe.getWindow()
    if (!subWin) {
        return
    }

    injectWindow('React', React, subWin)
    injectWindow('ReactDOM', ReactDOM, subWin)
    injectWindow('ReactDOMClient', ReactDOMClient, subWin)
    injectWindow('CRender', RawCRender, subWin)
}

const customRender: LayoutPropsType['customRender'] = async ({
    iframe: iframeContainer,
    assets,
    page,
    pageModel,
    ready,
}) => {
    const iframeWindow = iframeContainer.getWindow()!

    const iframeDoc = iframeContainer.getDocument()!
    const IframeReact = get(iframeWindow, 'React') as typeof React
    const IframeReactDOM = get(iframeWindow, 'ReactDOMClient') as typeof ReactDOMClient
    const CRender = (get(iframeWindow, 'CRender') as typeof RawCRender) || RawCRender

    if (!IframeReact || !IframeReactDOM || !CRender) {
        console.warn('请检查是否在 React StrictMode 下使用')
        return
    }

    // 注入组件物料资源
    const assetLoader = new CRender.AssetLoader(assets, {
        window: iframeWindow,
    })

    assetLoader
        .onSuccess(() => {
            // 从子窗口获取物料对象
            const componentCollection = collectVariable(assets, iframeWindow)
            const components = flatObject(componentCollection)

            const App = IframeReact?.createElement(CRender.DesignRender, {
                adapter: CRender?.ReactAdapter,
                page: page,
                pageModel: pageModel,
                components,
                onMount: (designRenderInstance) => {
                    ready(designRenderInstance)
                },
            })

            IframeReactDOM.createRoot(iframeDoc.getElementById('app')!).render(App)
        })
        .onError(() => {
            console.log('资源加载出错')
        })
        .load()
}

export const EditorPage = () => {
    const [ready, setReady] = React.useState(false)
    const [page, setPage] = React.useState(BasePage)

    React.useEffect(() => {
        const localPage = localStorage.getItem('pageSchema')
        if (localPage) {
            setPage(JSON.parse(localPage))
        }
        setReady(true)
    }, [])
    const onReady = React.useCallback(async (ctx: EnginContext) => {
        const designer = await ctx.pluginManager.onPluginReadyOk('Designer')
        const reloadPage = async () => {
            // setTimeout(() => {
            //     const designerExports = designer?.exports as plugins.DesignerExports
            //     console.log('to reload')
            //     designerExports.reload({
            //         assets: [],
            //     })
            // }, 0)
        }

        reloadPage()

        const workbench = ctx.engine.getWorkbench()

        workbench?.replaceTopBarView(
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '10px',
                }}
            >
                <DisplaySourceSchema
                    pageModel={ctx.engine.pageModel}
                    engineCtx={ctx}
                >
                    <Button style={{ marginRight: '10px' }}>Source Code</Button>
                </DisplaySourceSchema>

                <Button
                    style={{ marginRight: '10px' }}
                    onClick={() => {
                        reloadPage()
                    }}
                >
                    Refresh Page
                </Button>

                <Button
                    type='primary'
                    onClick={() => {
                        const newPage = ctx.engine.pageModel.export()
                        localStorage.setItem('pageSchema', JSON.stringify(newPage))
                        message.success('Save successfully')
                    }}
                >
                    Save
                </Button>
            </div>,
        )
    }, [])

    if (!ready) {
        return <>loading...</>
    }
    return (
        <Box
            sx={() => ({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
            })}
        >
            <Engine
                plugins={DEFAULT_PLUGIN_LIST}
                schema={page as any}
                material={[...InnerComponentMeta]}
                onReady={onReady}
                beforePluginRun={({ pluginManager }) => {
                    pluginManager.customPlugin('Designer', (pluginInstance) => {
                        pluginInstance.ctx.config.beforeInitRender = beforeInitRender
                        pluginInstance.ctx.config.customRender = customRender
                        return pluginInstance
                    })
                }}
            />
        </Box>
    )
}
