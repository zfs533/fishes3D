
import { _decorator, Component, Node, Vec3 } from 'cc';
import { CannonManager } from '../cannon/cannonManager';
import { FishNet } from '../fishnet/fishNet';
import { FishNetManager } from '../fishnet/fishNetManager';
import EventManager from '../utils/eventManager';
import { addNodeToBulletLayer, addNodeToCannonLayer } from '../utils/util';
const { ccclass, property } = _decorator;

@ccclass('UiLayer')
export class UiLayer extends Component {
    @property([Node])
    cannonPos: Node[] = [];
    onLoad() {
        EventManager.Inst.on(EventManager.EvtFishNet, this._evtFishNet.bind(this));
    }

    start() {
        this._loadCannon();
    }

    private async _loadCannon() {
        let cannon: Node = await CannonManager.getCannon("cannon0");
        if (cannon) {
            cannon.setWorldPosition(this.cannonPos[0].getWorldPosition());
            addNodeToCannonLayer(cannon);
        }
    }

    /**
     * 实例化鱼网
     * @param pos 屏幕世界坐标(Vec3)
     */
    private async _evtFishNet(pos: Vec3) {
        let fishnet: Node = await FishNetManager.getFishNet('fishnet');
        if (fishnet) {
            fishnet.getComponent(FishNet).setPos(pos);
            addNodeToBulletLayer(fishnet);
        }
    }
}