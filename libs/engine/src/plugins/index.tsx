import type { CPlugin } from '../core/pluginManager'
import { ComponentLibPlugin } from './ComponentLibrary'
import { DesignerPlugin, type DesignerExports } from './Designer'
import { DisplaySourceSchema } from './DisplaySourceSchema'
import { GlobalStatePanelPlugin } from './GlobalStatePanel'
import { HistoryPlugin } from './History'
import { OutlineTreePlugin } from './OutlineTree'
import { RightPanelPlugin } from './RightPanel'


export const DEFAULT_PLUGIN_LIST: CPlugin[] = [
    DesignerPlugin,
    OutlineTreePlugin,
    ComponentLibPlugin,
    GlobalStatePanelPlugin,
    RightPanelPlugin,
    HistoryPlugin,
]

export type { DesignerExports }
export {
    DesignerPlugin,
    ComponentLibPlugin,
    RightPanelPlugin,
    GlobalStatePanelPlugin,
    HistoryPlugin,
    DisplaySourceSchema,
}
