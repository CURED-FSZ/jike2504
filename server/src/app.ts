import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API 路由
app.use('/api', routes);

// 404
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Not Found' });
});

// 全局错误处理
app.use((err:Error, req:Request, res:Response, next:NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        message: err.message || 'Server Error'
    });
});

export default app;
