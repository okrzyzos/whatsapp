import mongoose from 'mongoose';

const whatsappSchema = mongoose.Schema({
    image:String,
message:String,
name:String,
timestamp:String,
received:Boolean

})

export default mongoose.model('messagecontents',whatsappSchema);