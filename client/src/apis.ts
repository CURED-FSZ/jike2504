const BASE_URL = "https://api.jike2504.cn/api";

export type Suggestion_t = {
    id: number;
    role: string;
    short_des: string;
    long_des: string;
    status: 0 | 1 | 2;
    response: string;
    time: string;
};

/**
 * 获取建议列表
 */
export async function getSuggestions(): Promise<Suggestion_t[]> {
    const res = await fetch(`${BASE_URL}/suggestions`);

    if (!res.ok) {
        throw new Error("获取建议列表失败");
    }

    console.log(JSON.stringify(res.json()));

    const data = await res.json();
    console.log(data);
    return data;
}

/**
 * 新增建议
 */
export async function createSuggestion(
    role: string,
    short_des: string,
    long_des: string
): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/suggestions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ role, short_des, long_des })
    });

    if (!res.ok) {
        throw new Error("新增建议失败");
    }

    return res.json();
}

/**
 * 更新通过状态
 */
export async function updateSuggestionAccepted(
    id: number,
    status: 0 | 1 | 2,
    response: string
): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/suggestions/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status, response })
    });

    if (!res.ok) {
        throw new Error("更新状态失败");
    }

    return res.json();
}
