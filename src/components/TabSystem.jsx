"use client";
import React, { useState } from "react";
import { usePane } from "../../PaneContext";

const TabComponent = ({ content }) => <div>{content}</div>;

const TabSystem = ({ ownId, prevTabs }) => {
  const { splitPane, tabs } = usePane();

  // for right click menu
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    tabId: null,
  });

  const handleContextMenu = (event, tabId) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      tabId: tabId,
    });
  };
  const renderContextMenu = () => {
    if (!contextMenu.visible) return null;

    return (
      <ul
        className='absolute bg-white border border-gray-300 rounded-md shadow-lg'
        style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        onMouseLeave={() => setContextMenu({ ...contextMenu, visible: false })}
      >
        {["Up", "Down", "Left", "Right"].map((direction) => (
          <li
            key={direction}
            className='p-2 cursor-pointer hover:bg-gray-100'
            onClick={() =>
              handleSplit(direction.toLowerCase(), contextMenu.tabId)
            }
          >
            Split {direction}
          </li>
        ))}
      </ul>
    );
  };

  // split handle
  const handleSplit = (direction, tabId) => {
    console.log(`Split ${direction} from tab ${tabId}`);

    splitPane(
      ownId,
      direction == "up" || direction == "down" ? "vertical" : "horizontal",
      direction == "left" || direction == "up" ? "before" : "after",
      paneTabs
    );

    setContextMenu({ ...contextMenu, visible: false });
  };

  const [paneTabs, setPaneTabs] = useState(prevTabs ?? tabs);
  const [activeTab, setActiveTab] = useState(1);

  const addTab = () => {
    const newTabId = paneTabs.length + 1;
    const newTab = {
      id: newTabId,
      title: `Tab ${newTabId}`,
      content: `This is content for Tab ${newTabId}`,
    };
    setPaneTabs([...paneTabs, newTab]);
    setActiveTab(newTabId);
  };

  const renderTabs = () => (
    <div className='tabs'>
      {paneTabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${
            activeTab === tab.id ? "border-blue-600" : "border-gray-300"
          } border-2 p-1 m-1 rounded-md`}
          onClick={() => setActiveTab(tab.id)}
          onContextMenu={(e) => handleContextMenu(e, tab.id)}
        >
          {tab.title}
        </button>
      ))}
      <button onClick={addTab}>+</button>
      {renderContextMenu()}
    </div>
  );

  // Updated renderActiveTabContent function to display content based on the active tab
  const renderActiveTabContent = () => {
    const activeTab1 = paneTabs.find((tab) => tab.id === activeTab);
    return (
      <div className='mt-5 text-xl tab-content'>
        <TabComponent content={activeTab1?.content} />
      </div>
    );
  };

  return (
    <div className='tab-system'>
      {renderTabs()}
      {renderActiveTabContent()}
    </div>
  );
};

export default TabSystem;
