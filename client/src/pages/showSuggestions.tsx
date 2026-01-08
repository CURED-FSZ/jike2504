import { useState, useEffect, useCallback} from "react";
import { Button, Suggestion } from "../components/components.ts";
import { getSuggestions, type Suggestion_t } from "../apis.ts";

function ShowSuggestions(props:{className?: string}) {
    const [suggestions, setSuggestions] = useState<Suggestion_t[]>([]);

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
                {suggestions.map(s => {
                    if(s === null) {
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