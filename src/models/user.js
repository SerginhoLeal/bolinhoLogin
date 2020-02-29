const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
    nome:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        select: false,// para a senha não ir junto quando tiver uma listagem de usuario
    },
    description:{
        type:String,
        required:true
    },
    // likes:[{
    //     type:Schema.Types.ObjectId,
    //     ref:'User',
    // }],
    // dislikes:[{
    //     type:Schema.Types.ObjectId,
    //     ref:'User',
    // }],
    data:{
        type: Date,
        default:Date.now,
    }
});

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;

