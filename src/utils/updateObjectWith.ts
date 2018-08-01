import { mergeWith } from 'lodash';

export function updateObjectWith<TObject, TSource>(
    target: TObject,
    source: TSource,
    allowedKeys: string[]
) {
    return mergeWith(
        target,
        source,
        (objValue: any, srcValue: any, key: string) => {
            if (key in allowedKeys) {
                return objValue;
            }
            return srcValue;
        }
    );
}
