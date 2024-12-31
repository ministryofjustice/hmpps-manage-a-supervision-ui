function listChildren(node, level) {
  let j
  for (j = 0; j < node.getChildCount(); j++) {
    print(Array(level + 1).join('    ') + node.getChildAt(j).getNodeName())
    listChildren(node.getChildAt(j), level + 1)
  }
}

root = model.getSession().getSiteTree().getRoot()

listChildren(root, 0)
