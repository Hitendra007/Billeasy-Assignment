import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
const bookSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    author:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    price:{
        type:Number,
        required:true,
        default:0,
    },
    User:{
        type:Schema.Types.ObjectId,
        'ref':'User'
    }
},{timestamps:true})

bookSchema.plugin(mongooseAggregatePaginate)
export const Book = mongoose.model('Book',bookSchema)