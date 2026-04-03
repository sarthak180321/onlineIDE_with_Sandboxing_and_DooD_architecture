import {Schema, Document} from 'mongoose';
import mongoose from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    containerId: string;
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    containerId: { type: String, default: '' }
});


export default mongoose.model<IUser>('User', userSchema);
