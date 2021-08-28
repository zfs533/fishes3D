
import { _decorator, Component, Node, tween, Vec3, Vec2 } from 'cc';
import { PoolManager } from '../utils/poolManager';
const { ccclass, property } = _decorator;

@ccclass('FishNet')
export class FishNet extends Component {
    @property
    first: number = 0;

    @property
    end: number = 0;

    @property
    headName: string = "";

    private _idx: number = 1;
    onLoad() {
        this._hideNormalState();
        this.node.getChildByName(this.headName + this._idx).active = true;
    }

    onEnable() {
        this._hideNormalState();
        this._idx = this.first + Math.floor(Math.random() * this.end);
        this.node.getChildByName(this.headName + this._idx).active = true;
        this._playAction();
    }

    _hideNormalState() {
        for (let i = this.first; i <= this.end; i++) {
            this.node.getChildByName(this.headName + i).active = false;
        }
    }

    /**
     * 设置位置,这个坐标是子弹消失的屏幕坐标
     * @param v3 
     */
    public setPos(v3: Vec3) {
        this.node.setPosition(v3);
    }

    private _playAction() {
        this.node.scale = new Vec3(1, 1, 1);
        tween(this.node).delay(0.5).to(0.3, { scale: new Vec3(0, 0, 0) }).call(() => {
            PoolManager.setNode(this.node);
        }).start();
    }
}

