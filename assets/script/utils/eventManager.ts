/* 自定义事件模块 */
export default class EventManager {
    private static _instance: EventManager = null;
    public static EvtDeath: string = "death";
    public static EvtTouchFishEvent: string = "touchfishevent";
    public static EvtTouchShootEvent: string = "touchShootevent";
    public static EvtFishNet: string = "fishNet";
    public static EvtRaycheck: string = "raycheck";
    public static get Inst(): EventManager {
        if (!EventManager._instance) {
            EventManager._instance = new EventManager();
        }
        return EventManager._instance;
    }

    /* 事件数组 [{name:[{target:,callback:,}]}] */
    private events: Array<any> = new Array<any>();

    /**
     * 注册事件
     * @param {事件类型 string} eventType 
     * @param {回调函数} callback 
     * @param {目标对象} target 
     */
    public on(event_type: string, callback: Function, target?: any): void {
        // console.log("on=  " + event_type)
        if (this.events[event_type]) {
            var ev = { target: target, callback: callback };
            this.events[event_type].push(ev);
        }
        else {
            this.events[event_type] = [];
            var ev = { target: target, callback: callback };
            this.events[event_type].push(ev);
        }
    }

    /**
     * 发送事件
     * @param {事件类型 string} eventType 
     * @param {传递参数} param 
     */
    public dispatchEvent(event_type: string, param?: any): void {
        // console.log("dispath=  " + event_type);
        for (var type in this.events) {
            if (event_type == type) {
                for (var i = 0; i < this.events[event_type].length; i++) {
                    this.events[event_type][i].callback.call(this.events[event_type][i].target, param);
                }
            }
        }
    }

    /**
     * 移除事件
     * @param {事件类型  string} eventType 
     * @param {回调函数} callback 
     * @param {目标对象} target 
     */
    public off(event_type: string, callback?: Function, target?: any): void {
        for (var type in this.events) {
            if (event_type == type) {
                this.events[event_type].splice(0);
            }
        }
    }
}