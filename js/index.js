(function (window) {
    var utils = {
        creatDom: function (html) {
            var div = document.createElement('div')
            div.innerHTML = html
            return div.childNodes[0]
        },
        // 检查传入的对象是否为空
        checkOptions: function (options) {
            for (var i in options) { // 如果不为空，则会执行到这一步，返回true
                return true
            }
            return false // 如果为空,返回false
        },
        // 生成随机数
        getRandomNum: function (Min,Max) {
            var Range = Max - Min
            var Rand = Math.random()
            return (Min + Math.round(Rand * Range))
        }
    }
    var treeUtils = {
        initTree: function (el, options) {
            console.log(options)
            // 往el dom中插入 创建项目 元素 只能插入一次
            var addProjectOne = utils.creatDom('<div class="addProject-one">创建项目</div>')
            el.appendChild(addProjectOne)

            // 如果options不为空，去循环渲染dom
            if (utils.checkOptions(options)) {
                for (var i in options) {
                    // 将一级树渲染到dom
                    var treeOne = treeUtils.initTreeOne(i)
                    treeOne && addProjectOne.insertAdjacentHTML('beforebegin', treeOne)
                    var treeOneId = treeOne.match(/\d+/)[0]
                    var treeTwoAddDom = document.getElementById(treeOneId)
                    console.log(treeTwoAddDom)
                    // 如果options[i]是数组，说明有子项
                    if (options[i] instanceof Array) {
                        for (var j in options[i]) {
                            // console.log(options[i][j])
                            for (var k in options[i][j]) {
                                // console.log(k)
                                var treeTwo = treeUtils.initTreeTwo(treeOneId, k)
                                console.log(treeTwo)
                                treeTwo && treeTwoAddDom.insertAdjacentHTML('beforebegin', treeTwo)
                            }
                        }
                    }
                }
            }

            // 点击事件：点击创建项目按钮 创建一级树
            addProjectOne.addEventListener('click', function () {
                var treeOne = treeUtils.initTreeOne()
                // console.log(treeOne)
                // console.log(addProjectOne)
                treeOne && addProjectOne.insertAdjacentHTML('beforebegin', treeOne)
            })

            // 点击事件：事件委托
            document.addEventListener('click', function (event) {
                var target = event.target
                // console.log(target, target.className, target.dataset.id)
                // 点击创建子项按钮
                if (target.className === 'addProject-two') {
                    // 点击的是创建子项
                    var treeTwo = treeUtils.initTreeTwo(target.dataset.id)
                    treeTwo && target.insertAdjacentHTML('beforebegin', treeTwo)
                }
            })
        },
        // 添加一级树型图
        initTreeOne: function (name) {
            name = name || prompt('请输入要创建的名字','')
            if (name !== null) {
                // 生成100000-999999的随机数
                var timestamp = utils.getRandomNum(10000,999999)
                var treeOne = '<div class="tree-one" data-id="'+ timestamp + '">' +
                        '<div class="left">' +
                            '<div class="arrow" data-id="'+ timestamp + '"></div>' +
                            '<div class="tree-one-name" data-id="'+ timestamp + '">' + name + '</div>' +
                            '<div class="edit-icon" data-id="'+ timestamp + '"></div>' +
                            '<div class="delete-icon" data-id="'+ timestamp + '"></div>' +
                        '</div>' +
                        '<div class="right">' +
                            '<input type="text" class="num-input" data-id="'+ timestamp + '"><span>%</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="sub-content"><div id="'+ timestamp + '" data-id="'+ timestamp + '" class="addProject-two">创建子项</div></div>'
                return treeOne
            } else {
                return false
            }
        },
        // 添加二级树型图
        initTreeTwo: function (id, subName) {
            // console.log(id)
            var subId = 'sub' + String(id)
            subName = subName || prompt('请输入要创建的子项名字','')
            if (subName !== null) {
                var treeTwo = '<div class="tree-two" data-id="'+ subId + '">' +
                    '<div class="left">' +
                    '<div class="tree-two-name" data-id="'+ subId + '">' + subName + '</div>' +
                    '<div class="edit-icon" data-id="'+ subId + '"></div>' +
                    '<div class="delete-icon" data-id="'+ subId + '"></div>' +
                    '</div>' +
                    '<div class="right">' +
                    '<input type="text" class="num-input" data-id="'+ subId + '"><span>%</span>' +
                    '</div>' +
                    '</div>'
                return treeTwo
            } else {
                return false
            }
        }
    }
    var TreeTool = function (el, options) {
        this.el = el
        this.options = options
    }
    TreeTool.prototype = {
        constructor: TreeTool,
        init: function () {
            treeUtils.initTree(this.el, this.options)
        }
    }
    window.TreeTool = TreeTool
})(window)