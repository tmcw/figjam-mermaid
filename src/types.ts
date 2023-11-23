import { EventHandler } from "@create-figma-plugin/utilities";

export interface ConvertHandler extends EventHandler {
  name: "CONVERT";
  handler: () => void;
}

export interface GraphHandler extends EventHandler {
  name: "graph";
  handler: (graph: {
    edges: {
      start: string;
      end: string;
      text: string;
      arrowStart: ConnectorStrokeCap;
      arrowEnd: ConnectorStrokeCap;
    }[];
    nodes: Record<
      string,
      {
        text: string;
      }
    >;
  }) => void;
}

export interface CloseHandler extends EventHandler {
  name: "CLOSE";
  handler: () => void;
}
