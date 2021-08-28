
import { _decorator, Component, Node } from 'cc';
import { fishData, infish } from './fishData';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Component {
    /**
     * 根据预制名称获取鱼配置数据
     * @param nodeName 
     * @returns infish
     */
    public static getFishDataByName(nodeName: string): infish {
        for (let i = 0; i < fishData.data.length; i++) {
            if (nodeName == fishData.data[i].nodeName) {
                return fishData.data[i];
            }
        }
        return null;

    }
    /**
     * 根据id获取鱼配置数据
     * @param id 
     * @returns infish
     */
    public static getFishDataById(id: number): infish {
        for (let i = 0; i < fishData.data.length; i++) {
            if (id == fishData.data[i].id) {
                return fishData.data[i];
            }
        }
        return null;
    }

    /**
     * 获取随机一条鱼的数据,用于测试使用
     * @returns 
     */
    public static getRandomFishData(): infish {
        let idx = Math.floor(Math.random() * (fishData.data.length - 9));
        // idx = 0;
        return fishData.data[idx];
    }
}

