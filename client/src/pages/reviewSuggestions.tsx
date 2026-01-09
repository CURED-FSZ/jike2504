import {useCallback, useEffect, useState} from "react";
import {getSuggestions, type Suggestion_t, updateSuggestionAccepted, deleteSuggestion} from "../apis.ts";
import {Button} from "../components/Button.tsx";
import {Suggestion} from "../components/components.ts";

type EditingState = {
    status: 0 | 1 | 2;
    response: string;
};

const REVIEW_ORDER: Record<0 | 1 | 2, number> = {
    0: 0, // 待审核
    1: 1, // 通过
    2: 2  // 未通过
};

function sortForReview(a: Suggestion_t, b: Suggestion_t) {
    const s = REVIEW_ORDER[a.status] - REVIEW_ORDER[b.status];
    if (s !== 0) return s;
    return +new Date(b.time) - +new Date(a.time);
}

function isModified(
    origin: Suggestion_t,
    editing: { status: 0 | 1 | 2; response: string }
): boolean {
    return (
        origin.status !== editing.status ||
        origin.response !== editing.response
    );
}

function ReviewSuggestions(props: { className?: string }) {
    const [suggestions, setSuggestions] = useState<Suggestion_t[]>([]);
    const [editing, setEditing] = useState<Record<number, EditingState>>({});
    const [authorized, setAuthorized] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const sorted = [...suggestions].sort(sortForReview);

    const loadSuggestions = useCallback(() => {
        getSuggestions().then(data => {
            setSuggestions(data);

            // 初始化编辑态
            const init: Record<number, EditingState> = {};
            data.forEach(s => {
                init[s.id] = {
                    status: s.status,
                    response: s.response
                };
            });
            setEditing(prev => {
                const next = {...prev};
                data.forEach(s => {
                    if (!next[s.id]) {
                        next[s.id] = {status: s.status, response: s.response};
                    }
                });
                return next;
            });
        });
    }, []);

    useEffect(() => {
        loadSuggestions();
    }, [loadSuggestions]);
    const checkPassword = () => {
        if (password === "35090611") {
            setAuthorized(true);
            setPasswordError("");
        } else {
            setPasswordError("密码错误");
        }
    }
    const onStatusChange = (id: number, status: 0 | 1 | 2) => {
        setEditing(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                status
            }
        }));
    };
    const onResponseChange = (id: number, response: string) => {
        setEditing(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                response
            }
        }));
    };
    const onDelete = async (id: number) => {
        const ok = window.confirm("确认要删除这条建议吗？删除后无法恢复。");
        if (!ok) return;

        try {
            await deleteSuggestion(id);

            // 本地立即移除（不用等刷新）
            setSuggestions(prev => prev.filter(s => s.id !== id));
            setEditing(prev => {
                const next = {...prev};
                delete next[id];
                return next;
            });
        } catch (err) {
            console.error(err);
            alert("删除失败");
        }
    };
    const submitAll = async () => {
        const tasks = suggestions
            .filter(s => {
                const e = editing[s.id];
                return e && isModified(s, e);
            })
            .map(s => {
                const e = editing[s.id];
                return updateSuggestionAccepted(s.id, e.status, e.response);
            });

        if (tasks.length === 0) {
            alert("没有需要提交的修改");
            return;
        }

        try {
            await Promise.all(tasks);
            alert(`成功提交 ${tasks.length} 条审核结果`);
            loadSuggestions();
        } catch (err) {
            console.error(err);
            alert("部分或全部提交失败");
        }
    };

    return (
        <div className={props.className}>

            {!authorized && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 999
                    }}
                >
                    <div
                        style={{
                            background: "#333333",
                            padding: "2rem",
                            borderRadius: "8px",
                            minWidth: "300px",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                        }}
                    >
                        <h3 style={{marginBottom: "1rem"}}>审核入口</h3>
                        输入密码，或者利用您自己的手段绕过。
                        <input
                            type="password"
                            placeholder="请输入密码"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    checkPassword();
                                }
                            }}
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginBottom: "0.5rem"
                            }}
                        />

                        {passwordError && (
                            <div style={{color: "red", marginBottom: "0.5rem"}}>
                                {passwordError}
                            </div>
                        )}

                        <Button text="确认" click={checkPassword}/>
                    </div>
                </div>
            )}

            <div style={{display: "flex", gap: "1rem", marginBottom: "1rem"}}>
                <Button text="刷新" click={loadSuggestions}/>
                <Button text="提交所有修改" click={submitAll}/>
            </div>

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
                    <th>删除</th>
                </tr>
                </thead>

                <tbody>
                {sorted.map(s => {
                    const edit = editing[s.id];
                    if (!edit) return null;

                    return <Suggestion
                        key={s.id}
                        id={s.id}
                        role={s.role}
                        short_des={s.short_des}
                        long_des={s.long_des}
                        status={edit.status}
                        response={edit.response}
                        time={s.time}
                        isEdit={true}
                        onStatusChange={onStatusChange}
                        onResponseChange={onResponseChange}
                        onDelete={onDelete}
                    />
                })}
                </tbody>
            </table>
        </div>
    );
}

export default ReviewSuggestions;