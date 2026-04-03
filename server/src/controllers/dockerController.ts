import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { removeContainer } from '../services/dockerService';
import User from '../models/userModel';


export const destroyContainer = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userID as string;
        const containerId = req.containerID as string;

        await removeContainer(containerId);

        // Clear containerId from DB
        await User.findByIdAndUpdate(userId, { containerId: '' });

        res.status(200).json({ message: 'Container destroyed' });
    } catch (error) {
        console.error('Destroy container error:', error);
        res.status(500).json({ message: 'Failed to destroy container' });
    }
};
