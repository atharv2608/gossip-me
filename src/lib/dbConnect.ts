import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Database already connected");
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || "");
        console.log("Database connected to host: ",db.connection.host)
        connection.isConnected = db.connections[0].readyState
    } catch(error){
        console.error("Database connection failed: ", error)
        process.exit(1)
    }
}

export default dbConnect