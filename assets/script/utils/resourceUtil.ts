
import { _decorator, Prefab, error, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResourceUtil')
export class ResourceUtil {
    /**
     * 加载资源
     * @param url   资源路径
     * @param type  资源类型
     * @param cb    回调
     * @method loadRes
     */
    public static loadRes(url: string, type: any, cb: Function) {
        resources.load(url, (err: any, res: any) => {
            if (err) {
                error(err.message || err);
                cb(err, res);
                return;
            }
            cb(null, res);
        });
    }

    /**
     * 加载鱼预制
     * @param preFishName 
     * @param cb 
     */
    public static getFishPrefab(preFishName: string, cb?: Function) {
        this.loadRes(`prefab/fish/${preFishName}`, Prefab, cb);
    }

    /**
     * 加载子弹预制
     * @param preFishName 
     * @param cb 
     */
    public static getBulletPrefab(preBulletName: string, cb?: Function) {
        this.loadRes(`prefab/bullet/${preBulletName}`, Prefab, cb);
    }

    /**
     * 加载鱼网预制
     * @param preFishName 
     * @param cb 
     */
    public static getFishNetPrefab(preFishName: string, cb?: Function) {
        this.loadRes(`prefab/fishnet/${preFishName}`, Prefab, cb);
    }

    /**
     * 加载炮台预制
     * @param preFishName 
     * @param cb 
     */
    public static getCannonPrefab(preCannnonName: string, cb?: Function) {
        this.loadRes(`prefab/cannon/${preCannnonName}`, Prefab, cb);
    }
}


