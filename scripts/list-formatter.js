var List2Tree;
(function (List2Tree) {
    var Symbol;
    (function (Symbol) {
        Symbol["Bar"] = "\u2502";
        Symbol["Node"] = "\u251C\u2500";
        Symbol["EndNode"] = "\u2514\u2500";
    })(Symbol || (Symbol = {}));
    function constructTree(string, stack) {
        return { value: "", children: [] };
    }
    List2Tree.constructTree = constructTree;
    function formatTree(tree, lineage) {
        var result = formatNode({ value: tree.value, isLastChild: false }, lineage);
        var children = tree.children;
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            result += formatTree(child, lineage.concat({ value: child.value, isLastChild: child == children[children.length - 1] }));
        }
        return result;
    }
    List2Tree.formatTree = formatTree;
    function formatNode(node, lineage) {
        var result = "";
        var i = 0;
        for (var _i = 0, lineage_1 = lineage; _i < lineage_1.length; _i++) {
            var node_1 = lineage_1[_i];
            var isCurrentNode = (i == lineage.length - 1);
            switch ([node_1.isLastChild, isCurrentNode].join()) {
                case ([true, true].join()):
                    result += Symbol.EndNode + " ";
                    break;
                case [true, false].join():
                    result += "   ";
                    break;
                case [false, true].join():
                    if (node_1.value == "") {
                        result += Symbol.Bar + " ";
                    }
                    else {
                        result += Symbol.Node + " ";
                    }
                    break;
                case [false, false].join():
                    result += Symbol.Bar + "  ";
                    break;
            }
            i += 1;
        }
        result += node.value + "\n";
        return result;
    }
})(List2Tree || (List2Tree = {}));
$(document).ready(function () {
    $("#textarea").on("input", function (event) {
        var text = $(this).val().toString();
        console.log(List2Tree.constructTree(text, []));
        var tree = { value: "Foods", children: [
                { value: "Fruits", children: [
                        { value: "Apple", children: [] },
                        { value: "Orange", children: [
                                { value: "Cara-Cara", children: [] },
                                { value: "Sour", children: [] },
                            ] },
                    ] }
            ] };
        console.log(List2Tree.formatTree(tree, []));
    });
});
