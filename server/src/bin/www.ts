/**
 * 模块依赖
 * - app: 引入Express应用实例
 * - http: Node.js内置HTTP模块，用于创建HTTP服务器
 */
import app from '../app';
import http from 'http';

/**
 * 从环境变量获取端口号，如果环境变量中没有设置，则使用默认端口3000
 * 并将端口号设置到Express应用中
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * 创建HTTP服务器
 * 使用Express应用实例app作为请求处理函数
 */
const server = http.createServer(app);

/**
 * 让服务器开始监听指定端口
 * 监听所有网络接口上的连接
 * 同时设置错误事件和监听事件的处理函数
 */
server.listen(port);
server.on('error', onError);
server.on("listening", onListening);

/**
 * 标准化端口号
 * 将输入的端口值转换为数字、字符串或false
 * @param {string|number} val - 输入的端口值
 * @returns {number|string|boolean} - 标准化后的端口值
 *   - 如果是有效的数字端口号，返回数字
 *   - 如果是命名管道，返回字符串
 *   - 如果无效，返回false
 */
function normalizePort(val: string): number | string | false {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // 命名管道
        return val;
    }

    if (port >= 0) {
        // 端口号
        return port;
    }

    return false;
}

/**
 * HTTP服务器错误事件监听器
 * 处理服务器启动和监听过程中的错误
 * @param {Error} error - 错误对象
 */
function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind =
        typeof port === "string" ? "Pipe " + port : "Port " + port;

    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * HTTP服务器"listening"事件的监听器
 */
function onListening(): void {
    const addr = server.address();
    const bind =
        typeof addr === "string"
            ? "pipe " + addr
            : "port " + addr?.port;

    console.log("Listening on " + bind);
}