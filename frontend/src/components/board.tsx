import { useEffect, useState } from "react";
import styles from "./board.module.css";
import { Square } from "./square";
import type { BoardType } from "../types/types";
import { socket } from "../socket";

const idToColour = (id: string) => {
    var hash = 0, i, chr;
    if (id.length === 0) return hash;
    for (i = 0; i < id.length; i++) {
        chr = id.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    const r = ((hash & 0xFF0000) / 2) & 0xFF0000;
    const g = ((hash & 0x00FF00) / 2) & 0x00FF00;
    const b = ((hash & 0x0000FF) / 2) & 0x0000FF;
    return r + g + b;
}


export const Board = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_isConnected, setIsConnected] = useState(socket.connected);

    const [board, setBoard] = useState<BoardType | null>(null);
    const [hoverState, setHoverState] = useState<{[index: number]: string[]}>({});

    // Send to Server
    const leftClick = (index: number) => socket.emit("uncover", index);
    const rightClick = (index: number) => socket.emit("flag", index);
    const hover = (index: number) => socket.emit("hover", index);
    const reset = () => socket.emit("reset");

    useEffect(() => {
        const onConnect = () => {
            console.log("connected as", socket.id);
            setIsConnected(true)
        };
        const onDisconnect = () => setIsConnected(false);
        const updateBoard = (b: BoardType) => setBoard(b);
        const updateHoverState = (state: {[id: string]: number}) => {
            const newHoverState: {[index: number]: string[]} = {};
            for (const id in state) {
                if (state[id] === -1 || id === socket.id) continue;
                if (!(state[id] in newHoverState))
                    newHoverState[state[id]] = [];
                newHoverState[state[id]].push(`#${idToColour(id).toString(16)}`);
            }
            setHoverState(newHoverState);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("receiveBoard", updateBoard);
        socket.on("hoverState", updateHoverState);


        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("receiveBoard", updateBoard);
            socket.off("hoverState", updateHoverState);
        };
    }, []);

    return (
        <div className={styles.board}>
            <div className={styles.board_top}>
                {board === null ? "Connecting..." : (
                    <>
                    {board.status === "lose" ? "RIP"
                    : board.status === "win" ? "Congrats!"
                    : board.status === "empty" ? "Click any cell to start"
                    : `${board.minesRemaining} mines remaining`}
                    <button onClick={reset}>Reset</button>
                    </>
                )}
            </div>
            <div className={styles.grid}>
                {board === null ? (
                    <></>
                ) : (
                    board.s.map((state, i) => {
                        return (
                            <div className={styles.square_wrapper} key={`square${i}`}>
                                {(hoverState[i] ?? []).map((colour) =>
                                    <div
                                        key={colour}
                                        className={styles.hover_cursor}
                                        style={{backgroundColor: colour}}
                                    >
                                    </div>
                                )}
                                <Square
                                    value={board.v[i]}
                                    state={state}
                                    status={board.status}
                                    leftClickCallback={() => leftClick(i)}
                                    rightClickCallback={() => rightClick(i)}
                                    hoverCallback={() => hover(i)}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
