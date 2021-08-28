
import { _decorator, Component, Node, error, Prefab } from 'cc';
import { PoolManager } from '../utils/poolManager';
import { ResourceUtil } from '../utils/resourceUtil';
const { ccclass, property } = _decorator;

@ccclass('FishNetManager')
export class FishNetManager {
    /**
     * 
     * @param name 鱼网预制名称
     * @returns 
     */
    public static getFishNet(name: string): Promise<Node> {
        return new Promise(resolve => {
            let fishNet: Node = PoolManager.getNodeBy(name);
            if (fishNet) {
                resolve(fishNet);
                return;
            }
            ResourceUtil.getFishNetPrefab(name, (err: any, fishPre: Prefab) => {
                if (err) {
                    error(err.message || err);
                    resolve(null);
                }
                let fish: Node = PoolManager.getNode(fishPre);
                resolve(fish);
            });
        });
    }
}