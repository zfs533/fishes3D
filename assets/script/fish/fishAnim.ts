
import { _decorator, Component, Node, Vec3, tween, Vec2, Tween, SystemEventType, SystemEvent, systemEvent, Collider, ITriggerEvent, Collider2D, RigidBody, PhysicsSystem, BoxCollider } from 'cc';
import { DataManager } from '../data/dataManager';
import { infish } from '../data/fishData';
import EventManager from '../utils/eventManager';
import { PoolManager } from '../utils/poolManager';
import { TouchManager } from '../utils/touchManager';
import { jugementAngleLocation } from '../utils/util';
import { FishManager } from './fishManager';
import { FishPathes } from './fishPathes';
const { ccclass, property } = _decorator;

@ccclass('FishAnim')
export class FishAnim extends Component {
    @property
    first: number = 0;

    @property
    end: number = 0;

    @property
    deathEnd: number = 0;

    @property
    headName: string = "";

    @property
    deathName: string = "";

    @property
    touchRect: number = 50;

    @property
    interver: number = 0.1;

    private _idx: number = 0;
    private _speed: number = 60;
    private _tween: Tween<any> = null;
    private _isDeath: boolean = false;
    private _pathes: Vec3[] = null;
    private _data: infish = null;
    private _nextTime: number = 0;
    private _fishPath: FishPathes = null;

    onLoad() {
        // this._fishPath = FishManager.fishPath;//this.node.parent.getChildByName('pathes').getComponent(FishPathes);
        // this._data = DataManager.getFishDataByName(this.node.name);
        this._addEventListener();
    }

    /**
     * 初始化数据(对象池取出来的fish)
     */
    _initData() {
        if (!this._data) {
            this._data = DataManager.getFishDataByName(this.node.name);
        }
        if (!this._fishPath) {
            this._fishPath = FishManager.fishPath;
        }
        this._tween = null;
        this._frameIdx = 0;
        this._count = 0;
        this.node.setScale(new Vec3(1, 1, 1));
        this.node.angle = 0;
        this._isDeath = false;
        this._hideNormalState();
        this._hideDeathState();
        //物理碰撞检测
        this.node.getChildByName("collider").getComponent(BoxCollider).enabled = true;
        this.node.getChildByName("collider").getComponent(RigidBody).enabled = true;
        let collider: BoxCollider = this.node.getChildByName("collider").getComponent(BoxCollider) as BoxCollider;
        collider.on("onTriggerEnter", this._onTriggerEnter, this);
    }

    /**
     * 注册事件
     */
    _addEventListener() {
        this._idx = FishManager.index++;
        EventManager.Inst.on(EventManager.EvtDeath + this._idx, this._evtDeath.bind(this));
        EventManager.Inst.on(EventManager.EvtTouchFishEvent + this._idx, this._handleTouchEvt.bind(this));
        TouchManager.addTouchEvents(EventManager.EvtTouchFishEvent + this._idx);
    }

    _hideNormalState() {
        for (let i = this.first; i <= this.end; i++) {
            this.node.getChildByName(this.headName + i).active = false;
        }
    }
    _hideDeathState() {
        for (let i = this.first; i <= this.deathEnd; i++) {
            this.node.getChildByName(this.deathName + i).active = false;
        }
    }

    /**
     * 死亡
     */
    _evtDeath() {
        this.node.getChildByName("collider").getComponent(BoxCollider).enabled = false;
        this.node.getChildByName("collider").getComponent(RigidBody).enabled = false;
        this._isDeath = true;
        this._tween.stop();
        this._tween = null;
        this._hideNormalState();
        this.scheduleOnce(() => {
            tween(this.node).to(0.2, { scale: new Vec3() }).call(() => {
                PoolManager.setNode(this.node);
                this._pathes = null;
            }).start();
        }, 0.7);
    }

    /**
     * 开始移动
     * @param pathes? Vec3[]
     */
    public run(pathes?: Vec3[]) {
        this._initData();
        if (!this._pathes) {
            // this._pathes = this._fishPath.getPath(this._data.path[0]);
            this._pathes = this._fishPath.getPath();
            if (pathes) {
                this._pathes = pathes;
            }
            this._startMove(0, this._pathes);
        }
    }

    /**
     * 开始移动,直线移动
     * @param pathes? Vec3[]
     */
    public runLine(pathes: Vec3[]) {
        this._initData();
        if (!this._pathes) {
            if (pathes) {
                this._pathes = pathes;
            }
            this._startMove(0, this._pathes, true);
        }
    }


