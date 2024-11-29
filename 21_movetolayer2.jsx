//移动对象到指定图层,无预览带选择选项
//21_movetolayer2.jsx
//Moving Object

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
    var dialog = new Window("dialog", "(JUN)移动对象到图层V2");
    dialog.orientation = "column"; // 设置为垂直排列
    dialog.alignChildren = "fill"; // 填充对话框
    dialog.spacing = 10; // 设置间距
    dialog.margins = [10, 10, 10, 10]; // 设置对话框内边距

    // 创建上半部分的面板
    var upperPanel = dialog.add("panel", undefined, "选择对象和目标图层");
    upperPanel.orientation = "column"; // 设置为垂直排列
    upperPanel.alignChildren = "fill"; // 填充
    upperPanel.spacing = 10; // 设置上下间距
    upperPanel.margins = 10; // 上下边距

    // 创建一个数组存储控件
    var groupItems = [];

    // 创建对象名称和复选框
    for (var i = 0; i < selectedItems.length; i++) {
        var group = upperPanel.add("group"); // 创建每行的组
        group.orientation = "row"; // 水平排列
        group.alignChildren = "center"; // 居中对齐

        // 左侧：对象名称（文本框）
        var objectName = selectedItems[i].name || "Unnamed Object " + (i + 1);
        var objectNameText = group.add("statictext", undefined, objectName.length > 10 ? objectName.substring(0, 10) + "..." : objectName);

        // 中间：复选框，用于选择是否操作该对象
        var checkbox = group.add("checkbox", undefined, "选择");
        checkbox.value = true; // 默认选中
        checkbox.margins = 10; // 设置左右列之间的间距
        // 右侧：目标图层选择下拉框
        var layerList = group.add("dropdownlist", undefined, layerNames);
        layerList.selection = 0; // 默认选择第一个图层

        groupItems.push({
            checkbox: checkbox,
            object: selectedItems[i],
            layerList: layerList
        }); // 保存每行的控件
    }

    // 创建下半部分的面板 (确认与取消按钮)
    var lowerPanel = dialog.add("group");
    lowerPanel.orientation = "row";
    lowerPanel.alignChildren = "center"; // 将按钮居中
    lowerPanel.spacing = 20; // 按钮之间的间距

    var moveBtn = lowerPanel.add("button", undefined, "移动到图层");
    var cancelBtn = lowerPanel.add("button", undefined, "取消");

    // 点击确认时执行
    moveBtn.onClick = function() {
        if (selectedItems.length > 0) {
            // 遍历每一行，获取选择的目标图层，并检查复选框
            for (var i = 0; i < selectedItems.length; i++) {
                if (groupItems[i].checkbox.value) { // 如果复选框被选中
                    var selectedLayerName = groupItems[i].layerList.selection.text;
                    var selectedLayer = doc.layers.getByName(selectedLayerName);

                    // 将当前对象移动到目标图层
                    groupItems[i].object.move(selectedLayer, ElementPlacement.PLACEATEND);
                }
            }

            alert("选择的对象已成功移动！");
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
