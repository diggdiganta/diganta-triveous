"use client";
import TabSystem from "@/components/TabSystem";
import React, { createContext, useContext, useState } from "react";

const initialPaneTree = {
  id: "root",
  direction: null,
  children: [
    {
      id: "1",
      direction: "horizontal",
      children: [
        {
          id: "1-1",
          component: TabSystem, // first tab
          children: [],
        },
      ],
    },
  ],
};

// global tab state (some functionalities may be improved)
const initialTabs = [
  {
    id: 1,
    title: "Tab 1",
    content: "This is content for Tab 1",
  },
];

const PaneContext = createContext();

export const usePane = () => useContext(PaneContext);

export const PaneProvider = ({ children }) => {
  const [paneTree, setPaneTree] = useState(initialPaneTree);
  const [tabs] = useState(initialTabs);

  //   split pane horizontally and vertically  with before and after
  const splitPane = (
    paneId,
    direction = "horizontal",
    position = "after",
    paneTabs
  ) => {
    const findAndModify = (node, id) => {
      if (node.id === id) {
        const newItem1 = {
          id: `${id}-1`,
          children: [],
          component: node.component,
          data: paneTabs,
        };
        const newItem2 = {
          id: `${id}-2`,
          children: [],
          data: tabs,
          component: TabSystem,
        };

        console.log(direction, position);
        let newChildren = [];
        if (direction === "horizontal") {
          node.direction = "horizontal"; // Update direction
          newChildren =
            position === "after" ? [newItem1, newItem2] : [newItem2, newItem1];
        } else {
          node.direction = "vertical"; // Update direction
          newChildren =
            position === "after" ? [newItem1, newItem2] : [newItem2, newItem1];

          node.children = [];
        }
        node.children = newChildren;
        return true; // Modification done
      }

      // Continue searching in children
      for (const child of node.children || []) {
        const modified = findAndModify(child, id);
        if (modified) return true; // Stop searching once modification is done
      }

      return false; // Target pane not found in this branch
    };

    const updatedPaneTree = { ...paneTree }; // Clone the current state for immutability
    findAndModify(updatedPaneTree, paneId); // Attempt to modify the pane
    setPaneTree(updatedPaneTree); // Update the state with the modified structure
  };
  console.log(paneTree);
  return (
    <PaneContext.Provider value={{ paneTree, splitPane, tabs }}>
      {children}
    </PaneContext.Provider>
  );
};
