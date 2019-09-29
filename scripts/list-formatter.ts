namespace List2Tree {
    enum Symbol {
        Bar = "│",
        Node = "├─",
        EndNode = "└─"
    }

    type Tree = {
        value: string;
        children: Tree[]; 
    }

    type Node = {
        value: string;
        isLastChild: boolean;
    }

    export function constructTree(string: string, stack: Tree[]): Tree {
        return { value: "", children: [] };
    }

    export function formatTree(tree: Tree, lineage: Node[]): string {
        var result = formatNode({ value: tree.value, isLastChild: false }, lineage)
        let children = tree.children

        for (let child of children) {
            result += formatTree(child, lineage.concat({ value: child.value, isLastChild: child == children[children.length-1] }))
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
    $("#textarea").on("input", function(event) {
        let text = $(this).val().toString();
        console.log(List2Tree.constructTree(text, []))

        let tree = { value: "Foods", children: [
            { value: "Fruits", children: [
                { value: "Apple", children: [] },
                { value: "Orange", children: [
                    { value: "Cara-Cara", children: [] },
                    { value: "Sour", children: [] },
                ] },
            ] }
        ] };

        console.log(List2Tree.formatTree(tree, []))
    });
});