import mongoose from 'mongoose';
const connectDB=async():Promise<void>=>{
    try{
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('MongoDB connected sucessfully');
    }
    catch(err){
        console.error('MongoDB connection failed',err);
        process.exit(1);
    }
}
export default connectDB;