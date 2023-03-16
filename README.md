# Graph

I will post english description and documentation, soon~~~

完整的中英文名暂未想好。目前，该项目提供一下功能(features)：

| 序号  | 功能描述                         | 完成度 | 时间         |
|-----|------------------------------|-----|------------|
| 1   | 创建Graph和Node                 | ✔   | 2023-03-11 |
| 2   | 操作Node                       | ✔   | 2023-03-11 |
| 3   | 拖拽Node功能                     | ✔   | 2023-03-11 |
| 4   | Graph内缩放                     | ✔   | 2023-03-11 |
| 5   | Node间连线                      | ✔   | 2023-03-11 |
| 6   | 连线删除                         |     | -          |
| 7   | 框选Node节点                     | 50% | 2023-03-11 |
| 8   | 多Node节点组合Group               | ✔   | 2023-03-12 |
| 9   | Node折叠                       |     | -          |
| 10  | Group折叠                      |     | -          |
| 11  | 提供多种线形(优化贝塞尔线，贝塞尔曲线，方形折线等)   | ✔   | 2023-03-11 |
| 12  | 动态化的连线                       | ✔   | 2023-03-11 |
| 13  | 跨端(浏览器)拷贝                    |     | -          |
| 14  | 模型运行时状态仿真/模拟                 | ✔   | 2023-03-11 |
| 15  | 支持多种浏览器，已在Chrome，Firefox进行测试 | ✔   | 2023-03-11 |
| 16  | 图层管理                         | 50% | 2023-03-11 |
| 17  | Port端口绑定                     | ✔   | 2023-03-11 |
| 18  | Node拖拽时前置                    | ✔   | 2023-03-11 |
| 19  | 编辑操作记录与撤回                    |     | -          |
| 20  | 自定义部分快捷操作                    | 10% | 2023-03-11 |
| 21  | 节点图数据导入与导出                   | ✔   | 2023-03-11 |
| 22  | Increment增量式移动               |     | -          |
| 23  | 吸附对齐                         |     | -          |
| 24  | 状态栏提示                        | 5%  | 2023-03-11 |
| 25  | 端口连线校验                       | ✔   | 2023-03-11 |
| 26  | 切换背景图                        |     | -          |
| 27  | 切换Node阴影，圆角和边框               |     | -          |
| 28  | 切换连线颜色                       | ✔   | 2023-03-11 |
| 29  | 切换Group背景色                   |     | -          |
| 30  | 自动节点排布                       |     | -          |
| 31  | 海量节点一键折叠                     |     | -          |
| 32  | 背景栅格                         |     | -          |
| 33  | 连线附加文字                       |     | -          |
| 34  | 带箭头的连线                       |     | -          |
| 35  | 箭头样式切换                       |     | -          |
| 36  | 增加对electron支持(重写electron部分)  | ✔   | 2023-03-11 |
| 37  | 节点(Node)按组(Group)移动          | ✔   | 2023-03-12 |
| 38  | 解构Group                      | ✔   | 2023-03-12 |
| 39  | 提供基础浅色主题和深色主题                | ✔   | 2023-03-12 |
| 40  | 动态Theme主题切换                  | ✔   | 2023-03-12 |
| 41  | 根据不同的需求生成不同结构的Node layer     | ✔   | 2023-03-13 |
| 42  | Node layer上的事件管理优化           |     |            |
| 43  | ~~更灵活的Port配置(动态绑定端口)~~       | ✔   | 2023-03-13 |
| 44  | 完整的snapshot功能支持              |     |            |
| 45  | electron跨域http请求             |     |            |
| 46  | 发布module库                    | ✔   | 2023-03-16 |
| 47  | 使用父子项目进行管理                   | ✔   | 2023-03-16 |

Node仅作为拖拽式容器存在，您可以将任何元素置入创建好的Node节点中，无论其多复杂。

## 优势与特点

非常顺滑的操作体验；极简风api调用；无缝融合任何模型；超强的拓展性...

达到浏览器原生性能，无任何框架侵入。无限制载入节点数，性能完全取决于您的浏览器和所使用的电脑的性能。

打开浏览器控制台性能监控，您会发现：除非必要，基本无脚本调用耗时。

可以与任何框架融合！您可以为一个Vue组件创建节点，也可以为一个React组件创建节点，甚至自己编写的框架，只需简单调用挂载接口即可。

如果你选择了Graph，那么就别考虑使用其他任何flow-chart-graph相关的项目了(其实也不一定，嘿嘿~我肤浅了~)！性能和架构完虐、吊打一切flow引擎...

如果你还想了解其他flow项目，进行调研对比等，相似的项目有：

1. react-flow(react版本)
2. vue-flow(vue版本)
3. flowy-vue
4. flowy
5. WireFlow
6. react-flow-chart
7. 忘了...还有个强大的可定制性强的项目

## 性能

单节点移动的耗时对比。

React flow:

![image](https://github.com/aiyojun/graph/blob/master/performance/reactflow.png)

Vue flow:

![image](https://github.com/aiyojun/graph/blob/master/performance/vue-flow.png)

Graph engine:

![image](https://github.com/aiyojun/graph/blob/master/performance/graph-engine.png)

对于react flow而言，主要是因为使用了react框架，所以调用层级较多。而Graph无框架侵入，除非必要，无任何其他调用。
如果你有渲染海量节点数据到Graph的需求，那么Graph engine是最好的选择。

## 应用

Graph是一切图的抽象，这也是我给她取名Graph的原因，她就是Graph(图)！

该项目可应用于任何跟图或拓扑相关的领域，可以进行可视化，构造模型，生成拓扑数据(JSON...)等。

只要你敢想，Graph就敢做！只要你觉得可以，那么Graph就一定可以！Graph能将你无穷的想象力展现到现实！

1. 流程(数据)可视化
2. 构造流程图
3. 对接图模型
4. 构造拓扑图

## 更多功能(More features)

1. 缩略图(生成简图)
2. 图形导出图片
