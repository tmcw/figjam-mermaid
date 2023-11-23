import {
  Button,
  Columns,
  Container,
  render,
  TextboxMultiline,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { on, emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";

import { CloseHandler, ConvertHandler, GraphHandler } from "./types";

function Plugin() {
  const [mermaid, setMermaid] = useState<string>("");
  useEffect(() => {
    emit<ConvertHandler>("CONVERT");
  }, []);
  const handleCloseButtonClick = useCallback(function () {
    emit<CloseHandler>("CLOSE");
  }, []);

  on<GraphHandler>("graph", (graph) => {
    const lines = [];
    const described = new Set<string>();
    for (let edge of graph.edges) {
      // Mermaid reuses the first description of a node.
      // So just describe once.
      let startDesc = "";
      if (!described.has(edge.start)) {
        startDesc = `[${JSON.stringify(graph.nodes[edge.start].text)}]`;
        described.add(edge.start);
      }

      let endDesc = "";
      if (!described.has(edge.end)) {
        endDesc = `[${JSON.stringify(graph.nodes[edge.end].text)}]`;
        described.add(edge.end);
      }

      let connectorExtra = "";
      if (edge.text) {
        connectorExtra = `|${edge.text}|`;
      }

      const caps: Record<ConnectorStrokeCap, [string, string]> = {
        NONE: ["-", "-"],
        ARROW_LINES: ["<", ">"],
        ARROW_EQUILATERAL: ["<", ">"],
        CIRCLE_FILLED: ["o", "o"],
        DIAMOND_FILLED: ["-", "-"],
        TRIANGLE_FILLED: ["<", ">"],
      };

      lines.push(
        `    ${edge.start}${startDesc} ${caps[edge.arrowStart][0]}--${
          caps[edge.arrowEnd][1]
        }${connectorExtra} ${edge.end}${endDesc}`,
      );
    }
    console.log(lines, graph);
    setMermaid(`flowchart LR\n${lines.join("\n")}`);
  });

  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <TextboxMultiline value={mermaid} variant="border" rows={18} />
      <VerticalSpace space="small" />
      <Columns space="extraSmall">
        <Button fullWidth onClick={handleCloseButtonClick} secondary>
          Close
        </Button>
      </Columns>
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
