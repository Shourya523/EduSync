import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();
type ConnectionObject={
    isConnected?:number;
}
const connection:ConnectionObject={}
async function dbConnect():Promise<void>{
    if(connection.isConnected)
    {
        console.log("is already connected");
        return;
    }
    try {
        const db=await mongoose.connect(process.env.MONGODB_URI||'',{})
        connection.isConnected=db.connections[0].readyState;
        console.log("Connection successful");
        
    } catch (error) {
        console.log('DB connection failed', error);
        process.exit(1);        
    }
}
export default dbConnect;