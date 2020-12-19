# treeTool 树型图组件

# 使用方法

```
var tree = new TreeTool(document.querySelector('#tree'), options)
tree.init()
```

# 传入的数据格式

```
var options = {
    '周一': [
        {
            '早晨': 10
        },
        {
            '中午': 5
        },
        {
            '晚上': 15
        }
    ],
    '周二': [
        {
            '早晨': 20
        },
        {
            '晚上': 10
        }
    ],
    '周三': 30
}
```

# 提供的方法

- tree.getOptions() 获取最终处理过的options的值

- tree.getAllPercent() 获取所有子项目的百分比之和

- tree.checkAllInput() 检查是否有空的输入框，true 说明有空值，false说明都不为空

