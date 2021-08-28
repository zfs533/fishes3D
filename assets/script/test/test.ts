
import { _decorator, Component, Node, tween, Vec3, Vec2, BoxCollider, ITriggerEvent, Prefab, instantiate } from 'cc';
import { DataManager } from '../data/dataManager';
import { infish } from '../data/fishData';
import { FishAnim } from '../fish/fishAnim';
import { FishManager } from '../fish/fishManager';
import { AngleLocation } from '../utils/enum';
import { addNodeToFishLayer, copyVec3Array, getAngleLocation, jugementAngleLocation } from '../utils/util';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    @property(Prefab)
    pf: Prefab = null;

    private _isDebug: boolean = false;

    start() {
        // this._drawCircle();
        // this._spiral();
    }

    test() {

    }

    /**
     * 螺旋结构
     */
    async _spiral() {
        let path = [];
        let R2 = 10;
        for (let i = 0; i < 360 * 3.2; i += 5) {
            R2 += 2;
            let radian = i * Math.PI / 180;
            let xx = Math.cos(radian) * R2;
            let yy = Math.sin(radian) * R2;
            let pos = new Vec3(xx, yy);
            let node = instantiate(this.pf);
            node.setPosition(pos);
            path.push(pos);
            addNodeToFishLayer(node);
            node.active = false;
        }
        // return;
        this.schedule(async () => {
            let fishDt: infish = DataManager.getFishDataByName('fish0');
            if (fishDt.type > 0) {
                let fish: Node = await FishManager.getFish(fishDt.nodeName);
                if (fish) {
                    fish.getComponent(FishAnim).run(path);
                    addNodeToFishLayer(fish);
                }
            }
        }, 1);

        let centerX1 = -500;
        let centerY1 = 500;
        let v1 = new Vec3(centerX1, -centerY1, 0);
        let v2 = new Vec3(centerX1, centerY1, 0);
        let pathc = [v1, v2];
        v1 = new Vec3(-centerX1, centerY1, 0);
        v2 = new Vec3(-centerX1, -centerY1, 0);
        let pathd = [v1, v2];

        this.schedule(async () => {
            let fishDt = DataManager.getFishDataByName('fish9');
            if (fishDt.type > 0) {
                let fish: Node = await FishManager.getFish(fishDt.nodeName);
                if (fish) {
                    fish.getComponent(FishAnim).runLine((pathc));
                    fish.getComponent(FishAnim).setRotateZ(pathc[0], pathc[1]);
                    addNodeToFishLayer(fish);
                }
            }
            fishDt = DataManager.getFishDataByName('fish9');
            if (fishDt.type > 0) {
                let fish: Node = await FishManager.getFish(fishDt.nodeName);
                if (fish) {
                    fish.getComponent(FishAnim).runLine((pathd));
                    fish.getComponent(FishAnim).setRotateZ(pathd[0], pathd[1]);
                    addNodeToFishLayer(fish);
                }
            }
        }, 3);
    }

    /**
     * 圆圈,多环
     */
    _drawCircle() {
        // this._isDebug = true;
        let centerY1 = 130;
        let centerX1 = 450;
        let center = new Vec2(-centerX1, centerY1);
        let R = 220;
        let path1 = [];
        let path2 = [];
        let path3 = [];
        for (let i = 0; i < 360; i += 10) {
            let radian = i * Math.PI / 180;
            let xx = Math.cos(radian) * R + center.x;
            let yy = Math.sin(radian) * R + center.y;
            let pos = new Vec3(xx, yy);
            if (this._isDebug) {
                let node = instantiate(this.pf);
                node.setPosition(pos);
                addNodeToFishLayer(node);
            }
            path1.push(pos);
        }
        center = new Vec2(0, centerY1);
        for (let i = 0; i < 360; i += 10) {
            let radian = i * Math.PI / 180;
            let xx = Math.cos(radian) * R + center.x;
            let yy = Math.sin(radian) * R + center.y;
            let pos = new Vec3(xx, yy);
            if (this._isDebug) {
                let node = instantiate(this.pf);
                node.setPosition(pos);
                addNodeToFishLayer(node);
            }
            path2.push(pos);
        }
        center = new Vec2(centerX1, centerY1);
        for (let i = 0; i < 360; i += 10) {
            let radian = i * Math.PI / 180;
            let xx = Math.cos(radian) * R + center.x;
            let yy = Math.sin(radian) * R + center.y;
            let pos = new Vec3(xx, yy);
            if (this._isDebug) {
                let node = instantiate(this.pf);
                node.setPosition(pos);
                addNodeToFishLayer(node);
            }
            path3.push(pos);
        }
        let patha = [];
        let pathb = [];
        patha = path1.slice(0, path1.length / 2).reverse().concat(path2.slice(path2.length / 2 + 1, path2.length)).concat(path3.slice(0, path3.length / 2).reverse());
        pathb = path1.slice(path1.length / 2, path1.length).concat(path2.slice(0, path2.length / 2 - 1).reverse()).concat(path3.slice(path3.length / 2 + 1, path3.length));

        centerY1 = -300;
        let v1 = new Vec3(-700, centerY1, 0)
        let v2 = new Vec3(-690, centerY1, 0)
        let v3 = new Vec3(700, centerY1, 0)
        let pathc = [v1, v2, v3];
        centerY1 = -180;
        v1 = new Vec3(-700, centerY1, 0)
        v2 = new Vec3(-690, centerY1, 0)
        v3 = new Vec3(700, centerY1, 0)
        let pathd = [v1, v2, v3];

        // return;
        this.schedule(async () => {
            let fishDt: infish = DataManager.getFishDataByName('fish0');
            if (fishDt.type > 0) {
                let fish: Node = await FishManager.getFish(fishDt.nodeName);
                if (fish) {
                    fish.getComponent(FishAnim).run(patha);
                    addNodeToFishLayer(fish);
                }
            }
            fishDt = DataManager.getFishDataByName('fish0');
            if (fishDt.type > 0) {
                let fish: Node = await FishManager.getFish(fishDt.nodeName);
                if (fish) {
                    fish.getComponent(FishAnim).run(pathb);
                    addNodeToFishLayer(fish);
                }
            }

        }, 1);
        this.schedule(async () => {
            let fishDt = DataManager.getFishDataByName('fish9');
            if (fishDt.type > 0) {
                let fish: Node = await FishManager.getFish(fishDt.nodeName);
                if (fish) {
                    fish.getComponent(FishAnim).runLine((pathc));
                    addNodeToFishLayer(fish);
                }
            }
            fishDt = DataManager.getFishDataByName('fish9');
            if (fishDt.type > 0) {
                let fish: Node = await FishManager.getFish(fishDt.nodeName);
                if (fish) {
                    fish.getComponent(FishAnim).runLine((pathd));
                    addNodeToFishLayer(fish);
                }
            }
        }, 3);
    }


}
