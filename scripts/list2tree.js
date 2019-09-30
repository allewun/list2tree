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
        var tree = constructTree(lines);
        return formatTree(tree, []);
    }
    List2Tree.render = render;
    function processText(string) {
        var lines = [];
        for (var _i = 0, _a = string.trim().split("\n"); _i < _a.length; _i++) {
            var textLine = _a[_i];
            lines.push({ text: textLine.replace(/^\s*/, ""), level: textLine.length - textLine.replace(/^\s*/, "").length });
        }
        return lines;
    }
    function constructTree(lines) {
        if (lines.length == 0) {
            return undefined;
        }
        var firstLine = lines.shift();
        var stack = [{ value: firstLine.text, level: firstLine.level, children: [] }];
        var line;
        while ((line = lines.shift()) != null) {
            var currentNode = { value: line.text, level: line.level, children: [] };
            var lastNode = stack[stack.length - 1];
            var parent;
            // if last node in stack has a lower level than current line
            // => the last node is the parent of the current line
            if (lastNode.level < currentNode.level) {
                // last node is already the parent
            }
            // if last node in stack has same level as current line
            // => it last node and current line are siblings
            else if (lastNode.level == currentNode.level) {
                while (lastNode.level == currentNode.level) {
                    stack.pop();
                    lastNode = stack[stack.length - 1];
                }
            }
            // if last node in stack has higher level than current line
            // => the current line is in a new tree and we need to pop until we find its parent
            else {
                while (lastNode.level >= line.level) {
                    stack.pop();
                    lastNode = stack[stack.length - 1];
                }
            }
            parent = lastNode;
            parent.children.push(currentNode);
            stack.push(currentNode);
        }
        return stack[0];
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
String.prototype.currentLine = function (cursorIndex) {
    var i = cursorIndex;
    // find start of line
    while (this.substring(i - 1, i) !== "\n" && i > 0) {
        i--;
    }
    return this.substring(i, cursorIndex);
};
//-------------------------------------
$(document).ready(function () {
    $("#input").on("input", function (event) {
        var text = $(this).val().toString();
        $("#output").text(List2Tree.render(text));
    });
    $("textarea").on("keydown", function (event) {
        var textarea = event.target;
        // enter key
        if (event.which === 13) {
            var cursor = textarea.selectionStart;
            var currentLine = textarea.value.currentLine(cursor);
            var currentIndentation = currentLine.replace(/[^\s]/g, "");
            var newValue = textarea.value.substring(0, cursor) + ("\n" + currentIndentation) + textarea.value.substring(cursor);
            var newCursor = cursor + 1 + currentIndentation.length;
            textarea.value = newValue;
            textarea.setSelectionRange(newCursor, newCursor);
            event.preventDefault();
        }
        // tab key
        else if (event.which === 9) {
            var cursor = textarea.selectionStart;
            var tab = "  ";
            var newValue = textarea.value.substring(0, cursor) + tab + textarea.value.substring(cursor);
            var newCursor = cursor + tab.length;
            textarea.value = newValue;
            textarea.setSelectionRange(newCursor, newCursor);
            event.preventDefault();
        }
    });
});
