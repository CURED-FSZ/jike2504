import { Request, Response, NextFunction, Router } from 'express';
import { getSuggestions, insert, updateAccepted, deleteSuggestionById } from '../sql';

const router = Router();

router.get('/suggestions', async (req, res, next) => {
    try {
        res.json(await getSuggestions());
    } catch (err) {
        next(err);
    }
});

router.post('/suggestions', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role, short_des, long_des } = req.body;
        res.json(await insert(role, short_des, long_des));
    } catch (err) {
        next(err);
    }
});

router.put('/suggestions/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status, response } = req.body;
        res.json(await updateAccepted(Number(id), status, response));
    } catch (err) {
        next(err);
    }
});

router.delete('/suggestions/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const ok = await deleteSuggestionById(Number(id));

        if (!ok) {
            res.status(404).json({ message: "未找到该建议" });
            return;
        }

        res.json(true);
    } catch (err) {
        next(err);
    }
});

export default router;