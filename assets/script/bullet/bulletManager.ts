
import { _decorator, Component, Node, Prefab, error } from 'cc';
import { PoolManager } from '../utils/poolManager';
import { ResourceUtil } from '../utils/resourceUtil';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager {
    /**
     * 
     * @param name 子弹预制名称
     * @returns 
     */
    public static getBullet(name: string): Promise<Node> {
        return new Promise(resolve => {
            let bullet: Node = PoolManager.getNodeBy(name);
            if (bullet) {
                resolve(bullet);
                return;
            }
            ResourceUtil.getBulletPrefab(name, (err: any, bulletPre: Prefab) => {
                if (err) {
                    error(err.message || err);
                    resolve(null);
                }
                bullet = PoolManager.getNode(bulletPre);
                resolve(bullet);
            });
        });
    }

}

