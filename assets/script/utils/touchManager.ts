
import { _decorator, Component, Node, systemEvent, SystemEventType, Vec2, Camera, geometry, PhysicsSystem } from 'cc';
import EventManager from './eventManager';
const { ccclass, property } = _decorator;

@ccclass('TouchManager')
export class TouchManager extends Component {

    private static _events: Array<any> = new Array<any>();
    private _count: number = 0;
    private static _isDown: boolean = false;
    private static _touchPos: Vec2 = new Vec2();
    public static init() {
        systemEvent.on(SystemEventType.TOUCH_START, this._onTouchStart, this);
        systemEvent.on(SystemEventType.TOUCH_MOVE, this._onTouchMove, this);
        systemEvent.on(SystemEventType.TOUCH_END, this._onTouchEnd, this);
    }

    /**
     * 触摸屏幕派发事件
     * @param event 
     */
    public static _onTouchStart(event: any) {
        this._isDown = true;
        let screenPos: Vec2 = event._point;
        this._touchPos = screenPos;
        for (let i = 0; i < this._events.length; i++) {
            if (this._events[i] == EventManager.EvtTouchShootEvent) continue;
            EventManager.Inst.dispatchEvent(this._events[i], screenPos);
        }
    }

    private static _onTouchMove(event: any) {
        let screenPos: Vec2 = event._point;
        this._touchPos = screenPos;
    }
    private static _onTouchEnd(event: any) {
        EventManager.Inst.dispatchEvent(EventManager.EvtTouchShootEvent, TouchManager._touchPos);
        this._isDown = false;
    }

    public static addTouchEvents(event: string) {
        this._events.push(event);
    }

    public static removeTouchEvents(event: string) {
        for (let i = 0; i < this._events.length; i++) {
            if (this._events[i] == event) {
                this._events.splice(i, 1);
                this.removeTouchEvents(event);
                return;
            }
        }
    }

    update() {
        return;
        //长按连续发射炮弹
        this._count++;
        if (this._count % 10 == 0) {
            this._count = 0;
            if (TouchManager._isDown) {
                EventManager.Inst.dispatchEvent(EventManager.EvtTouchShootEvent, TouchManager._touchPos);
            }
        }
    }
}
