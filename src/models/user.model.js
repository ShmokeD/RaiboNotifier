import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    googleId:{
        type: String,
        validate: {
            validator: function (value) {
              // Google ID is required if email and password are not provided
              return this.email || this.password || value;
            },
            message: "Google ID is required if email and password are not provided.",
          },
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (value) {
              // Email is required if Google ID is not provided
              return this.googleId || value;
            },
            message: "Email is required if Google ID is not provided.",
          },
    },

    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        default: null,
        expires: 3000
    },
    password: {
        type: String,

    validate: {
                validator: function (value) {
                    // Password is required if Google ID is not provided
                    return this.googleId || value;
                },
                 message: "Password is required if Google ID is not provided.",
            },
    },
    phone: {
        type: String,
        trim: true
    },
    role: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Role'
        }
    ]
},
{
    timestamps: true,
})

export const User = mongoose.model('User', userSchema);
