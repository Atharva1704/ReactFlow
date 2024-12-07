import downloadIcon from "@iconify/icons-gg/software-download";
import { Icon } from "@iconify/react";
import { toPng } from "html-to-image";
import React from "react";
import {
    ControlButton,
    useReactFlow,
    getRectOfNodes,
    getViewportForBounds,
} from "reactflow";

// import styles from "./FlowView.module.css";

const downloadImage = (dataUrl) => {
    const a = document.createElement("a");

    a.setAttribute("download", "prismaliser.png");
    a.setAttribute("href", dataUrl);
    a.click();
};

const DownloadButton = () => {
    const { getNodes } = useReactFlow();
    const onClick = () => {
        const nodesBounds = getRectOfNodes(getNodes());
        const { height: imageHeight, width: imageWidth } = nodesBounds;
        const transform = getViewportForBounds(
            nodesBounds,
            imageWidth,
            imageHeight,
            0.5,
            2
        );
        const viewport = document.querySelector(".react-flow__viewport");

        toPng(viewport, {
            backgroundColor: "#e5e7eb",
            width: imageWidth,
            height: imageHeight,
            style: {
                width: `${imageWidth}px`,
                height: `${imageHeight}px`,
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
            },
        })
            .then(downloadImage)
            .catch(console.error);
    };

    return (
        <ControlButton
            // className={styles.noShrinkIcon}
            title="Download as PNG"
            onClick={onClick}
        >
            <Icon icon={downloadIcon} />
        </ControlButton>
    );
};

export default DownloadButton;
