import {useState} from "react";
import {Button, Input, type InputRules} from "../components/components.ts";
import {createSuggestion} from "../apis.ts"


// 输入框验证
function validate(value: string, rules: InputRules): string {
    const length = Array.from(value).length;
    const isRequired = rules.required ?? false;
    console.log(value + ' ' + JSON.stringify(rules) + ' ' + isRequired);

    if (isRequired && !value.trim()) {
        console.log("不能为空");
        return "不能为空";
    }

    if (rules.minLength !== undefined && length < rules.minLength) {
        return `最少 ${rules.minLength} 个字`;
    }
    if (rules.maxLength !== undefined && length > rules.maxLength) {
        return `最多 ${rules.maxLength} 个字`;
    }
    if (rules.pattern && !rules.pattern.test(value)) {
        return "格式不正确";
    }
    return "";
}

function InputSuggestion(props: { className?: string }) {
    const [role, setRole] = useState("");
    const [shortDes, setShortDes] = useState("");
    const [longDes, setLongDes] = useState("");

    const [roleError, setRoleError] = useState("");
    const [shortDesError, setShortDesError] = useState("");
    const [longDesError, setLongDesError] = useState("");

    const roleRules: InputRules = {
        maxLength: 50,
    };
    const shortDesRules: InputRules = {
        maxLength: 100,
    }
    const longDesRules: InputRules = {
        maxLength: 1000,
        required: true
    }

    const reset = () => {
        setRole("");
        setShortDes("");
        setLongDes("");
    };

    const submit = () => {
        const roleErr = validate(role, roleRules);
        const shortErr = validate(shortDes, shortDesRules);
        const longErr = validate(longDes, longDesRules);

        setRoleError(roleErr);
        setShortDesError(shortErr);
        setLongDesError(longErr);

        if (roleErr || shortErr || longErr) {
            return;
        }
        createSuggestion(role, shortDes, longDes).then();
    }

    return (
        <div
            className={props.className}
            style={{
                maxWidth: "720px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
                padding: "1.5rem"
            }}
        >
            {/* 称呼 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <label style={{ fontSize: "0.9rem", opacity: 0.85 }}>
                    称呼（可留空）
                </label>
                <Input
                    alert=""
                    value={role}
                    onChange={setRole}
                    error={roleError}
                />
            </div>

            {/* 标题 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <label style={{ fontSize: "0.9rem", opacity: 0.85 }}>
                    标题
                </label>
                <Input
                    alert="在此输入..."
                    value={shortDes}
                    onChange={setShortDes}
                    error={shortDesError}
                />
            </div>

            {/* 详细描述 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <label style={{ fontSize: "0.9rem", opacity: 0.85 }}>
                    详细描述
                </label>
                <Input
                    alert="在此输入..."
                    value={longDes}
                    onChange={setLongDes}
                    error={longDesError}
                />
            </div>

            {/* 按钮区 */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.8rem",
                    marginTop: "1rem"
                }}
            >
                <Button text="重置" click={reset} />
                <Button text="确认提交" click={submit} />
            </div>
        </div>
    )
}

export default InputSuggestion;