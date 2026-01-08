import { useState } from "react";
import { Input, Button, type InputRules } from "../components/components.ts";
import { createSuggestion } from "../apis.ts"


// 输入框验证
function validate(value: string, rules: InputRules): string {
    const length = Array.from(value).length;
    const isRequired = rules.required ?? false;
    console.log(value+' '+JSON.stringify( rules)+' '+isRequired);

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

function InputSuggestion(props:{className?: string}) {
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
        <div className={props.className}>
            称呼(可留空)：
            <Input alert="" value={role} onChange={setRole} error={roleError}/>

            标题：
            <Input alert="在此输入..." value={shortDes} onChange={setShortDes} error={shortDesError}/>

            详细描述：
            <Input alert="在此输入..." value={longDes} onChange={setLongDes} error={longDesError}/>

            <div>
                <Button text="重置" click={reset}/> <Button text="确认提交" click={submit}/>
            </div>

        </div>
    )
}

export default InputSuggestion;