import {Input} from './input.tsx'

const STATUS: Record<0 | 1 | 2, { label: string; color: string }> = {
    0: { label: "待审核", color: "#facc15" },
    1: { label: "通过",   color: "#22c55e" },
    2: { label: "未通过", color: "#ef4444" }
};

export type SuggestionProps = {
    isEdit: boolean;
    id: number;
    role: string;
    short_des: string;
    long_des: string;
    status: 0 | 1 | 2;
    response: string;
    time: string;
    onStatusChange?: (id: number, status: 0 | 1 | 2) => void;
    onResponseChange?: (id: number, response: string) => void;
};

export function Suggestion(props: SuggestionProps) {
    const statusUI = STATUS[props.status];

    return (
        <tr>
            <td>{props.id}</td>
            <td>{props.role}</td>
            <td>{props.short_des}</td>
            <td>{props.long_des}</td>
            <td>{props.time}</td>
            <td>
                {props.isEdit ? (
                    <select
                        value={props.status}
                        onChange={e =>
                            props.onStatusChange?.(props.id, Number(e.target.value) as 0 | 1 | 2)
                        }
                    >
                        {Object.entries(STATUS).map(([key, v]) => (
                            <option key={key} value={key}>
                                {v.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <span style={{ color: statusUI.color, fontWeight: 600 }}>
                        {statusUI.label}
                    </span>
                )}
            </td>
            <td>
                {props.isEdit ? (
                    <Input
                        value={props.response}
                        onChange={(value) =>
                            props.onResponseChange?.(props.id, value)
                        }
                        error=""
                    />
                ) : (
                    props.response
                )}
            </td>
        </tr>
    );
}