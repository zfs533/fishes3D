
import { _decorator, Component, Node } from 'cc';
import { DataManager } from '../data/dataManager';
import { infish } from '../data/fishData';
import { FishAnim } from './fishAnim';
import { FishManager } from './fishManager';
const { ccclass, property } = _decorator;

@ccclass('FishLayer')
export class FishLayer extends Component {
    onLoad() {
    }
    async start() {
        this.schedule(this.test.bind(this), 0.2);
        this.test();
    }
    async test() {
        if (!FishManager.fishPath) return;
        // let fishDt: infish = DataManager.getRandomFishData();
        let fishDt: infish = DataManager.getFishDataById(9);
        if (fishDt.type > 0) {
            let fish: Node = await FishManager.getFish(fishDt.nodeName);
            if (fish) {
                fish.getComponent(FishAnim).run();
                this.node.addChild(fish);
            }
        }
    }
}

