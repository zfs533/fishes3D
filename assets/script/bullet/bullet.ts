
import { _decorator, Component, Node, Vec3, Vec2, UITransform, BoxCollider, ITriggerEvent } from 'cc';
import { FishAnim } from '../fish/fishAnim';
import { ScreenBorder } from '../utils/enum';
import EventManager from '../utils/eventManager';
import { PoolManager } from '../utils/poolManager';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    @property
    first: number = 0;

    @property
    end: number = 0;

    @property
    headName: string = "";
    private _speed: number = 12;
    private _isMove: boolean = true;
    private _radian: number = 0;
    private _isBorder = false;
    onLoad() {
        this._hideNormalState();
        this.node.getChildByName("node").getChildByName(this.headName + 5).active = true;
        //物理碰撞检测
        let collider: BoxCollider = this.node.getChildByName("collider").getComponent(BoxCollider) as BoxCollider;
        collider.on("onTriggerEnter", this._onTriggerEnter, this);
    }

    _hideNormalState() {
        for (let i = this.first; i <= this.end; i++) {
            this.node.getChildByName("node").getChildByName(this.headName + i).active = false;
        }
    }

    /**
     * 碰撞检测(鱼🐟)
     * @param event 
     */
    private _onTriggerEnter(event: ITriggerEvent) {
        let fishNode = event.otherCollider.node.parent;
        // let fish: FishAnim = event.otherCollider.node.parent.getComponent(FishAnim);
        this._destroySelf();
        EventManager.Inst.dispatchEvent(EventManager.EvtFishNet, fishNode.getWorldPosition());
    }

    init() {
    }

    /**
     * 移动
     */
    update() {
        if (this._isMove) {
            let pos = this.node.getWorldPosition();
            let xx = pos.x + Math.cos(this._radian) * this._speed;
            let yy = pos.y + Math.sin(this._radian) * this._speed;
            this.node.setWorldPosition(new Vec3(xx, yy, 0));
        }
        this._jugeBorder();
    }

    /**
     * 发射子弹接口,通过事件触发
     * @param distination 
     * @param originPos 
     */
    public shoot(distination: Vec2, originPos: Vec3 = new Vec3(600, 400)) {
        this.init();
        this.node.setWorldPosition(originPos);
        let v3 = this.node.getWorldPosition();
        this._setRotateXZ(distination, v3);
        this._isMove = true;
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
        this._radian = radian;
        let angle: number = radian * 180 / Math.PI;
        this.node.eulerAngles = new Vec3(0, 0, angle);
    }

    /**
     * 越界判定
     */
    _jugeBorder() {
        let pos = this.node.getWorldPosition();
        if (pos.x < ScreenBorder.left && !this._isBorder) {
            this._isBorder = true;
            let angle: number = this._radian * 180 / Math.PI;
            angle += 180
            this._radian = -angle * Math.PI / 180;
            this.node.eulerAngles = new Vec3(0, 0, -angle);
            return;
        }

        if (pos.x > ScreenBorder.width && !this._isBorder) {
            this._isBorder = true;
            let angle: number = this._radian * 180 / Math.PI;
            angle -= 180
            this._radian = -angle * Math.PI / 180;
            this.node.eulerAngles = new Vec3(0, 0, -angle);
            return;
        }

        if (pos.y < ScreenBorder.down && !this._isBorder) {
            this._isBorder = true;
            let angle: number = this._radian * 180 / Math.PI;
            angle *= -1
            this._radian = angle * Math.PI / 180;
            this.node.eulerAngles = new Vec3(0, 0, angle);
            return;
        }

        if (pos.y > ScreenBorder.height && !this._isBorder) {
            this._isBorder = true;
            let angle: number = this._radian * 180 / Math.PI;
            angle *= -1
            this._radian = angle * Math.PI / 180;
            this.node.eulerAngles = new Vec3(0, 0, angle);
            return;
        }

        this._isBorder = false;
    }

    /**
     * 回收
     */
    _destroySelf() {
        this._isBorder = false;
        this._radian = 0;
        PoolManager.setNode(this.node);
    }
}


