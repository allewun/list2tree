namespace List2Tree {
    enum _Symbol {
        Bar = "│",
        Node = "├─",
        EndNode = "└─"
    }

    type Tree = {
        value: string;
        children: Tree[]; 
    }

    type _Node = {
        value: string;
        isLastChild: boolean;
    }

    export function constructTree(string: string, stack: Tree[]): Tree {
        return { value: "", children: [] };
    }

    export function formatTree(tree: Tree, lineage: _Node[]): string {
        var result = formatNode({ value: tree.value, isLastChild: false }, [])
        let children = tree.children

        for (let child of children) {
            result += formatTree(child, lineage.concat({ value: child.value, isLastChild: child == children[children.length-1] }))
        }
        
        return result
    }

    function formatNode(node: _Node, lineage: _Node[]): string {
        var result = ""

        var i = 0
        for (let node of lineage) {
            let isCurrentNode = (i == lineage.length - 1)

            switch ([node.isLastChild, isCurrentNode]) {
                case [true, true]:
                    result += `${_Symbol.EndNode} `
                    break
                case [true, false]:
                    result += "   "
                    break
                case [false, true]:
                    if (node.value == "") {
                        result += `${_Symbol.Bar} `
                    }
                    else {
                        result += `${_Symbol.Node} `
                    }
                    break
                case [false, false]:
                    result += `${_Symbol.Bar}  `
            }
        }

        result += `${node.value}\n`

        return result
    }
}

$(document).ready(function() {
    $("#textarea").on("input", function(event) {
        let text = $(this).val().toString();
        console.log(List2Tree.constructTree(text, []))
    });
});