import mongoose, { mongo } from 'mongoose';
import { Password } from '../services/password';

/*All these interfaces that made is for removing the issues 
of typescript with mongoose . Actually it's just a work around */

//An interface that describes the properties
// that are required to create a new user
interface UserAtrrs {
  email: string;
  password: string;
}

//An interface that describes the properties that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAtrrs): UserDoc;
}

//An interface that describes the properties that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

//Inside of here in toJSON, we're going to define a set of properties that are going to help Mongoose take our user document and turn it into JSON.

//important concept here don't use ()=> arrow function in the argument
//for more clearance watch the video
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

//important trick to get the work of the typescript to check the attribute type
//before creating new user
userSchema.statics.build = (attrs: UserAtrrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
