import type { CNode, CPage, CProp, CRootNode, CSlot } from '@worldprinter/lowcode-model'
import { isNodeModel } from '@worldprinter/lowcode-model'

export const getClosestNodeList = (node: CNode | CRootNode, level = 5) => {
    const res = []
    let count = 0
    let currentNode: CNode | CRootNode | CSlot | CProp | CPage | null = node

    while (count < level && currentNode) {
        if (isNodeModel(currentNode)) {
            res.push(currentNode)
            count++
        }

        currentNode = currentNode.parent || null
    }

    return res
}
