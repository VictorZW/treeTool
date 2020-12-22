(function (window) {
    var nowClickDom = ''
    var clickId = ''
    var goobleEl = ''
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
                var EditDialog = treeUtils.initEditDialog('创建主项', '输入主项名称', '')
                EditDialog && document.body.insertAdjacentHTML('afterbegin', EditDialog)
                clickId = ''
                nowClickDom = addProjectOne
                goobleEl = el
            })

            // 点击事件：事件委托
            document.addEventListener('click', function (event) {
                var eventPath = event.path
                if (eventPath.indexOf(el) < 0) {
                    return false
                }
                var target = event.target
                // 点击创建子项按钮
                if (target.className === 'addProject-two') {
                    // 点击的是创建子项
                    var EditDialog = treeUtils.initEditDialog('创建子项', '输入子项名称', '')
                    EditDialog && document.body.insertAdjacentHTML('afterbegin', EditDialog)
                    nowClickDom = target.className
                    clickId = target.dataset.id
                    goobleEl = el
                }
                if (target.className === 'sub-delete-icon') {
                    if (confirm('确定删除子项吗？')) {
                        var treeTwoArr = el.getElementsByClassName('tree-two')
                        for (var i = 0; i < treeTwoArr.length; i++) {
                            // treeTwoArr
                            if (treeTwoArr[i].dataset.key === target.dataset.key) {
                                treeTwoArr[i].remove()
                            }
                        }
                        treeUtils.handleOptions(el)
                    } else {
                        console.log('点击了取消')
                    }
                }
                if (target.className === 'delete-icon') {
                    // initDelDialog
                    var delDialog = treeUtils.initDelDialog()
                    delDialog && document.body.insertAdjacentHTML('afterbegin', delDialog)
                    clickId = target.dataset.id
                    goobleEl = el
                }
                if (target.className === 'sub-edit-icon') {
                    // 当前点击元素的所有兄弟元素
                    var allChildrenDom = target.parentNode.children
                    var inputValue = ''
                    for (var i = 0; i < allChildrenDom.length; i++) {
                        // 找到当前点击的元素的name
                        if (allChildrenDom[i].className === 'tree-two-name') {
                            inputValue = allChildrenDom[i].innerHTML
                            nowClickDom = allChildrenDom[i].className
                            clickId = allChildrenDom[i].dataset.key
                        }
                    }
                    var EditDialog = treeUtils.initEditDialog('编辑子项', '输入子项名称', inputValue)
                    EditDialog && document.body.insertAdjacentHTML('afterbegin', EditDialog)
                    goobleEl = el
                }
                if (target.className === 'edit-icon') {
                    // 当前点击元素的所有兄弟元素
                    var allChildren = target.parentNode.children
                    var inputValue = ''
                    for (var i = 0; i < allChildren.length; i++) {
                        // 找到当前点击的元素的name
                        if (allChildren[i].className === 'tree-one-name') {
                            inputValue = allChildren[i].innerHTML
                            nowClickDom = allChildren[i].className
                            clickId = allChildren[i].dataset.key
                        }
                    }
                    var EditDialog = treeUtils.initEditDialog('编辑主项', '输入主项名称', inputValue)
                    EditDialog && document.body.insertAdjacentHTML('afterbegin', EditDialog)
                    goobleEl = el
                }
            }, true)
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
                treeUtils.handleOptions(el)
            })
            treeUtils.handleOptions(el)
        },
        // 添加一级树型图
        initTreeOne: function (name, value) {
            // name = name || prompt('请输入要创建的名字','')
            value = value || ''
            if (name !== null) {
                // 生成100000-999999的随机数
                var timestamp = utils.getRandomNum(10000,999999)
                var treeOne = '<div class="tree-one" data-id="'+ timestamp + '" data-key="'+ timestamp + '">' +
                        '<div class="left">' +
                            '<div class="arrow" data-id="'+ timestamp + '"></div>' +
                            '<div class="tree-one-name" data-id="'+ timestamp + '" data-key="'+ timestamp + '" title="'+ name + '">' + name + '</div>' +
                            '<div class="edit-icon" data-id="'+ timestamp + '" data-key="'+ timestamp + '"></div>' +
                            '<div class="delete-icon" data-id="'+ timestamp + '"></div>' +
                        '</div>' +
                        '<div class="right">' +
                            '<input type="number" class="num-input" data-id="'+ timestamp + '" value="'+ value + '"><span>%</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="sub-content" data-id="'+ timestamp + '"><div id="'+ timestamp + '" data-id="'+ timestamp + '" data-key="'+ timestamp + '" class="addProject-two">创建子项</div></div>'
                return treeOne
            } else {
                return false
            }
        },
        // 添加二级树型图
        initTreeTwo: function (id, subName, value) {
            var subId = id
            var timestamp = utils.getRandomNum(10000,999999)
            // subName = subName || prompt('请输入要创建的子项名字','')
            value = value || ''
            if (subName !== null) {
                var treeTwo = '<div class="tree-two" data-id="'+ subId + '" data-key="'+ timestamp + '">' +
                    '<div class="left">' +
                    '<div class="tree-two-name" data-id="'+ subId + '" data-key="'+ timestamp + '" title="'+ subName + '">' + subName + '</div>' +
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
        // 添加编辑弹窗
        initEditDialog: function (dialogTitle, placeholder, inputValue) {
            var editDialogDom = '<div id="edit-dialog-wrapper" class="dialog-wrapper">' +
                '    <div class="dialog-content">' +
                '        <div class="dialog-title">' + dialogTitle + '</div>' +
                '        <div id="dialog-content-main">' +
                '            <input id="dialog-content-main-input" type="text" placeholder="'+ placeholder + '" value="'+ inputValue + '">' +
                '        </div>' +
                '        <div class="dialog-footer">' +
                '            <div id="dialog-cancel" class="dialog-btn">取消</div>' +
                '            <div id="dialog-submit" class="dialog-btn">确定</div>' +
                '        </div>' +
                '    </div>' +
                '</div>'
            return editDialogDom
        },
        // 添加删除弹窗
        initDelDialog: function () {
            var delDialogDom = '<div id="edit-dialog-wrapper" class="dialog-wrapper">' +
                '    <div class="dialog-content">' +
                '        <div class="dialog-title">确定删除此项目？</div>' +
                '        <div class="dialog-footer">' +
                '            <div id="dialog-cancel" class="dialog-btn">取消</div>' +
                '            <div id="dialog-submit-del" class="dialog-btn">确定</div>' +
                '        </div>' +
                '    </div>' +
                '</div>'
            return delDialogDom
        },
        handleOptions: function (el) {
            var optionsOneArr = []
            var optionsTwoArr = []
            var allDom = el.getElementsByTagName('*')
            for (var a in allDom) {
                // 如果data-id有值
                if (allDom[a].dataset && allDom[a].dataset.id) {
                    // 先处理一级目录的数据
                    if (allDom[a].className === 'tree-one-name') {
                        var thisId = allDom[a].dataset.id
                        var allNumInput = el.getElementsByClassName('num-input')
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
                        var allSubNumInput = el.getElementsByClassName('sub-num-input')
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
                var numInputDomArr = el.getElementsByClassName('num-input')
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
            window.getAllPercentFoo()
            return JSON.parse(JSON.stringify(optionsData))
        },
        getAllPercent: function (el) {
            var sum = 0
            var numArr = []
            var allNumInput = el.getElementsByClassName('num-input')
            var allSumNumInput = el.getElementsByClassName('sub-num-input')
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
        checkAllInput: function (el) {
            var numArr = []
            var allNumInput = el.getElementsByClassName('num-input')
            var allSumNumInput = el.getElementsByClassName('sub-num-input')
            for (var i = 0; i < allNumInput.length; i++) {
                numArr.push(allNumInput[i].value)
            }
            for (var j = 0; j < allSumNumInput.length; j++) {
                numArr.push(allSumNumInput[j].value)
            }
            return numArr.indexOf('') > 0 // 如果大于0 说明有空值
        },
        // 检查是否有重复的
        checkHasRepeat: function (el) {
            var valueArr = []
            var treeOneName = el.getElementsByClassName('tree-one-name')
            var treeTwoName = el.getElementsByClassName('tree-two-name')
            for (var i = 0; i < treeOneName.length; i++) {
                valueArr.push(treeOneName[i].innerHTML)
            }
            for (var j = 0; j < treeTwoName.length; j++) {
                valueArr.push(treeTwoName[j].innerHTML)
            }
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
            return treeUtils.handleOptions(this.el)
        },
        getAllPercent: function () {
            return treeUtils.getAllPercent(this.el)
        },
        checkAllInput: function () {
            return treeUtils.checkAllInput(this.el)
        },
        checkHasRepeat: function () {
            return treeUtils.checkHasRepeat(this.el)
        }
    }
    document.addEventListener('click', function (event) {
        var targetDom = event.target
        if (targetDom.id === 'dialog-cancel') {
            var editDialogDom = document.getElementById('edit-dialog-wrapper')
            document.body.removeChild(editDialogDom)
        }
        if (targetDom.id === 'dialog-submit') {
            var inputDom = document.getElementById('dialog-content-main-input')
            if (inputDom.value === '') {
                return false
            }
            if (typeof (nowClickDom) === 'string') {
                var allNowClickDom = document.getElementsByClassName(nowClickDom)
                for (var i = 0; i < allNowClickDom.length; i++) {
                    // 找到对应的name标签，把innerHtml替换掉
                    if (Number(clickId) === Number(allNowClickDom[i].dataset.key)) {
                        if (allNowClickDom[i].className === 'addProject-two') {
                            // 如果点击的是创建子项
                            var treeTwo = treeUtils.initTreeTwo(clickId, inputDom.value, '')
                            treeTwo && allNowClickDom[i].insertAdjacentHTML('beforebegin', treeTwo)
                        } else {
                            allNowClickDom[i].innerHTML = inputDom.value
                        }
                    }
                }
            }

            // object 点击设置主项
            if (typeof (nowClickDom) === 'object') {
                var treeOne = treeUtils.initTreeOne(inputDom.value, '')
                treeOne && nowClickDom.insertAdjacentHTML('beforebegin', treeOne)
            }
            clickId = ''
            nowClickDom = ''
            var editDialogDom = document.getElementById('edit-dialog-wrapper')
            document.body.removeChild(editDialogDom)
            treeUtils.handleOptions(goobleEl)
        }
    })

    document.addEventListener('click', function (event) {
        // dialog-submit-del
        console.log(event.target.id)
        if (event.target.id === 'dialog-submit-del') {
            // 点击的是删除按钮
            var treeOneArr = goobleEl.getElementsByClassName('tree-one')
            var subContentArr = goobleEl.getElementsByClassName('sub-content')
            for (var i = 0; i < treeOneArr.length; i++) {
                // treeTwoArr
                if (treeOneArr[i].dataset.id === clickId) {
                    treeOneArr[i].remove()
                }
            }
            for (var j = 0; j < subContentArr.length; j++) {
                // treeTwoArr
                if (subContentArr[j].dataset.id === clickId) {
                    subContentArr[j].remove()
                }
            }
            clickId = ''
            nowClickDom = ''
            treeUtils.handleOptions(goobleEl)
            var editDialogDom = document.getElementById('edit-dialog-wrapper')
            document.body.removeChild(editDialogDom)
        }
    })
    window.TreeTool = TreeTool
})(window)
