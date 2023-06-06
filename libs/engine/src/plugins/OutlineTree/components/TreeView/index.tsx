import React from 'react'
import type { WithTranslation } from 'react-i18next'

import type { DropPosType, LayoutDragAndDropExtraDataType, SensorEventObjType } from '@worldprinter/lowcode-layout'
import { Sensor } from '@worldprinter/lowcode-layout'
import type { CNode, CRootNode } from '@worldprinter/lowcode-model'

import type { CPluginCtx } from '../../../../core/pluginManager'
import { LOGGER } from '../../../../utils/logger'
import type { DesignerExports } from '../../../Designer'
import { calculateDropPosInfo, getTargetMNodeKeyVal, transformPageSchemaToTreeData, traverseTree } from '../../util'
import type { ContextState } from './context'
import { CTreeContext, DragState } from './context'
import type { TreeNodeData } from './dataStruct'
import styles from './style.module.scss'
import { DRAG_ITEM_KEY, TreeNode } from './treeNode'

type TreeViewProps = {
    pluginCtx: CPluginCtx
    multiSelect?: boolean
} & WithTranslation

export class TreeView extends React.Component<
    TreeViewProps,
    ContextState & {
        dropPosInfo: { x: number; y: number } | null
    }
> {
    domRef: React.RefObject<HTMLDivElement>
    disposeCbList: (() => void)[] = []
    sensor?: Sensor

    constructor(props: TreeViewProps) {
        super(props)
        this.domRef = React.createRef<HTMLDivElement>()

        this.state = {
            treeData: [],
            currentSelectNodeKeys: [],
            expandKeys: [],
            multiSelect: props.multiSelect || false,
            dropPosInfo: {
                x: 0,
                y: 0,
            },
            pageModel: props.pluginCtx.pageModel,
            dragState: DragState.NORMAL,
        }
    }

    getDesignerHandler = async () => {
        const designerPluginInstance = await this.props.pluginCtx.pluginManager.get('Designer')
        const designerHandler: DesignerExports = designerPluginInstance?.exports
        return designerHandler
    }

    updateTreeDataFromNode = () => {
        const { pluginCtx } = this.props
        const { pageModel } = pluginCtx
        const plainTreeData = pageModel.export()
        const tempTreeData = transformPageSchemaToTreeData(plainTreeData, pageModel)
        this.setState({
            treeData: tempTreeData,
        })
    }

    getParentKeyPaths = (targetKey: string) => {
        const { treeData } = this.state
        let target: TreeNodeData = null as any
        traverseTree(treeData, (node) => {
            if (node.key === targetKey) {
                target = node
                return true
            }
            return false
        })
        if (target) {
            let tempNode = target?.parent as TreeNodeData | undefined | null
            const res = []
            while (tempNode) {
                if (tempNode.key) {
                    res.push(tempNode.key)
                }
                tempNode = tempNode.parent
            }
            return res
        } else {
            return []
        }
    }

    scrollNodeToView = (key: string) => {
        const dom = document.querySelector(`[${DRAG_ITEM_KEY}="${key}"]`)
        dom?.scrollIntoView?.({
            behavior: 'smooth',
            block: 'center',
        })
    }

    async componentDidMount() {
        this.updateTreeDataFromNode()
        const { pluginCtx } = this.props
        const { pageModel } = pluginCtx

        pageModel.emitter.on('*', () => {
            this.updateTreeDataFromNode()
        })

        pluginCtx.globalEmitter.on('onSelectNodeChange', ({ node }) => {
            if (!node) return
            this.toSelectTreeNode(node)
        })

        const workbench = pluginCtx.getWorkbench()

        workbench.emitter.on('leftPanelVisible', ({ visible, panelName }) => {
            if (visible && panelName === 'OutlineTree') {
                console.log('visible, panelName', visible, panelName)
                const currentSelectNode = pluginCtx.engine.getActiveNode()
                if (currentSelectNode) {
                    this.toSelectTreeNode(currentSelectNode)
                }
            }
        })

        const currentSelectNode = pluginCtx.engine.getActiveNode()
        if (currentSelectNode) {
            this.toSelectTreeNode(currentSelectNode)
        }

        await this.props.pluginCtx.pluginManager.onPluginReadyOk('Designer')
        this.registerDragEvent()
    }

    toSelectTreeNode = (node: CNode | CRootNode) => {
        const parentPaths = this.getParentKeyPaths(node.id)
        LOGGER.debug('onSelectNodeChange parent path', parentPaths, node)
        const newExpandKeys = Array.from(new Set([...this.state.expandKeys, ...parentPaths]))

        LOGGER.debug('onSelectNodeChange newExpandKeys', newExpandKeys, node)

        this.setState({
            currentSelectNodeKeys: [node.id],
            expandKeys: newExpandKeys,
        })

        setTimeout(() => {
            this.scrollNodeToView(node.id)
        }, 100)
    }

    containNode = (parentNode: TreeNodeData, targetNode: TreeNodeData) => {
        let res = null
        traverseTree(parentNode, (node) => {
            if (node.key === targetNode.key) {
                res = node
                return true
            }
            return false
        })
        return res
    }

    getTreeNodeByKey = (key: string): TreeNodeData | null => {
        const { treeData } = this.state
        let target: TreeNodeData | null = null
        traverseTree(treeData, (node) => {
            if (node.key === key) {
                target = node
                return true
            }
            return false
        })
        return target
    }

    registerDragEvent = async () => {
        if (!this.domRef.current) {
            return
        }
        const sensor = new Sensor({
            container: this.domRef.current,
            name: 'OutlineTree',
            eventPriority: 999,
        })
        const { pluginCtx } = this.props

        const pageModel = pluginCtx.pageModel
        const designerExports: DesignerExports = await this.getDesignerHandler()
        const dnd = designerExports.getDnd()
        sensor.setCanDrag(async (eventObj: SensorEventObjType) => {
            const targetDom = eventObj.event.target as HTMLDivElement
            if (!targetDom) {
                return
            }
            const targetNodeId = getTargetMNodeKeyVal(targetDom, DRAG_ITEM_KEY)

            if (!targetNodeId) {
                return
            }

            const targetNode = pageModel.getNode(targetNodeId)
            const targetTreeNode = this.getTreeNodeByKey(targetNodeId)
            // 判断当前节点是否可以在节点树上拖动，比如 jsslot 容器节点不能被拖动，大纲树特有
            if (targetTreeNode?.canDrag !== undefined && targetTreeNode?.canDrag === false) {
                return
            }

            // 判断节点本身是否可以拖动
            const designerInstance = designerExports.getInstance()
            const nodeDragFlag = await targetNode?.material?.value.advanceCustom?.onDrag?.(targetNode, {
                context: this.props.pluginCtx,
                event: null,
                viewPortal: designerInstance.getPortalViewCtx(),
            })
            // 节点不能拖动
            if (nodeDragFlag === false) {
                return false
            }

            if (!targetNode) {
                console.log('targetNode not found')
                return
            }

            return {
                ...eventObj,
                extraData: {
                    startNode: targetNode,
                } as LayoutDragAndDropExtraDataType,
            }
        })

        sensor.setCanDrop(async (eventObj: SensorEventObjType) => {
            const targetDom = eventObj.event.target as HTMLDivElement

            if (!targetDom) {
                LOGGER.debug('drop dom not found')
                return eventObj
            }
            const targetNodeId = getTargetMNodeKeyVal(targetDom, DRAG_ITEM_KEY)

            if (!targetNodeId) {
                LOGGER.debug('targetNodeId dom not found', eventObj, targetDom, DRAG_ITEM_KEY)
                return eventObj
            }
            const targetTreeNode = this.getTreeNodeByKey(targetNodeId)
            if (targetTreeNode?.canDrop !== undefined && targetTreeNode.canDrop === false) {
                LOGGER.debug('node can not be drop by tree node config')
                return eventObj
            }

            const targetNode = pageModel.getNode(targetNodeId)

            if (!targetNode) {
                LOGGER.debug('targetNode not found')
                return eventObj
            }
            const startNode = eventObj.extraData?.startNode as CNode
            if (!startNode) {
                LOGGER.debug('startNode not found')
                return eventObj
            }

            if (startNode?.id === targetNode.id) {
                LOGGER.debug('startNode and dropNode is the same')
                return eventObj
            }
            const hasContain = startNode.contains(targetNode.id)

            if (hasContain) {
                LOGGER.debug('startNode contain dropNode')
                return eventObj
            }

            const dropInfo = calculateDropPosInfo({
                point: eventObj.pointer,
                dom: targetDom,
            })

            if (Array.isArray(targetTreeNode?.canDrop) && !targetTreeNode?.canDrop.includes(dropInfo.pos)) {
                return eventObj
            }

            LOGGER.info('can dropNode', targetNode)

            const res = {
                ...eventObj,
                extraData: {
                    ...eventObj.extraData,
                    dropPosInfo: dropInfo,
                    dropNode: targetNode,
                    dropNodeUid: undefined,
                } as LayoutDragAndDropExtraDataType,
            }
            return res
        })

        dnd.registerSensor(sensor)

        sensor.emitter.on('dragging', (e) => {
            const dropNode = e.extraData.dropNode as CNode
            this.setState({
                dragState: DragState.DRAGGING,
            })

            if (!dropNode) {
                this.setState({
                    dropPosInfo: null,
                })
                return
            }
            const dropDom = document.querySelectorAll(`[${DRAG_ITEM_KEY}="${dropNode.id}"]`)?.[0]
            if (!dropDom) {
                return
            }
            const dropPosInfo = e.extraData?.dropPosInfo as DropPosType
            const rect = dropDom.getBoundingClientRect()
            const newDropInfo = { x: 0, y: 0 }

            newDropInfo.x = rect.x
            if (dropPosInfo.pos === 'before') {
                newDropInfo.y = rect.y
            } else if (dropPosInfo.pos === 'after') {
                newDropInfo.y = rect.y + rect.height
            } else {
                newDropInfo.y = rect.y + rect.height
                newDropInfo.x = rect.x + 20
            }
            this.setState({
                dropPosInfo: newDropInfo,
            })
        })

        sensor.emitter.on('dragEnd', () => {
            this.setState({
                dragState: DragState.NORMAL,
            })
        })
        this.sensor = sensor
    }

    render() {
        const { treeData, dragState, dropPosInfo } = this.state
        const { pluginCtx } = this.props

        return (
            <CTreeContext.Provider
                value={{
                    sensor: this.sensor,
                    state: this.state,
                    getDesignerHandler: this.getDesignerHandler,
                    onSelectNode: async ({ keys: sk }) => {
                        const designer = await pluginCtx.pluginManager.get('Designer')
                        if (!designer) {
                            console.warn('Designer is empty')
                            return
                        }
                        const nodeId = sk?.[0] || ''
                        const nn = pluginCtx.pageModel.getNode(nodeId)
                        const designerExports: DesignerExports = designer.exports
                        designerExports.selectNode(nodeId)
                        if (nn) {
                            pluginCtx.engine.updateCurrentSelectNode(nn)
                        }
                    },
                    updateState: (newVal) => {
                        this.setState(newVal as any)
                    },
                    onDeleteNode: (id) => {
                        pluginCtx.pageModel.deleteNodeById(id)
                    },
                    onCopyNode: (id) => {
                        pluginCtx.pageModel.copyNodeById(id)
                    },
                }}
            >
                <div
                    className={styles.contentBox}
                    ref={this.domRef}
                >
                    {treeData.map((item, index) => {
                        return (
                            <TreeNode
                                item={item}
                                key={item.key + `${index}`}
                            ></TreeNode>
                        )
                    })}
                    {dragState === DragState.DRAGGING && dropPosInfo && (
                        <div
                            className={styles.dropAnchorLine}
                            style={{
                                left: `${dropPosInfo.x}px`,
                                top: `${dropPosInfo.y}px`,
                            }}
                        ></div>
                    )}
                </div>
            </CTreeContext.Provider>
        )
    }
}