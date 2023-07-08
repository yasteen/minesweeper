import styles from "./board.module.css";
import type { Value, State, Status } from "../types/types";
import Flag from "./flag.svg";
import React from "react";

const colour: { [key in Value]: string } = {
    0: "white",
    1: "blue",
    2: "green",
    3: "red",
    4: "darkblue",
    5: "darkred",
    6: "teal",
    7: "black",
    8: "gray",
    M: "black",
};

type SquareProps = {
    state: State;
    value: Value;
    status: Status;
    leftClickCallback: Function;
    rightClickCallback: Function;
    hoverCallback: Function;
};

export const Square = (props: SquareProps) => {
    const handleLeftClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button === 0 || e.button === 1) props.leftClickCallback();
    };
    const handleMobileRightClickAndRemoveCtxMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.button !== 2) props.rightClickCallback();
    };
    const handleRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button === 2) props.rightClickCallback();
    };
    const handleHover = () => props.hoverCallback();

    return (
        <div
            onMouseUp={handleLeftClick}
            onContextMenu={handleMobileRightClickAndRemoveCtxMenu}
            onMouseDown={handleRightClick}
            onMouseEnter={handleHover}
        >
            {" "}
            {props.state === "O" ||
            (props.status === "lose" && props.value === "M") ? (
                <div
                    className={styles.square_uncovered +` ${props.value === "M" ? styles.square_bomb : ""}`}
                    style={{ color: colour[props.value] ?? "white" }}
                >
                    {props.value === 0 ? (
                        ""
                    ) : props.value === "M" ? (
                        <div className={styles.bomb}></div>
                    ) : (
                        props.value
                    )}
                </div>
            ) : (
                <div className={styles.square_covered}>
                    {props.state === "F" && (
                        <img src={Flag} alt="F" draggable={false} />
                    )}
                </div>
            )}{" "}
        </div>
    );
};
