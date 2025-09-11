import mongoose from "mongoose"

const connectDB = async ()=>{
    try {
       await  mongoose.connect(process.env.CONNECTION_STRING)
        console.log("mongoDB is connected")
    } catch (error) {
        console.log(`error in mongoDb connection : ${error}`)
    }
}

export default connectDB