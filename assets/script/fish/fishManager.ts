
import { _decorator, Component, Node, Prefab, error, instantiate, director } from 'cc';
import { PoolManager } from '../utils/poolManager';
import { ResourceUtil } from '../utils/resourceUtil';
import { addNodeToFishLayer } from '../utils/util';
import { FishPathes } from './fishPathes';
const { ccclass, property } = _decorator;

@ccclass('FishManager')
export class FishManager {

    public static index: number = 0;

    //鱼儿路径类,全局使用
    public static fishPath: FishPathes = null;

    public static init() {
        this.getFishPath();
    }
    /**
     * 
     * @param name 鱼儿预制名称
     * @returns 
     */
    public static getFish(name: string): Promise<Node> {
        return new Promise(resolve => {
            let fish: Node = PoolManager.getNodeBy(name);
            if (fish) {
                resolve(fish);
                return;
            }
            ResourceUtil.getFishPrefab(name, (err: any, fishPre: Prefab) => {
                if (err) {
                    error(err.message || err);
                    resolve(null);
                }
                let fish: Node = PoolManager.getNode(fishPre);
                resolve(fish);
            });
        });
    }

    /**
     * 加载鱼路径数据
     */
    public static getFishPath() {
        ResourceUtil.getFishPrefab('pathes', (err: any, fishPath: Prefab) => {
            if (err) {
                error(err.message || err);
                return;
            }
            let node = instantiate(fishPath);
            addNodeToFishLayer(node);
            this.fishPath = node.getComponent(FishPathes);
        });
    }
}
