const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // All fields mandatory (as per lab)
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },

    username: {
      type: String,
      required: [true, "username is required"],
      minlength: [4, "username must be at least 4 characters"],
      maxlength: [100, "username must be at most 100 characters"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "email must be a valid email address"],
    },

    address: {
      street: {
        type: String,
        required: [true, "address.street is required"],
        trim: true,
      },
      suite: {
        type: String,
        required: [true, "address.suite is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "address.city is required"],
        trim: true,
        match: [
          /^[A-Za-z\s]+$/,
          "city must contain only alphabets and spaces",
        ],
      },
      zipcode: {
        type: String,
        required: [true, "address.zipcode is required"],
        match: [/^\d{5}-\d{4}$/, "zipcode must be in format 12345-1234"],
      },
      // geo exists in the json but lab doesn't ask validation for it
      geo: {
        lat: { type: String, required: [true, "address.geo.lat is required"] },
        lng: { type: String, required: [true, "address.geo.lng is required"] },
      },
    },

    phone: {
      type: String,
      required: [true, "phone is required"],
      match: [/^\d-\d{3}-\d{3}-\d{4}$/, "phone must be in format 1-123-123-1234"],
    },

    website: {
      type: String,
      required: [true, "website is required"],
      trim: true,
      match: [/^https?:\/\/.+/i, "website must be a valid URL (http or https)"],
    },

    company: {
      name: {
        type: String,
        required: [true, "company.name is required"],
        trim: true,
      },
      catchPhrase: {
        type: String,
        required: [true, "company.catchPhrase is required"],
        trim: true,
      },
      bs: {
        type: String,
        required: [true, "company.bs is required"],
        trim: true,
      },
    },
  },
  { timestamps: true }
);

// nicer duplicate email error
userSchema.post("save", function (error, doc, next) {
  if (error && error.code === 11000) {
    next(new Error("email must be unique (duplicate email found)"));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
