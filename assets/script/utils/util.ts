import { director, Vec3, Node } from "cc";
import { AngleLocation } from "./enum";

/**
 * 复制Vec3数组
 * @param arr 
 * @returns Vec3[]
 */
export function copyVec3Array(arr: any[]) {
    let copy: any[] = [];
    for (let i = 0; i < arr.length; i++) {
        let v3 = new Vec3(arr[i].x, arr[i].y, arr[i].z);
        copy.push(v3);
    }
    return copy;
}

/**
 * 获取角度处于第几象限
 * @param angle 角度
 * @returns 
 */
export function getAngleLocation(angle: number) {
    let temp = angle;//Math.abs(angle);

    let re = 0;
    if (temp > 0) {
        if (temp >= 0 && temp <= 90) {
            re = AngleLocation.one;
        }
        else if (temp >= 90 && temp <= 180) {
            re = AngleLocation.two;
        }
        else if (temp >= 180 && temp <= 270) {
            re = AngleLocation.three;
        }
        else {
            re = AngleLocation.four;
        }
    }
    else {
        if (temp >= -90 && temp <= 0) {
            re = AngleLocation.four;
        }
        else if (temp >= -180 && temp <= -90) {
            re = AngleLocation.three;
        }
        else if (temp >= -270 && temp <= -180) {
            re = AngleLocation.two;
        }
        else {
            re = AngleLocation.one;
        }
    }
    return re;
}

/**
 * 处理旋转绕弯,将旋转角度处理成最小旋转路径
 * @param start 初始角度
 * @param end 目标角度
 * @returns 
 */
export function jugementAngleLocation(start: number, end: number): any {
    // console.log(Math.floor(start), Math.floor(end));
    let re: { angle1: number, reAngle: number, end: number } = { angle1: 0, reAngle: 0, end: 0 };
    //这里先处理一象限转到四象限(一个在1象限,一个在4象限)
    if (start >= 0 && end >= 0) {
        if (start >= 0 && start <= 90 && end <= 360 && end >= 270) {
            re.angle1 = 0;
            re.reAngle = 0;
            re.end = end - 360;
            return re;
        }
        else if (end >= 0 && end <= 90 && start <= 360 && start >= 270) {
            re.angle1 = 360;
            re.reAngle = 0;
            re.end = end;
            return re;
        }
    }

    if (start <= 0 && end <= 0) {
        if (start <= -270 && start >= -360 && end <= 0 && end >= -90) {
            re.angle1 = -360;
            re.reAngle = 0;
            re.end = end;
            return re;
        }
        else if (end <= -270 && end >= -360 && start <= 0 && start >= -90) {
            re.angle1 = 0;
            re.reAngle = 0;
            re.end = end + 360;
            return re;
        }
    }
    // 同在2,3象限,只处理一正一负的情况
    let al = getAngleLocation(start);
    let al2 = getAngleLocation(end);
    // console.log(al, al2)
    if (al >= AngleLocation.two && al2 >= AngleLocation.two && al < AngleLocation.four && al2 < AngleLocation.four) {
        if (start * end < 0) {
            if (start > 0) {
                re.angle1 = start;
                re.reAngle = start;
                re.end = end + 360;
                return re;
            }
            else {
                re.angle1 = start;
                re.reAngle = start;
                re.end = end - 360;
                return re;
            }
        }
    }
    //一,三象限
    if (al == AngleLocation.one && al2 == AngleLocation.two) {
        if (start * end >= 0) {
            if (start >= 0) {
                re.angle1 = 90;
                re.reAngle = 90;
                re.end = end;
                return re;
            }
            //todo
        }
    }

    //三,四象限
    if ((al == AngleLocation.three && al2 == AngleLocation.four) || (al == AngleLocation.four && al2 == AngleLocation.three)) {
        if (start * end <= 0) {
            if (start >= 0) {
                re.angle1 = 270;
                re.reAngle = 270;
                re.end = end + 360;
                return re;
            }
            else {
                re.angle1 = -90;
                re.reAngle = -90;
                re.end = end - 360;
                return re;
            }
        }
    }
    //同在四象限
    if (al == AngleLocation.four && al2 == AngleLocation.four) {
        if (start * end <= 0) {
            if (start >= 0) {
                re.angle1 = start;
                re.reAngle = start;
                re.end = end + 360;
                return re;
            }
            else {
                re.angle1 = start;
                re.reAngle = start;
                re.end = end - 360;
                return re;
            }
        }
    }

    return false;
}


/**
 * 将节点添加到fishLayer层
 * @param node 
 */
export function addNodeToFishLayer(node: Node) {
    director.getScene().getChildByPath('Canvas/fishLayer').addChild(node);
}

/**
 * 将节点添加到UiLayer层
 * @param node 
 */
export function addNodeToUiLayer(node: Node) {
    director.getScene().getChildByPath('Canvas/uiLayer').addChild(node);
}

/**
 * 将节点添加到bulletLayer层
 * @param node 
 */
export function addNodeToBulletLayer(node: Node) {
    director.getScene().getChildByPath('Canvas/uiLayer/bullet').addChild(node);
}

/**
 * 将节点添加到cannonLayer层
 * @param node 
 */
export function addNodeToCannonLayer(node: Node) {
    director.getScene().getChildByPath('Canvas/uiLayer/cannon').addChild(node);
}