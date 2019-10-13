namespace List2Tree {
    namespace Symbol {
        export enum Style {
            unicode = <any>"unicode", ascii = <any>"ascii"
        }

        export function bar(style: Style): string {
            switch (style) {
                case Style.ascii:   return "|"
                case Style.unicode: return "│"
            }
        }

        export function node(style: Style, terminal: Boolean): string {
            switch (style) {
                case Style.ascii:   return terminal ? "`-" : "|-"
                case Style.unicode: return terminal ? "└─" : "├─"
            }
        }
    }

    type Tree = {
        value: string;
        level: number,
        children: Tree[]; 
    }

    type Node = {
        value: string;
        isLastChild: boolean;
    }

    type Line = {
        text: string;
        level: number;
    }

    type Options = {
        style: Symbol.Style;
    }

    const defaultSymbolStyle = Symbol.Style.unicode

    export function render(string: string, opt: object): string {
        const options = parseOptions(opt)
        const lines = processText(string)
        const lineGroups = groupLines(lines)
        const trees = lineGroups.map(group => constructTree(group))
        const formattedTrees = trees.map(tree => formatTree(tree, [], options.style))

        return formattedTrees.join("")
    }

    function parseOptions(options: object): Options {
        let styleOption: string = options["style"]
        let style: Symbol.Style = Symbol.Style[styleOption] || defaultSymbolStyle
        return { style: style }
    }

    function processText(string: string): Line[] {
        let lines: Line[] = []

        for (const textLine of string.trim().split("\n")) {
            const text = textLine.replace(/^\s*/, "")
            lines.push({ text: text, level: textLine.length - text.length })
        }

        return lines
    }

    function groupLines(lines: Line[]): Line[][] {
        return lines.reduce(function (accum: Line[][], line): Line[][] {
            if (line.level == 0) {
                accum.push([line])
                return accum
            }
            else {
                accum[accum.length - 1].push(line)
                return accum
            }
        }, [])
    }

    function constructTree(lines: Line[]): Tree | undefined {
        if (lines.length == 0) { return undefined }

        const firstLine = lines.shift()
        let stack: Tree[] = [{ value: firstLine.text, level: firstLine.level, children: [] }]
        let line: Line;

        while ((line = lines.shift()) != null) {
            const currentNode = { value: line.text, level: line.level, children: [] }
            let lastNode = stack[stack.length - 1]
            let parent: Tree;

            // if last node in stack has a lower level than current line
            // => the last node is the parent of the current line
            if (lastNode.level < currentNode.level) {
                // last node is already the parent
            }
            // if last node in stack has same level as current line
            // => it last node and current line are siblings
            else if (lastNode.level == currentNode.level) {
                while (lastNode.level == currentNode.level) {
                    stack.pop()
                    lastNode = stack[stack.length - 1]
                }
            }
            // if last node in stack has higher level than current line
            // => the current line is in a new tree and we need to pop until we find its parent
            else {
                while (lastNode.level >= line.level) {
                    stack.pop()
                    lastNode = stack[stack.length - 1]
                }
            }

            parent = lastNode
            parent.children.push(currentNode)
            stack.push(currentNode)
        }

        return stack[0]
    }

    function formatTree(tree: Tree, lineage: Node[], style: Symbol.Style): string {
        let result = formatNode({ value: tree.value, isLastChild: false }, lineage, style)
        const children = tree.children

        for (const child of children) {
            result += formatTree(child, lineage.concat({ value: child.value, isLastChild: child == children[children.length - 1] }), style)
        }
        
        return result
    }

    function formatNode(node: Node, lineage: Node[], style: Symbol.Style): string {
        let result = ""

        let i = 0
        for (let node of lineage) {
            let isCurrentNode = (i == lineage.length - 1)

            console.log(Symbol.bar(style))

            switch ([node.isLastChild, isCurrentNode].join()) {
                case [true, true].join():
                    result += `${Symbol.node(style, true)} `
                    break
                case [true, false].join():
                    result += "   "
                    break
                case [false, true].join():
                    if (node.value == "") {
                        result += `${Symbol.bar(style)} `
                    }
                    else {
                        result += `${Symbol.node(style, false)} `
                    }
                    break
                case [false, false].join():
                    result += `${Symbol.bar(style)}  `
                    break
            }
            i += 1
        }

        result += `${node.value}\n`

        return result
    }
}

//-------------------------------------

interface String {
    currentLine(cursorIndex: number): string;
    repeat(count: number): string;
}

String.prototype.currentLine = function(cursorIndex) {
    let i = cursorIndex

    // find start of line
    while (this.substring(i-1, i) !== "\n" && i > 0) {
        i--;
    }

    return this.substring(i, cursorIndex)
};

//-------------------------------------

function render() {
    let text = $("#input").val().toString()
    let options = {
        "style": $("input[type=radio][name=style]:checked").val()
    }
    $("#output").text(List2Tree.render(text, options))
}

$(document).ready(function() {
    $("input[type=radio][name=style]").on("change", function(event) {
        render();
    });

    $("#input").on("input", function(event) {
        render();
    });

    $("textarea").on("keydown", function(event) {
        let textarea = <HTMLTextAreaElement>event.target

        // enter key
        if (event.which === 13) {
            let cursor = textarea.selectionStart
            let currentLine = textarea.value.currentLine(cursor)
            let currentIndentation = currentLine.replace(/[^\s].*$/, "")

            let newValue = textarea.value.substring(0, cursor) + `\n${currentIndentation}` + textarea.value.substring(cursor)
            let newCursor = cursor + 1 + currentIndentation.length

            textarea.value = newValue
            textarea.setSelectionRange(newCursor, newCursor)

            event.preventDefault()
            $(this).trigger("input")
        }

        // tab key
        else if (event.which === 9) {
            let cursor = textarea.selectionStart

            let tab = "  "
            let newValue = textarea.value.substring(0, cursor) + tab + textarea.value.substring(cursor)
            let newCursor = cursor + tab.length

            textarea.value = newValue
            textarea.setSelectionRange(newCursor, newCursor)

            event.preventDefault()
            $(this).trigger("input")
        }
    });
});
