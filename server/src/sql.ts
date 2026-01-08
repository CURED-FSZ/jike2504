import mysql from "mysql2/promise"
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

const pool = mysql.createPool({
    host: "localhost",
    user: "suggestions",
    password: "35090611",
    database: "suggestions",
    waitForConnections: true,
    connectionLimit: 10,
});

type SuggestionRow = RowDataPacket & {
    ID: number;
    role: string;
    short_des: string;
    long_des: string;
    status: 0 | 1 | 2;
    response: string;
    time: string;
};

export async function insert(role: string, short: string, long: string): Promise<boolean> {
    try{
        const [result] = await pool.query<ResultSetHeader>(
            "INSERT INTO `suggestions` (role, short_des, long_des, status) VALUES (?, ?, ?, 0)",
            [role, short, long]
        );
        return result.affectedRows === 1;
    }
    catch (error){
        if (error instanceof Error) {
            console.error("插入失败：", error.message);
        } else {
            console.error("插入失败：", error);
        }
        return false;
    }
}
export async function getSuggestions(): Promise<{ id: number; role: string; short_des: string; long_des: string; status: 0 | 1 | 2; response: string; time: string; }[]> {
    try {
        const [rows] = await pool.query<SuggestionRow[]>('SELECT ID, role, short_des, long_des, status, response, time FROM suggestions ORDER BY status DESC, time DESC');
        return rows.map((r: { ID: any; role: any; short_des: any; long_des: any; status: any; response: any; time: any; }) => ({
            id: r.ID,
            role: r.role,
            short_des: r.short_des,
            long_des: r.long_des,
            status: r.status,
            response: r.response,
            time: r.time
        }));
    } catch (error) {
        if (error instanceof Error) {
            console.error("获取建议列表失败：", error.message);
        } else {
            console.error("获取建议列表失败：", error);
        }
        return [];
    }
}

export async function updateAccepted(id: number, status: 0 | 1 | 2, response: string): Promise<boolean>{
    try{
        const [result] = await pool.query<ResultSetHeader>(
            "UPDATE suggestions SET status = ?, response = ? WHERE ID = ?",
            [status, response, id]
        );
        return result.affectedRows === 1;
    }
    catch (error){
        if (error instanceof Error) {
            console.error("更新状态失败：", error.message);
        } else {
            console.error("更新状态失败：", error);
        }
        return false;
    }
}