//移动对象到指定图层,带预览
//21_movetolayer3.jsx
//Moving Object with Preview

#target illustrator

// 创建对话框界面
function createMoveToLayerDialog() {
    var doc = app.activeDocument;

    // 获取当前选中的对象
    var selectedItems = doc.selection;

    if (selectedItems.length === 0) {
        alert("没有选中任何对象。");
        return;
    }

    // 获取文档中的所有图层名称
    var layers = doc.layers;
    var layerNames = [];

    // 获取所有图层名称
    for (var i = 0; i < layers.length; i++) {
        layerNames.push(layers[i].name);
    }

    // 创建UI面板
    var dialog = new Window("dialog", "选择目标图层");
    dialog.orientation = "column"; // 设置为垂直排列
    dialog.alignChildren = "fill"; // 填充对话框
    dialog.spacing = 10; // 设置间距
    dialog.margins = 10; // 设置对话框内边距

    // 创建上半部分的面板
    var upperPanel = dialog.add("group", undefined, );
    upperPanel.orientation = "row"; // 设置为水平排列
    upperPanel.alignChildren = "top"; // 顶部对齐
    upperPanel.spacing = 10; // 设置左右列之间的间距
    upperPanel.margins = 10; // 上下边距

    // 左列：显示选中的对象列表
    var leftPanel = upperPanel.add("panel", undefined, "选中的对象");
    leftPanel.orientation = "column";
    leftPanel.alignChildren = "fill";
    
    // 创建一个对象列表
    var objectList = leftPanel.add("listbox", undefined, [], {
        multiselect: false,
        numberOfColumns: 1,
        columnWidths: [200],
        spacing: 0 // 每行之间的间距
    });
    objectList.selection = 0; // 默认选中第一个对象

    // 添加所有选中的对象到列表中，限制名称为前10个字符
    var itemNames = [];
    
    for (var i = 0; i < selectedItems.length; i++) {
        var name = selectedItems[i].name || "Unnamed Object " + (i + 1);
        itemNames.push(name.length > 10 ? name.substring(0, 30) + "..." : name);
    }

    // 使用循环逐一添加对象到列表中
    for (var i = 0; i < itemNames.length; i++) {
        objectList.add("item", itemNames[i]);
    }

    // 右列：目标图层选择
    var rightPanel = upperPanel.add("panel", undefined, "选择目标图层");
    rightPanel.orientation = "column";
    rightPanel.alignChildren = "fill";
    rightPanel.spacing = 3; // 设置左右列之间的间距
    // 为每个选中的对象创建一个下拉框选择目标图层
    var layerSelections = [];
    for (var i = 0; i < selectedItems.length; i++) {
        var layerList = rightPanel.add("dropdownlist", undefined, layerNames);
        layerList.selection = 0; // 默认选择第一个图层
        layerSelections.push(layerList);
    }

    // 计算左右两列的高度
    var maxItemsInView = 15; // 最多显示10个对象
    var itemHeight = 5; // 修改每个项的高度
    var listHeight = Math.min(selectedItems.length, maxItemsInView) * itemHeight;
    leftPanel.preferredSize = [300, listHeight]; // 设置左列面板的高度
    rightPanel.preferredSize = [100, listHeight]; // 设置右列面板的高度与左列一致

    // 创建下半部分的面板 (确认与取消按钮)
    var lowerPanel = dialog.add("group");
    lowerPanel.orientation = "row";
    lowerPanel.alignChildren = ["center", "center"]; // 确保子元素填充容器
    lowerPanel.spacing = 20; // 按钮之间的间距

    var moveBtn = lowerPanel.add("button", undefined, "移动到图层");
    var cancelBtn = lowerPanel.add("button", undefined, "取消");

    // 列表项点击事件：点击时在画板中高亮显示该对象
    objectList.onChange = function() {
        var selectedIndex = objectList.selection.index;
        if (selectedIndex !== -1) {
            // 清除之前的高亮显示
            for (var i = 0; i < selectedItems.length; i++) {
                resetHighlight(selectedItems[i]);
            }

            // 高亮当前选中的对象
            var selectedObject = selectedItems[selectedIndex];
            highlightObject(selectedObject);
        }
    };

    // 高亮选中对象
    function highlightObject(obj) {
        if (obj.typename === "PathItem" || obj.typename === "CompoundPathItem") {
            obj.stroked = true;
            obj.strokeColor = doc.swatches["[Registration]"].color; // 使用注册颜色作为边框色
            obj.strokeWidth = 3; // 增加边框宽度
        } else if (obj.typename === "TextFrame") {
            obj.textRange.characterAttributes.fillColor = doc.swatches["[Registration]"].color;
            obj.textRange.characterAttributes.strokeColor = doc.swatches["[Registration]"].color;
        }

        // 使对象视觉上“选中”以模拟二次选中
        obj.selected = true; // 设置为选中状态
    }

    // 重置对象的高亮状态
    function resetHighlight(obj) {
        if (obj.typename === "PathItem" || obj.typename === "CompoundPathItem") {
            obj.stroked = false;
        } else if (obj.typename === "TextFrame") {
            obj.textRange.characterAttributes.fillColor = null;
            obj.textRange.characterAttributes.strokeColor = null;
        }

        // 重置选中状态
        obj.selected = false; // 取消选中状态
    }

    // 点击确定时执行
    moveBtn.onClick = function() {
        if (selectedItems.length > 0) {
            // 遍历所有选中的对象，移动到对应的目标图层
            for (var i = 0; i < selectedItems.length; i++) {
                var selectedLayerName = layerSelections[i].selection.text;
                var selectedLayer = doc.layers.getByName(selectedLayerName);

                // 将当前对象移动到目标图层
                selectedItems[i].move(selectedLayer, ElementPlacement.PLACEATEND);
            }

            // alert(selectedItems.length + " 个对象已成功批量移动！");
        } else {
            alert("请先选择一个或多个对象");
        }

        dialog.close();
    };

    // 点击取消时关闭对话框
    cancelBtn.onClick = function() {
        dialog.close();
    };

    // 显示对话框
    dialog.show();
}

// 执行脚本
createMoveToLayerDialog();
