import type { SetterBasicType, SetterObjType, SetterType } from '@worldprinter/lowcode-model'





export const getSetterList = <T extends SetterBasicType = ''>(setters: SetterType<T>[] = []): SetterObjType<T>[] => {
    return setters.map((setter) => {
        if (typeof setter === 'string') {
            return {
                componentName: setter as any,
            }
        } else {
            return setter
        }
    })
}
