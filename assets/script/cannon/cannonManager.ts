
import { _decorator, Component, Node, Prefab, error } from 'cc';
import { PoolManager } from '../utils/poolManager';
import { ResourceUtil } from '../utils/resourceUtil';
const { ccclass, property } = _decorator;

@ccclass('CannonManager')
export class CannonManager {

    /**
     * 
     * @param name 炮台预制名称
     * @returns 
     */
    public static getCannon(name: string): Promise<Node> {
        return new Promise(resolve => {
            let cannon: Node = PoolManager.getNodeBy(name);
            if (cannon) {
                resolve(cannon);
                return;
            }
            ResourceUtil.getCannonPrefab(name, (err: any, cannonPre: Prefab) => {
                if (err) {
                    error(err.message || err);
                    resolve(null);
                }
                cannon = PoolManager.getNode(cannonPre);
                resolve(cannon);
            });
        });
    }

}