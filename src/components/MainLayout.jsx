"use client";
import React from "react";
import Pane from "./Pane";
import TabSystem from "./TabSystem";
import { usePane } from "../../PaneContext";

export default function MainLayout() {
  const { paneTree } = usePane();

  return <Pane pane={paneTree} ownId='root' />;
}
