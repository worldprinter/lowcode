import type { CPageDataType } from '../types/page'

export const BasePage: CPageDataType = {
    version: '1.0.0',
    name: 'BaseDemoPage',
    componentsMeta: [],
    componentsTree: {
        componentName: 'RootContainer',
        props: {
            a: 1,
        },
        state: {
            b: 2,
            buttonVisible: true,
            modalVisible: false,
        },
        configure: {
            propsSetter: {},
            advanceSetter: {},
        },
        children: [],
    },
    assets: [],
}
