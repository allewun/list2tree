#!/usr/bin/swift

enum Symbol {
    static let bar = "│"
    static let node = "├\(dash)"
    static let endNode = "└\(dash)"
    static let dash = "─"
}

struct Tree: Equatable {
    let value: String
    let children: [Tree]

    init(_ value: String, _ children: [Tree] = []) {
        self.value = value
        self.children = children
    }
}

struct Node {
    let value: String
    let isLastChild: Bool
}

func formatTree(_ tree: Tree, lineage: [Node] = []) -> String {
    var result = formatNode(Node(value: tree.value, isLastChild: false), lineage: lineage)

    for child in tree.children {
        result += formatTree(child, lineage: lineage + [Node(value: child.value, isLastChild: child == tree.children.last!)])
    }

    return result
}

func formatNode(_ node: Node, lineage: [Node]) -> String {
    var result = ""

    for (i, node) in lineage.enumerated() {
        let isCurrentNode = (i == lineage.count - 1)
        switch (node.isLastChild, isCurrentNode) {
            case (true, true):
                result += "\(Symbol.endNode) "
            case (true, false):
                result += "   "
            case (false, true):
                if node.value == "" {
                    result += "\(Symbol.bar) "
                }
                else {
                    result += "\(Symbol.node) "
                }
            case (false, false):
                result += "\(Symbol.bar)  "
        }
    }

    result += "\(node.value)\n"

    return result
}

let tree =
    Tree("Foods", [
        Tree(""),
        Tree("Fruits", [
            Tree("Apple"),
            Tree(""),
            Tree("Orange", [
                Tree("Cara-Cara"),
                Tree(""),
                Tree("Sour"),
            ]),
        ]),
        Tree("Vegetables"),
        Tree("Junk", [
            Tree("Pizza")
        ]),
        Tree("Japanese", [
            Tree("Sushi"),
            Tree("Tempura"),
            Tree("Udon", [
                Tree("Miki"),
                Tree("Marugame"),
            ]),
        ]),
    ]
)

print(formatTree(tree))

