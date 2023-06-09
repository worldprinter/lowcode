import Editor from '@monaco-editor/react'
import { useUnmount } from 'ahooks'
import type * as monaco from 'monaco-editor'
import type { editor } from 'monaco-editor'
import type * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api'
import React from 'react'





export type Monaco = typeof monaco
export type MonacoEditorInstance = monacoEditor.editor.IStandaloneCodeEditor

export type MonacoEditorProps = {
    beforeMount?: (monaco: typeof monacoEditor) => void
    onDidMount?: (editor: MonacoEditorInstance) => void
    onChange?: (val: string, e: monaco.editor.IModelContentChangedEvent) => void
    onDidChangeMarkers?: (markers: monaco.editor.IMarker[]) => void
    options?: monaco.editor.IStandaloneEditorConstructionOptions
    override?: monaco.editor.IEditorOverrideServices
    initialValue?: string
    language?: 'json' | 'javascript' | 'typescript'
}

export const MonacoEditor = (props: MonacoEditorProps) => {
    const monacoRef = React.useRef<Monaco | null>(null)
    const editorRef = React.useRef<MonacoEditorInstance | null>(null)
    const subscriptionRef = React.useRef<monaco.IDisposable | null>(null)

    const defaultValue = React.useMemo(() => {
        return props.initialValue || props.options?.value
    }, [props.initialValue, props.options?.value])
    const language = React.useMemo(() => {
        return props.language || props.options?.language
    }, [props.language, props.options?.language])
    const options = React.useMemo(() => {
        return props.options
    }, [props.options])
    const override = React.useMemo(() => {
        return props.override
    }, [props.override])

    const onBeforeMount = React.useCallback(
        (monaco: Monaco) => {
            monacoRef.current = monaco
            props.beforeMount?.(monaco)
        },
        [props],
    )
    const onChange = React.useCallback(
        (value: string | undefined, ev: editor.IModelContentChangedEvent) => {
            props.onChange?.(value || '', ev)
        },
        [props],
    )

    useUnmount(() => {
        editorRef.current?.dispose()
        subscriptionRef.current?.dispose()
    })

    const onMount = React.useCallback(
        (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
            editorRef.current = editor
            props.onDidMount?.(editor)
            subscriptionRef.current = editor?.onDidChangeModelContent((event) => {
                if (!event.isFlush) {
                    onChange(editor.getValue(), event)
                }
            })

            monaco.editor.onDidChangeMarkers((uris) => {
                const editorModel = editor.getModel()
                if (!editorModel) {
                    return
                }
                const editorUri = editorModel.uri
                const changeUri = uris.find((el) => el.path === editorUri.path)
                if (changeUri) {
                    const res = monaco.editor.getModelMarkers({
                        resource: editorUri,
                    })
                    props.onDidChangeMarkers?.(res)
                }
            })
        },
        [onChange, props],
    )

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <Editor
                language={language}
                defaultValue={defaultValue}
                options={options}
                overrideServices={override}
                beforeMount={onBeforeMount}
                onMount={onMount}
                onChange={onChange}
            />
        </div>
    )
}
