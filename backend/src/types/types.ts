export type Value = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "M";
export type State = "O" | "C" | "F";
export type Status = "empty" | "playing" | "lose" | "win";

export type Board = {
    v: Array<Value>,
    s: Array<State>,
    status: Status,
    numUnopened: number,
    minesRemaining: number,
};
