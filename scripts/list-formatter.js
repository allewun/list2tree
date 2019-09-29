var List2Tree;
(function (List2Tree) {
    var Symbol;
    (function (Symbol) {
        Symbol["Bar"] = "\u2502";
        Symbol["Node"] = "\u251C\u2500";
        Symbol["EndNode"] = "\u2514\u2500";
    })(Symbol || (Symbol = {}));
    function render(string) {
        var lines = processText(string);
        console.log(lines.map(function (x) { return x.text + " " + x.level; }));
        var tree = constructTree(lines);
        console.log(tree);
        return formatTree(tree, []);
    }
    List2Tree.render = render;
    function processText(string) {
        var lines = [];
        for (var _i = 0, _a = string.split("\n"); _i < _a.length; _i++) {
            var textLine = _a[_i];
            lines.push({ text: textLine.replace(/^\s*/, ""), level: textLine.length - textLine.replace(/^\s*/, "").length });
        }
        return lines;
    }
    function constructTree(lines) {
        var firstLine = lines.shift();
        var stack = [{ value: firstLine.text, level: firstLine.level, children: [] }];
        while (lines.length > 0) {
            var line = lines.shift();
            var lastLine = stack[stack.length - 1];
            while (line.level < lastLine.level) {
                stack.pop();
                lastLine = stack[stack.length - 1];
            }
            if (line.level >= lastLine.level) {
                var parent_1 = lastLine;
                parent_1.children.push({ value: line.text, level: line.level, children: [] });
            }
        }
        return stack.pop();
    }
    function formatTree(tree, lineage) {
        var result = formatNode({ value: tree.value, isLastChild: false }, lineage);
        var children = tree.children;
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            result += formatTree(child, lineage.concat({ value: child.value, isLastChild: child == children[children.length - 1] }));
        }
        return result;
    }
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
    $("#input").on("input", function (event) {
        var text = $(this).val().toString();
        $("#output").text(List2Tree.render(text));
    });
});