    _handleTouchEvt(vc2: Vec2) {
        if (this._isDeath) return;
        // let screenPos: Vec2 = vc2;
        // let fishPos: Vec3 = this.node.getWorldPosition();
        // let v1 = Math.abs(screenPos.x - fishPos.x);
        // let v2 = Math.abs(screenPos.y - fishPos.y);
        // if (v1 <= this.touchRect && v2 <= this.touchRect) {
        //     this._evtDeath();
        // }
    }

    /**
     * 鱼儿随路线行走
     * @param roads Vec3[]
     * @param idx 索引
     * @param isLine 是否走直线
     */
    _startMove(idx, roads: Vec3[], isLine?: boolean) {
        let curPoint: Vec3 = roads[idx];
        if (idx == 0) {
            this.node.setPosition(curPoint);
            idx++;
            this._startMove(idx, roads, isLine);
        }
        else {
            let time = 4;
            let out: Vec3 = new Vec3();
            Vec3.subtract(out, roads[idx - 1], roads[idx]);
            let length = Vec3.len(out);
            time = length / this._speed;
            this._nextTime = time;
            if (!isLine) {
                this._setRotateXZ(idx, roads);
            }
            this._tween = tween(this.node).to(time, { position: roads[idx] }).call(() => {
                if (this._tween) {
                    idx++;
                    if (idx == roads.length) {
                        this._evtDeath();
                        return;
                    }
                    this._startMove(idx, roads, isLine);
                }
            }).start();
        }
    }

    /**
     * 通过缓动动画设置朝向
     * @param idx 
     * @param roads 
     */
    _setRotateXZ(idx: number, roads: Vec3[], isTween: boolean = true) {
        let p1: Vec2 = new Vec2(roads[idx].x, roads[idx].y);
        let p2: Vec2 = new Vec2(roads[idx - 1].x, roads[idx - 1].y);
        let radian: number = Math.atan2(-p2.y + p1.y, -p2.x + p1.x);
        let angle: number = radian * 180 / Math.PI;
        let tag = this.node.eulerAngles.z;
        let juge = jugementAngleLocation(tag, angle);
        let xx = this.node.eulerAngles.x;
        let yy = this.node.eulerAngles.y;
        let time = this._nextTime / 2;
        if (isTween) {
            if (juge) {
                tween(this.node).to(time / 2, { eulerAngles: new Vec3(xx, yy, juge.angle1) }).call(() => {
                    this.node.eulerAngles = new Vec3(xx, yy, juge.reAngle);
                    tween(this.node).to(time / 2, { eulerAngles: new Vec3(xx, yy, juge.end) }).start();
                }).start();
            }
            else {
                tween(this.node).to(time, { eulerAngles: new Vec3(xx, yy, angle) }).call(() => {
                }).start();
            }
        }
        else {
            this.node.angle = angle;
        }
    }

    /**
     * 设置朝向
     * @param v1 
     * @param v2 
     */
    public setRotateZ(v1: Vec3, v2: Vec3) {
        this._setRotateXZ(1, [v1, v2], false);
    }

    private _count: number = 0;
    private _frameIdx: number = 0;

    update(dt) {
        this._count += dt;
        if (this._count >= this.interver) {
            this._count = 0;
            this._actionSchedule();
        }
    }

    /**
     * 序列帧动画
     * @param idx 
     */
    _actionSchedule() {
        if (!this._isDeath) {
            if (this._frameIdx > this.end) {
                this._frameIdx = 0;
            }
            let idx = this._frameIdx;
            this._hideNormalState();
            this.node.getChildByName(this.headName + idx).active = true;
            this._frameIdx++
        }
        else {
            if (this._frameIdx > this.deathEnd) {
                this._frameIdx = 0;
            }
            let idx = this._frameIdx;
            this._hideDeathState();
            this.node.getChildByName(this.deathName + idx).active = true;
            this._frameIdx++
        }
    }

    public getDeathState() {
        return this._isDeath;
    }

    /**
     * 碰撞检测
     * @param event 
     */
    private _onTriggerEnter(event: ITriggerEvent) {
        let name = event.otherCollider.node.parent.name;
        if (!this._isDeath) {
            this._evtDeath();
        }
    }

    onDestroy() {
        this._removeEventListener();
    }

    _removeEventListener() {
        EventManager.Inst.off(EventManager.EvtDeath + this._idx);
        TouchManager.removeTouchEvents(EventManager.EvtTouchFishEvent + this._idx);
    }
}

