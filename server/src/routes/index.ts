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

router.delete(
    '/suggestions/:id',
    async (req: Request, res: Response, next: NextFunction) => {
        const rawId = req.params.id;
        const id = Number(rawId);

        console.log("[DELETE /suggestions] request", {
            rawId,
            parsedId: id
        });

        if (!Number.isInteger(id)) {
            console.warn("[DELETE /suggestions] invalid id", rawId);
            res.status(400).json({ message: "非法 ID" });
            return;
        }

        try {
            const ok = await deleteSuggestionById(id);

            console.log("[DELETE /suggestions] sql result", {
                id,
                ok
            });

            if (!ok) {
                res.status(404).json({ message: "未找到该建议" });
                return;
            }

            res.json({ success: true });
        } catch (err) {
            console.error("[DELETE /suggestions] exception", err);
            next(err);
        }
    }
);

export default router;