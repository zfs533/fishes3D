
import { _decorator, Component, Node, Vec2, geometry, Camera, PhysicsSystem, Vec4, Vec3, ModelComponent, director } from 'cc';
import EventManager from '../utils/eventManager';
import { TouchManager } from '../utils/touchManager';
import { copyVec3Array } from '../utils/util';
const { ccclass, property } = _decorator;

@ccclass('Background')
export class Background extends Component {

    @property(Camera)
    mainCamera3D: Camera = null as unknown as Camera;

    private modelPlane: ModelComponent = null;
    private _temp_v4: Vec4 = new Vec4();
    private _temp_v3: Vec3 = new Vec3();
    private _count = 0;
    private _wavePoint: Vec3[] = [
        new Vec3(-0.2, 0, -0.2),
        new Vec3(0.2, 0, 0.2),
        new Vec3(0, 0, -0.2),
        new Vec3(0, 0, 0.2),
        new Vec3(-0.2, 0, 0),
        new Vec3(0.2, 0, 0),
        new Vec3(-0.2, 0, 0.2),
        new Vec3(0.2, 0, -0.2),
    ];
    private _idx: number = 0;

    onLoad() {
        this.modelPlane = this.node.getComponent(ModelComponent);
        this.schedule(() => {
            this._playWaterEffect();
            this._playWaterEffect();
        }, 10);
        //添加触摸射线碰撞检测事件
        // EventManager.Inst.on(EventManager.EvtRaycheck, this._raycheck.bind(this), this);
        // TouchManager.addTouchEvents(EventManager.EvtRaycheck);
    }

    /**
     * 射线检测
     * @param event 
     */
    _raycheck(v2: Vec2) {
        /* 屏幕点击坐标 */
        let screenPos: Vec2 = v2;
        //2:从摄像机发出一条射线
        let ray: geometry.Ray = this.mainCamera3D.screenPointToRay(screenPos.x, screenPos.y);
        //3:检测射线碰撞结果,raycastClosest检测到最近的物体就返回
        if (PhysicsSystem.instance.raycastClosest(ray)) {
            let name = PhysicsSystem.instance.raycastClosestResult.collider.node.name;
            let v3 = PhysicsSystem.instance.raycastClosestResult.hitPoint;
            this._playWaterEffect();
        }
    }

    /**
     * 背景模型波浪效果
     * @param v3 
     */
    private _playWaterEffect() {
        let tempV = copyVec3Array(this._wavePoint)[this._idx];
        this._idx++;
        if (this._idx >= this._wavePoint.length) {
            this._idx = 0;
        }
        this._temp_v3.set(tempV);
        const item = this.modelPlane;
        this._temp_v3 = this._temp_v3.add(tempV.clone().multiplyScalar(2));
        const minPosition = item.node.worldPosition.clone().add(this.modelPlane.mesh.struct.minPosition);
        const maxPosition = item.node.worldPosition.clone().add(this.modelPlane.mesh.struct.maxPosition);
        this._temp_v4.set((this._temp_v3.x - minPosition.x) / (maxPosition.x - minPosition.x), (this._temp_v3.z - minPosition.z) / (maxPosition.z - minPosition.z), director.root.cumulativeTime, 0)

        const pass = this.modelPlane.material.passes[0];
        pass.setUniform(pass.getHandle(`center${this._count++ % 10}`), this._temp_v4);
    }
}
