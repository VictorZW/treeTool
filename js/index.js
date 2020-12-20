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
            // console.log(options)
            // 往el dom中插入 创建项目 元素 只能插入一次
            var addProjectOne = utils.creatDom('<div class="addProject-one">创建项目</div>')
            el.appendChild(addProjectOne)

            // 如果options不为空，去循环渲染dom
            if (utils.checkOptions(options)) {
                for (var i in options) {
                    // 将一级树渲染到dom
                    // if options[i] is number, don`t insert value
                    var treeOne = treeUtils.initTreeOne(i, isNaN(options[i]) ? '' : options[i])
                    treeOne && addProjectOne.insertAdjacentHTML('beforebegin', treeOne)
                    var treeOneId = treeOne.match(/\d+/)[0]
                    var treeTwoAddDom = document.getElementById(treeOneId)
                    // 如果options[i]是数组，说明有子项
                    if (options[i] instanceof Array) {
                        for (var j in options[i]) {
                            for (var k in options[i][j]) {
                                var treeTwo = treeUtils.initTreeTwo(treeOneId, k, options[i][j][k])
                                treeTwo && treeTwoAddDom.insertAdjacentHTML('beforebegin', treeTwo)
                            }
                        }
                    }
                }
            }

            // 点击事件：点击创建项目按钮 创建一级树
            addProjectOne.addEventListener('click', function () {
                var treeOne = treeUtils.initTreeOne()
                treeOne && addProjectOne.insertAdjacentHTML('beforebegin', treeOne)
                treeUtils.handleOptions()
            })

            // 点击事件：事件委托
            document.addEventListener('click', function (event) {
                var target = event.target
                // 点击创建子项按钮
                if (target.className === 'addProject-two') {
                    // 点击的是创建子项
                    var treeTwo = treeUtils.initTreeTwo(target.dataset.id)
                    treeTwo && target.insertAdjacentHTML('beforebegin', treeTwo)
                    treeUtils.handleOptions()
                }
                if (target.className === 'sub-delete-icon') {
                    if (confirm('确定删除子项吗？')) {
                        var treeTwoArr = document.getElementsByClassName('tree-two')
                        for (var i = 0; i < treeTwoArr.length; i++) {
                            // treeTwoArr
                            if (treeTwoArr[i].dataset.key === target.dataset.key) {
                                treeTwoArr[i].remove()
                            }
                        }
                        treeUtils.handleOptions()
                    } else {
                        console.log('点击了取消')
                    }
                }
                if (target.className === 'delete-icon') {
                    if (confirm('确定删除吗？')) {
                        var treeOneArr = document.getElementsByClassName('tree-one')
                        var subContentArr = document.getElementsByClassName('sub-content')
                        for (var i = 0; i < treeOneArr.length; i++) {
                            // treeTwoArr
                            if (treeOneArr[i].dataset.id === target.dataset.id) {
                                treeOneArr[i].remove()
                            }
                        }
                        for (var j = 0; j < subContentArr.length; j++) {
                            // treeTwoArr
                            if (subContentArr[j].dataset.id === target.dataset.id) {
                                subContentArr[j].remove()
                            }
                        }
                        treeUtils.handleOptions()
                    } else {
                        console.log('点击了取消')
                    }
                }
                if (target.className === 'sub-edit-icon') {
                    var name = prompt('请输入要修改的子项名称','')
                    if (name !== null) {
                        var treeTwoNameArr = document.getElementsByClassName('tree-two-name')
                        for (var i = 0; i < treeTwoNameArr.length; i++) {
                            // treeTwoArr
                            if (treeTwoNameArr[i].dataset.key === target.dataset.key) {
                                treeTwoNameArr[i].innerHTML = name
                            }
                        }
                        treeUtils.handleOptions()
                    }
                }
                if (target.className === 'edit-icon') {
                    var name = prompt('请输入要修改的主项名称','')
                    if (name !== null) {
                        var treeOneNameArr = document.getElementsByClassName('tree-one-name')
                        for (var i = 0; i < treeOneNameArr.length; i++) {
                            // treeTwoArr
                            if (treeOneNameArr[i].dataset.id === target.dataset.id) {
                                treeOneNameArr[i].innerHTML = name
                            }
                        }
                        treeUtils.handleOptions()
                    }
                }
            })
            document.addEventListener('change', function (event) {
                var target = event.target
                // var res = /^(\d+\.\d{1,1}|\d+)$/ // 限制只能输入一位小数
                // if (target.tagName === 'INPUT') {
                //     console.log(res.test(target.value))
                //     if (!res.test(target.value)) {
                //         target.value = ''
                //     }
                // }
                // 调用处理数据方法
                treeUtils.handleOptions()
            })
            treeUtils.handleOptions()
        },
        // 添加一级树型图
        initTreeOne: function (name, value) {
            name = name || prompt('请输入要创建的名字','')
            value = value || ''
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
                            '<input type="number" class="num-input" data-id="'+ timestamp + '" value="'+ value + '"><span>%</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="sub-content" data-id="'+ timestamp + '"><div id="'+ timestamp + '" data-id="'+ timestamp + '" class="addProject-two">创建子项</div></div>'
                return treeOne
            } else {
                return false
            }
        },
        // 添加二级树型图
        initTreeTwo: function (id, subName, value) {
            var subId = id
            var timestamp = utils.getRandomNum(10000,999999)
            subName = subName || prompt('请输入要创建的子项名字','')
            value = value || ''
            if (subName !== null) {
                var treeTwo = '<div class="tree-two" data-id="'+ subId + '" data-key="'+ timestamp + '">' +
                    '<div class="left">' +
                    '<div class="tree-two-name" data-id="'+ subId + '" data-key="'+ timestamp + '">' + subName + '</div>' +
                    '<div class="sub-edit-icon" data-id="'+ subId + '" data-key="'+ timestamp + '"></div>' +
                    '<div class="sub-delete-icon" data-id="'+ subId + '" data-key="'+ timestamp + '"></div>' +
                    '</div>' +
                    '<div class="right">' +
                    '<input type="number" class="sub-num-input" data-id="'+ subId + '" data-key="'+ timestamp + '" value="'+ value + '"><span>%</span>' +
                    '</div>' +
                    '</div>'
                return treeTwo
            } else {
                return false
            }
        },
        handleOptions: function () {
            var optionsOneArr = []
            var optionsTwoArr = []
            var allDom = document.getElementsByTagName('*')
            for (var a in allDom) {
                // 如果data-id有值
                if (allDom[a].dataset && allDom[a].dataset.id) {
                    // 先处理一级目录的数据
                    if (allDom[a].className === 'tree-one-name') {
                        var thisId = allDom[a].dataset.id
                        var allNumInput = document.getElementsByClassName('num-input')
                        for (var i = 0; i < allNumInput.length; i++) {
                            if (allNumInput[i].dataset.id === thisId) {
                                optionsOneArr.push({
                                    id: allDom[a].dataset.id,
                                    className: allDom[a].className,
                                    text: allDom[a].innerHTML,
                                    value: allNumInput[i].value
                                })
                            }
                        }
                    }
                    // 在处理二级树的数据
                    if (allDom[a].className === 'tree-two-name') {
                        var thisSubId = allDom[a].dataset.id
                        var subKey = allDom[a].dataset.key
                        var allSubNumInput = document.getElementsByClassName('sub-num-input')
                        for (var i = 0; i < allSubNumInput.length; i++) {
                            if (allSubNumInput[i].dataset.key === subKey) {
                                optionsTwoArr.push({
                                    id: thisSubId,
                                    className: allDom[a].className,
                                    text: allDom[a].innerHTML,
                                    value: allSubNumInput[i].value,
                                    key: allSubNumInput[i].dataset.key
                                })
                            }
                        }
                    }
                }
            }
            var optionsData = {}
            for (var i = 0; i < optionsOneArr.length; i++) {
                var subArr = []
                for (var j = 0; j < optionsTwoArr.length; j++) {
                    if (optionsOneArr[i].id === optionsTwoArr[j].id) {
                        subArr.push({
                            [optionsTwoArr[j].text]: optionsTwoArr[j].value
                        })
                    }
                }
                optionsData[optionsOneArr[i].text] = (subArr instanceof Array && subArr.length > 0) ? subArr : optionsOneArr[i].value
                var numInputDomArr = document.getElementsByClassName('num-input')
                for (var k = 0; k < numInputDomArr.length; k++) {
                    if (numInputDomArr[k] && (numInputDomArr[k].dataset.id === optionsOneArr[i].id)) {
                        if (subArr.length > 0) {
                            // 说明有二级树，需要删除一级树上的input
                            numInputDomArr[k].value = 0
                            numInputDomArr[k].parentNode.style.display = 'none'
                        } else {
                            numInputDomArr[k].parentNode.style.display = 'block'
                        }
                    }
                }
            }
            return JSON.parse(JSON.stringify(optionsData))
        },
        getAllPercent: function () {
            var sum = 0
            var numArr = []
            var allNumInput = document.getElementsByClassName('num-input')
            var allSumNumInput = document.getElementsByClassName('sub-num-input')
            for (var i = 0; i < allNumInput.length; i++) {
                numArr.push(allNumInput[i].value)
            }
            for (var j = 0; j < allSumNumInput.length; j++) {
                numArr.push(allSumNumInput[j].value)
            }
            for (var a in numArr) {
                sum += Number(numArr[a])
            }
            return sum
        },
        // 检查每个input是否有值，不为''
        checkAllInput: function () {
            var numArr = []
            var allNumInput = document.getElementsByClassName('num-input')
            var allSumNumInput = document.getElementsByClassName('sub-num-input')
            for (var i = 0; i < allNumInput.length; i++) {
                numArr.push(allNumInput[i].value)
            }
            for (var j = 0; j < allSumNumInput.length; j++) {
                numArr.push(allSumNumInput[j].value)
            }
            return numArr.indexOf('') > 0 // 如果大于0 说明有空值
        },
        // 检查是否有重复的
        checkHasRepeat: function () {
            var valueArr = []
            var treeOneName = document.getElementsByClassName('tree-one-name')
            var treeTwoName = document.getElementsByClassName('tree-two-name')
            for (var i = 0; i < treeOneName.length; i++) {
                valueArr.push(treeOneName[i].innerHTML)
            }
            for (var j = 0; j < treeTwoName.length; j++) {
                valueArr.push(treeTwoName[j].innerHTML)
            }
            console.log(valueArr)
            var nary = valueArr.sort()
            for(var i = 0; i < nary.length - 1; i++) {
                if(nary[i] === nary[i + 1]) {
                    return true
                }
            }
            return false
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
        },
        getOptions: function () {
            return treeUtils.handleOptions()
        },
        getAllPercent: function () {
            return treeUtils.getAllPercent()
        },
        checkAllInput: function () {
            return treeUtils.checkAllInput()
        },
        checkHasRepeat: function () {
            return treeUtils.checkHasRepeat()
        }
    }
    window.TreeTool = TreeTool
})(window)