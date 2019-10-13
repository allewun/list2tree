var List2Tree;
(function (List2Tree) {
    var Symbol;
    (function (Symbol) {
        var Style;
        (function (Style) {
            Style[Style["unicode"] = "unicode"] = "unicode";
            Style[Style["ascii"] = "ascii"] = "ascii";
        })(Style = Symbol.Style || (Symbol.Style = {}));
        function bar(style) {
            switch (style) {
                case Style.ascii: return "|";
                case Style.unicode: return "│";
            }
        }
        Symbol.bar = bar;
        function node(style, terminal) {
            switch (style) {
                case Style.ascii: return terminal ? "`-" : "|-";
                case Style.unicode: return terminal ? "└─" : "├─";
            }
        }
        Symbol.node = node;
    })(Symbol || (Symbol = {}));
    var defaultSymbolStyle = Symbol.Style.unicode;
    function render(string, opt) {
        var options = parseOptions(opt);
        var lines = processText(string);
        var lineGroups = groupLines(lines);
        var trees = lineGroups.map(function (group) { return constructTree(group); });
        var formattedTrees = trees.map(function (tree) { return formatTree(tree, [], options.style); });
        return formattedTrees.join("");
    }
    List2Tree.render = render;
    List2Tree.tabSize = 2;
    function parseOptions(options) {
        var styleOption = options["style"];
        var style = Symbol.Style[styleOption] || defaultSymbolStyle;
        return { style: style };
    }
    function processText(string) {
        var lines = [];
        for (var _i = 0, _a = string.trim().split("\n"); _i < _a.length; _i++) {
            var textLine = _a[_i];
            var text = textLine.replace(/^\s*/, "");
            lines.push({ text: text, level: textLine.length - text.length });
        }
        return lines;
    }
    function groupLines(lines) {
        return lines.reduce(function (accum, line) {
            if (line.level == 0) {
                accum.push([line]);
                return accum;
            }
            else {
                accum[accum.length - 1].push(line);
                return accum;
            }
        }, []);
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
            var parent_1 = void 0;
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
            parent_1 = lastNode;
            parent_1.children.push(currentNode);
            stack.push(currentNode);
        }
        return stack[0];
    }
    function formatTree(tree, lineage, style) {
        var result = formatNode({ value: tree.value, isLastChild: false }, lineage, style);
        var children = tree.children;
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            result += formatTree(child, lineage.concat({ value: child.value, isLastChild: child == children[children.length - 1] }), style);
        }
        return result;
    }
    function formatNode(node, lineage, style) {
        var result = "";
        var i = 0;
        for (var _i = 0, lineage_1 = lineage; _i < lineage_1.length; _i++) {
            var node_1 = lineage_1[_i];
            var isCurrentNode = (i == lineage.length - 1);
            console.log(Symbol.bar(style));
            switch ([node_1.isLastChild, isCurrentNode].join()) {
                case [true, true].join():
                    result += Symbol.node(style, true) + " ";
                    break;
                case [true, false].join():
                    result += "   ";
                    break;
                case [false, true].join():
                    if (node_1.value == "") {
                        result += Symbol.bar(style) + " ";
                    }
                    else {
                        result += Symbol.node(style, false) + " ";
                    }
                    break;
                case [false, false].join():
                    result += Symbol.bar(style) + "  ";
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
function render() {
    var text = $("#input").val().toString();
    var options = {
        "style": $("input[type=radio][name=style]:checked").val()
    };
    $("#output").text(List2Tree.render(text, options));
}
function theme() {
    var themeOverride = $("input[type=radio][name=theme]:checked").val();
    var systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    switch (themeOverride) {
        case "light":
            setDark(false);
            break;
        case "dark":
            setDark(true);
            break;
        default:
            setDark(systemDarkMode);
            break;
    }
}
function setDark(isDark) {
    if (isDark) {
        $("body").addClass("theme-dark");
        $("label[for=theme-light]").removeClass("i");
        $("label[for=theme-dark]").addClass("i");
    }
    else {
        $("body").removeClass("theme-dark");
        $("label[for=theme-light]").addClass("i");
        $("label[for=theme-dark]").removeClass("i");
    }
}
$(document).ready(function () {
    theme();
    $("input[type=radio][name=style]").on("change", function (event) {
        render();
    });
    $("#input").on("input", function (event) {
        render();
    });
    $("input[type=radio][name=theme]").on("change", function (event) {
        theme();
    });
    $("textarea").on("keydown", function (event) {
        var textarea = event.target;
        // enter key
        if (event.which === 13) {
            var cursor = textarea.selectionStart;
            var currentLine = textarea.value.currentLine(cursor);
            var currentIndentation = currentLine.replace(/[^\s].*$/, "");
            var newValue = textarea.value.substring(0, cursor) + ("\n" + currentIndentation) + textarea.value.substring(cursor);
            var newCursor = cursor + 1 + currentIndentation.length;
            textarea.value = newValue;
            textarea.setSelectionRange(newCursor, newCursor);
            event.preventDefault();
            $(this).trigger("input");
        }
        // tab key
        else if (event.which === 9) {
            var cursor = textarea.selectionStart;
            var tab = " ".repeat(List2Tree.tabSize);
            var newValue = textarea.value.substring(0, cursor) + tab + textarea.value.substring(cursor);
            var newCursor = cursor + tab.length;
            textarea.value = newValue;
            textarea.setSelectionRange(newCursor, newCursor);
            event.preventDefault();
            $(this).trigger("input");
        }
    });
});
