import {useCallback, useEffect, useState} from "react";
import {Button, Suggestion} from "../components/components.ts";
import {getSuggestions, type Suggestion_t} from "../apis.ts";

const HOME_ORDER: Record<0 | 1 | 2, number> = {
    1: 0, // 通过
    2: 1, // 未通过
    0: 2  // 待审核
};

function sortForHome(a: Suggestion_t, b: Suggestion_t) {
    const s = HOME_ORDER[a.status] - HOME_ORDER[b.status];
    if (s !== 0) return s;
    return +new Date(b.time) - +new Date(a.time);
}

function ShowSuggestions(props: { className?: string }) {
    const [suggestions, setSuggestions] = useState<Suggestion_t[]>([]);

    const sorted = [...suggestions].sort(sortForHome);

    const loadSuggestions = useCallback(() => {
        getSuggestions().then(setSuggestions);
    }, []);

    useEffect(() => {
        loadSuggestions();
    }, [loadSuggestions]);

    return (
        <div className={props.className}>
            <Button text="刷新" click={loadSuggestions}/>

            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>提出者</th>
                    <th>标题</th>
                    <th>详述</th>
                    <th>时间</th>
                    <th>状态</th>
                    <th>回复</th>
                </tr>
                </thead>

                <tbody>
                {sorted.map(s => {
                    if (s === null) {
                        return null;
                    }
                    return <Suggestion
                        key={s.id}
                        id={s.id}
                        role={s.role}
                        short_des={s.short_des}
                        long_des={s.long_des}
                        status={s.status}
                        response={s.response}
                        time={s.time}
                        isEdit={false}/>
                })}
                </tbody>
            </table>
        </div>
    );
}

export default ShowSuggestions;