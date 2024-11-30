//25_2_seltoaB.jsx
//选中对象生成画板

var d = app.activeDocument;
var aB = d.artboards; // 获取当前文档中的所有画板
var sel = d.selection; // 获取当前选中的对象

// 如果有选中的对象
if (sel.length > 0) {
    // 遍历所有选中的对象
    for (var j = 0; j < sel.length; j++) {
        var Csel = sel[j]; // 获取当前选中的对象
        // 获取当前对象的可见边界
        var vB = Csel.visibleBounds;
        // 为选中的对象创建一个新的画板
        aB.add(vB);
    }    
} else {
   // alert("请先选择对象！");
}
