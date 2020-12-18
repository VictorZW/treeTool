(function (window) {
    var utils = {
        creatDom: function (html) {
            var div = document.createElement('div')
            div.innerHTML = html
            return div.childNodes[0]
        }
    }
    var treeUtils = {
        initTree: function (el, options) {
            // 往el dom中插入 创建项目 元素 只能插入一次
            var addProjectOne = utils.creatDom('<div class="addProject-one">创建项目</div>')
            el.appendChild(addProjectOne)
            // 点击创建项目按钮 创建一级树
            addProjectOne.addEventListener('click', function () {
                var treeOne = treeUtils.initTreeOne()
                console.log(treeOne)
                console.log(addProjectOne)
                treeOne && addProjectOne.insertAdjacentHTML('beforebegin', treeOne)
            })
            document.addEventListener('click', function (event) {
                var target = event.target
                console.log(target, target.className, target.dataset.id)
                if (target.className === 'addProject-two') {
                    // 点击的是创建子项
                    var treeTwo = treeUtils.initTreeTwo(target.dataset.id)
                    treeTwo && target.insertAdjacentHTML('beforebegin', treeTwo)
                }
            })
        },
        // 添加一级树型图
        initTreeOne: function () {
            var name = prompt('请输入要创建的名字','')
            if (name !== null) {
                var timestamp = new Date().getTime()
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
        initTreeTwo: function (id) {
            console.log(id)
            var subId = 'sub' + String(id)
            var subName = prompt('请输入要创建的子项名字','')
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