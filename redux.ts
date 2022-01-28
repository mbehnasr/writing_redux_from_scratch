type State = {
    count: number;
};


//recompose in android

type Action = { type: "Increment" } | { type: "Decrement" };

function countReducer(state: State = {count: 0}, action: Action): State {
    switch (action.type) {
        case "Decrement":
            return {count: state.count - 1}
        case "Increment":
            return {count: state.count + 1}
    }
    return state
}

let state: State | undefined = undefined;

//
// state = countReducer(state, {type: "Decrement"})
// state = countReducer(state, {type: "Increment"})
// state = countReducer(state, {type: "Increment"})
// const s = [
//     {type: "Increment"} as const,
//     {type: "Decrement"} as const,
//     {type: "Increment"} as const
// ].reduce(countReducer, {count: 0});


type Reducer<S, A> = (state: S, action: A) => S;

function createStore<S, A>(reducer: Reducer<S, A>) {
    let state: Readonly<S> = reducer(undefined as any, {type: ""} as any);

    type Listeners = (getState: () => S) => void;
    let listeners: Listeners[] = []

    function dispatch(a: A) {
        let newState = reducer(state, a)
        if (state !== newState) {
            state = newState
            listeners.forEach(x => {
                x(getState);
            })

        }
    }

    function getState() {
        return state;
    }

    function subscribe(f: Listeners) {
        listeners.push(f)
    }

    return {dispatch, getState, subscribe}
}


const store = createStore(countReducer)

store.subscribe((getState => {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(getState().count + ""));
    div.onclick = () => store.dispatch({type: "Increment"})
    document.body.appendChild(div);
    console.log("store State", getState())
}))
// console.log("Store State ", store.getState())
store.dispatch({type: "Increment"})
// console.log("Store State ", store.getState())
store.dispatch({type: "Increment"})
// console.log("Store State ", store.getState())
store.dispatch({type: "Decrement"})
// console.log("Store State ", store.getState())
store.dispatch({type: "Decrement"})
// console.log("Store State ", store.getState())



export {}