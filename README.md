# fishes3D
cocoscreator3.2.1
## 游戏场景
- 游戏背景采用3D cube材质来实现，调整好3d camara的位置和角度即可
- - 多种背景图，只需要切换cube材质即可，很方便
- 捕鱼游戏操作仍然在2D界面上进行
- - 射击，游动，UI等
- 海底冒泡效果，可以通过材质来实现，3d camera很有可视感

## 鱼游相关
- 鱼游动路线轨迹生成，一线多用， x，y轴翻转，倒叙
- 鱼儿朝向，欧拉角tween动画，游走tween递归
- 碰撞检测，给鱼儿添加物理碰撞器和刚体
- 子弹，碰撞器，朝向，速度，撞墙反转

## 管理器
- 事件管理器 eventManager
- 触摸事件管理器 touchManager
- 鱼儿管理器 fishManager
- 子弹管理器 bulletManager
- 对象池 poolManager

## 工具类
- 全局函数接口 utils
- 枚举 enum