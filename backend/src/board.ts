import type { Value, State, Board } from "./types/types";

const boards: { [name: string]: Board } = {};

const createEmptyBoard = (): Board => ({
    v: Array<Value>(16 * 30).fill(0),
    s: Array<State>(16 * 30).fill("C"),
    status: "empty",
    numUnopened: 16 * 30,
    minesRemaining: 99,
});

const getValidNeighbours = (i: number): Set<number> => {
    const neighbours = new Set([i - 31, i - 30, i - 29, i - 1, i + 1, i + 29, i + 30, i + 31]);
    if (i < 30) {
        neighbours.delete(i - 31);
        neighbours.delete(i - 30);
        neighbours.delete(i - 29);
    } else if (i >= (16 - 1) * 30) {
        neighbours.delete(i + 29);
        neighbours.delete(i + 30);
        neighbours.delete(i + 31);
    }
    if (i % 30 == 0) {
        neighbours.delete(i - 31);
        neighbours.delete(i - 1);
        neighbours.delete(i + 29);
    } else if (i % 30 == 29) {
        neighbours.delete(i - 29);
        neighbours.delete(i + 1);
        neighbours.delete(i + 31);
    }
    return neighbours;
}

const initBoard = (name: string, firstClickedIndex: number) => {
    const board = boards[name];

    // Create mines
    const s = new Set<number>();
    while (s.size < 99) {
        const r = Math.floor(Math.random() * (16 * 30));
        if (s.has(r) || r === firstClickedIndex) continue;
        s.add(r);
        board.v[r] = "M";
    }

    // Populate numbers
    for (let i = 0; i < 16 * 30; i++) {
        if (board.v[i] === "M") continue;
        const neighbours = getValidNeighbours(i); 
        let neighbourMines = 0;
        for (const neighbour of neighbours) {
            if (board.v[neighbour] === "M") neighbourMines++;
        }
        board.v[i] = neighbourMines as Value;
    }

    board.status = "playing";
    return board;
};

const uncover = (name: string, index: number) => {
    if (!(name in boards)) return;
    let board = boards[name];
    if (board.status === "empty") {
        board = initBoard(name, index);
    } else if (board.status === "win" || board.status === "lose") {
        return;
    }

    const neighbours = getValidNeighbours(index);

    if (board.s[index] === "C") {
        board.s[index] = "O";
        board.numUnopened--;
        if (board.v[index] === "M") {
            board.status = "lose";
            return;
        } else if (board.numUnopened === 99) {
            board.status = "win";
            return;
        }
    }
    else if (board.s[index] === "O" && board.v[index] !== "M") {
        let numFlaggedNeighbours = 0;
        for (const neighbour of neighbours) {
            if (board.s[neighbour] === "F") numFlaggedNeighbours++;
        }
        if (numFlaggedNeighbours === board.v[index]) {
            for (const neighbour of neighbours) {
                if (board.s[neighbour] === "C") {
                    uncover(name, neighbour);
                }
            }
        }
    }

    // Handle zeros
    for (const neighbour of neighbours) {
        if ((board.v[index] === 0 || board.v[neighbour] === 0) && board.s[neighbour] === "C") {
            uncover(name, neighbour);
        }
    }
};

const flag = (name: string, index: number) => {
    if (!(name in boards)) return;
    const board = boards[name];
    if (board.s[index] === "C") {
        board.s[index] = "F";
        board.minesRemaining--;
    }
    else if (board.s[index] === "F") {
        board.s[index] = "C";
        board.minesRemaining++;
    }
};

boards["default"] = createEmptyBoard();

export { createEmptyBoard, boards, uncover, flag };
