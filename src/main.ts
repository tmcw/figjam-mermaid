import { emit, once, showUI } from "@create-figma-plugin/utilities";

import { CloseHandler, ConvertHandler } from "./types";

export default function () {
  once<ConvertHandler>("CONVERT", function () {
    const connectors = figma.root.findAll(
      (node) => node.type === "CONNECTOR",
    ) as ConnectorNode[];

    let edges = [];
    let nodes: Record<string, { text: string }> = {};

    for (let connector of connectors) {
      const start = connector.connectorStart;
      const end = connector.connectorEnd;

      if ("endpointNodeId" in start && "endpointNodeId" in end) {
        const startNode = figma.getNodeById(start.endpointNodeId);
        const endNode = figma.getNodeById(end.endpointNodeId);

        if (startNode?.type === "STICKY") {
          nodes[startNode.id] = { text: startNode.text.characters };
        }

        if (endNode?.type === "STICKY") {
          nodes[endNode.id] = { text: endNode.text.characters };
        }

        edges.push({
          start: start.endpointNodeId,
          end: end.endpointNodeId,
          text: connector.text.characters,
          arrowStart: connector.connectorStartStrokeCap,
          arrowEnd: connector.connectorEndStrokeCap,
        });
      }

      emit("graph", { edges, nodes });
    }
  });
  once<CloseHandler>("CLOSE", function () {
    figma.closePlugin();
  });
  showUI({
    height: 380,
    width: 360,
  });
}
