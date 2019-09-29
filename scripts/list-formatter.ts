namespace List2Tree {
    enum Symbol {
        Bar = "│",
        Node = "├─",
        EndNode = "└─"
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

    export function render(string: string): string {
        let lines = processText(string)
        console.log(lines.map(x => `${x.text} ${x.level}`))
        let tree = constructTree(lines)
        console.log(tree)
        return formatTree(tree, [])
    }

    function processText(string: string): Line[] {
        var lines: Line[] = []

        for (let textLine of string.split("\n")) {
            lines.push({ text: textLine.replace(/^\s*/, ""), level: textLine.length - textLine.replace(/^\s*/, "").length })
        }

        return lines
    }

    function constructTree(lines: Line[]): Tree | undefined {
        let firstLine = lines.shift()
        var stack: Tree[] = [{ value: firstLine.text, level: firstLine.level, children: [] }]

        while (lines.length > 0) {
            var line = lines.shift()
            let lastLine = stack[stack.length-1]

            while (line.level < lastLine.level) {
                stack.pop()
                lastLine = stack[stack.length-1]
            }

            if (line.level >= lastLine.level) {
                let parent = lastLine
                parent.children.push({ value: line.text, level: line.level, children: [] })
            }
        }

        return stack.pop()
    }

    function formatTree(tree: Tree, lineage: Node[]): string {
        var result = formatNode({ value: tree.value, isLastChild: false }, lineage)
        let children = tree.children

        for (let child of children) {
            result += formatTree(child, lineage.concat({ value: child.value, isLastChild: child == children[children.length - 1] }))
        }
        
        return result
    }

    function formatNode(node: Node, lineage: Node[]): string {
        var result = ""

        var i = 0
        for (let node of lineage) {
            let isCurrentNode = (i == lineage.length - 1)

            switch ([node.isLastChild, isCurrentNode].join()) {
                case ([true, true].join()):
                    result += `${Symbol.EndNode} `
                    break
                case [true, false].join():
                    result += "   "
                    break
                case [false, true].join():
                    if (node.value == "") {
                        result += `${Symbol.Bar} `
                    }
                    else {
                        result += `${Symbol.Node} `
                    }
                    break
                case [false, false].join():
                    result += `${Symbol.Bar}  `
                    break
            }
            i += 1
        }

        result += `${node.value}\n`

        return result
    }
}

$(document).ready(function() {
    $("#input").on("input", function(event) {
        let text = $(this).val().toString();
        $("#output").text(List2Tree.render(text));
    });
});