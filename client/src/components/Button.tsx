export function Button(props: { text: string; click?: () => void; className? : string}) {
    return (
        <>
            <button onClick={props.click} className={props.className}>
                {props.text}
            </button>
        </>
    )
}