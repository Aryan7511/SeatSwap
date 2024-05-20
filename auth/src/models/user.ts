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
/*You will notice that we have marked this function as async mongoose.
Very similar to Express is kind of in the old way of doing things.
Mongoose does not really have great support out of the box for async, await syntax instead to handle
any kind of asynchronous code that we want to run inside this little callback function, we get this
done argument so we are responsible for calling done once we have done all the work we need to do inside
of here. */

/*You'll also notice that I define this function using the function keyword as opposed to an arrow function
like this right here.
So quick reminder, whenever we put together a middleware function, we get access to the document that
is being saved.
So the actual user that we're trying to persist to the database as this inside of this function.
If we used an arrow function right here.
Then the value of this inside the function would be overridden and would be actually instead equal to
the context of this entire file as opposed to our user document, not what we want.
So that's why we are using the function keyword instead of the arrow function. */

userSchema.pre('save', async function (done) {
  //So even if we are just creating the user for the very first time ismodified('password') will return true 
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
