//移动对象到指定图层高亮选择并预览
//21_movetolayer1.jsx
//Moving Object

function createMoveToLayerDialog() {
    var doc = app.activeDocument;
    var selectedItems = doc.selection;

    // 若没选中对象则提示并返回
    if (selectedItems.length === 0) {
        alert("没有选中任何对象。");
        return;
    }

    // 获取所有图层名称
    var layers = doc.layers;
    var layerNames = [];
    for (var i = 0; i < layers.length; i++) {
        layerNames.push(layers[i].name);
    }

    // 创建对话框及相关面板
    var dialog = new Window("dialog", "(JUN)移动对象到图层V1");
    dialog.orientation = "column";
    dialog.alignChildren = "fill";
    dialog.spacing = 10;
    dialog.margins = 10;

    // 创建表格形式布局来合并显示选中对象与图层选择
    var tablePanel = dialog.add("panel", undefined, "点击对象名以预览");
    tablePanel.orientation = "column";
    tablePanel.alignChildren = "fill";
  tablePanel.spacing = 10;
    tablePanel.margins = [10,15,10,15];

    var rows = [];
    for (var i = 0; i < selectedItems.length; i++) {
        var rowPanel = tablePanel.add("group", undefined, "");
        rowPanel.orientation = "row";
        rowPanel.alignChildren = "center";
        rowPanel.spacing = 10;

        // 显示选中对象名称
        var objectName = selectedItems[i].name || "Unnamed Object " + (i + 1);
        var nameLabel = rowPanel.add("statictext", undefined, objectName.length > 10? objectName.substring(0, 30) + "..." : objectName);
        nameLabel.alignment = "left";

        // 图层选择下拉框
        var layerList = rowPanel.add("dropdownlist", undefined, layerNames);
        layerList.selection = 0;

        // 创建一个包含当前行信息的对象，并添加到rows数组
        var rowInfo = {
            nameLabel: nameLabel,
            layerList: layerList
        };
        rows.push(rowInfo);

        // 为nameLabel添加点击事件处理函数，使用闭包保存当前行的索引
        (function (index) {
            nameLabel.addEventListener('click', function () {
                var selectedIndex = index;
                if (selectedIndex!== -1) {
                    for (var i = 0; i < selectedItems.length; i++) {
                        resetHighlight(selectedItems[i]);
                       //app.executeMenuCommand('Adobe Transparency Palette Menu Item')
                    }
                    highlightObject(selectedItems[selectedIndex]);
                   
                }
            });
        })(i);
    }

    // 下半部分面板（确认与取消按钮）
    var lowerPanel = dialog.add("group");
    lowerPanel.orientation = "row";
    lowerPanel.alignChildren = ["center", "center"];
    lowerPanel.spacing = 20;

    var moveBtn = lowerPanel.add("button", undefined, "批量移动到图层");
    var cancelBtn = lowerPanel.add("button", undefined, "取消");

    // 点击确定按钮逻辑
    moveBtn.onClick = function () {
        if (selectedItems.length > 0) {
            for (var i = 0; i < selectedItems.length; i++) {
                var selectedLayerName = rows[i].layerList.selection.text;
                var selectedLayer = doc.layers.getByName(selectedLayerName);
                selectedItems[i].move(selectedLayer, ElementPlacement.PLACEATEND);
            }
            dialog.close();
        } else {
            alert("请先选择一个或多个对象");
        }
    };

    // 点击取消按钮逻辑
    cancelBtn.onClick = function () {
        dialog.close();
    };

    // 显示对话框
    dialog.show();
}
// 辅助函数：高亮选中对象
function highlightObject(obj) {
     var doc = app.activeDocument;
    
    obj.selected = true;
}

// 辅助函数：重置对象高亮状态
function resetHighlight(obj) {
     var doc = app.activeDocument;
       obj.selected = false;
}


// 执行脚本
createMoveToLayerDialog();
