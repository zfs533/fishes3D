
import { _decorator, Component, Node } from 'cc';
import { FishManager } from './fish/fishManager';
import { FishNetManager } from './fishnet/fishNetManager';
import { TouchManager } from './utils/touchManager';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    onLoad() {
        TouchManager.init();
        FishManager.init();
    }
}


