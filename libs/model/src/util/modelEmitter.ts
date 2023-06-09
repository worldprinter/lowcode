import mitt from 'mitt'

import type { CPage, CPpageDataModelType } from '../Page'
import type { CRootNode, CRootNodeModelDataType } from '../Page/RootNode'
import type { CProp } from '../Page/RootNode//Node/prop'
import type { CNode, CNodeModelDataType } from '../Page/RootNode/Node'
import type { CPropDataType } from '../types/node'
import type { CPageDataType } from '../types/page'


export type DataModelEventType = {
    onPageChange: {
        value: CPageDataType | CPpageDataModelType
        preValue: CPageDataType | CPpageDataModelType
        node: CPage
    }
    onReloadPage: {
        value: CPageDataType | CPpageDataModelType
        preValue: CPageDataType | CPpageDataModelType
        node: CPage
    }
    onSchemaChange: any
    onNodeChange: {
        value: CNodeModelDataType | CRootNodeModelDataType
        preValue: CNodeModelDataType | CRootNodeModelDataType
        node: CNode | CRootNode
    }
    onPropChange: {
        value: CPropDataType
        preValue: CPropDataType
        node: CProp
    }
}

export const DataModelEmitter = mitt<DataModelEventType>()
