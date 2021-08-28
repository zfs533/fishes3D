
import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
import { Bullet } from '../bullet/bullet';
import { BulletManager } from '../bullet/bulletManager';
import EventManager from '../utils/eventManager';
import { TouchManager } from '../utils/touchManager';
import { addNodeToBulletLayer } from '../utils/util';
const { ccclass, property } = _decorator;

@ccclass('Cannon')
export class Cannon extends Component {
    private _bulletPos: Vec3 = null;

    onLoad() {
        EventManager.Inst.on(EventManager.EvtTouchShootEvent, this._evtTouchShootEvent.bind(this), this);
        TouchManager.addTouchEvents(EventManager.EvtTouchShootEvent);
    }

    /**
     * 发射子弹
     * @param pos 屏幕世界坐标(Vec2)
     */
    private async _evtTouchShootEvent(pos: Vec2) {
        this._setRotateXZ(pos, this.node.getWorldPosition());
        let bullet: Node = await BulletManager.getBullet("bullet");
        if (bullet) {
            this._bulletPos = this.node.getChildByName('bulletPos').getWorldPosition();
            bullet.getComponent(Bullet).shoot(pos, this._bulletPos);
            addNodeToBulletLayer(bullet);
        }
    }

    /**
     *  角度朝向
     * @param p1 
     * @param p3 
     */
    _setRotateXZ(p1: Vec2, p3: Vec3) {
        let p2: Vec2 = new Vec2(p3.x, p3.y);
        let yy = p1.y - p2.y;
        let xx = p1.x - p2.x;
        let radian: number = Math.atan2(yy, xx);
        let angle: number = radian * 180 / Math.PI;
        this.node.eulerAngles = new Vec3(0, 0, angle - 90);
    }

}
