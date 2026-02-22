const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Employee = require("../models/Employee");
const cloudinary = require("../config/cloudinary");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const makeError = (field, message) => ({ field, message });

const signToken = (user) => {

  return jwt.sign(
    { userId: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "2h" }
  );
};

const uploadToCloudinaryIfBase64 = async (maybeBase64) => {
  if (!maybeBase64) return "";

  if (typeof maybeBase64 === "string" && maybeBase64.startsWith("http")) {
    return maybeBase64;
  }

  if (typeof maybeBase64 === "string" && maybeBase64.startsWith("data:image/")) {
    const uploaded = await cloudinary.uploader.upload(maybeBase64, {
      folder: "comp3133_assignment1_employee_photos",
      resource_type: "image",
    });
    return uploaded.secure_url; 
  }


  return maybeBase64;
};

const resolvers = {
  Query: {
    _health: () => "OK",

    login: async (_, { input }) => {
      const errors = [];
      const { identifier, password } = input;

      if (!identifier || identifier.trim() === "") {
        errors.push(makeError("identifier", "Username or email is required"));
      }
      if (!password || password.trim() === "") {
        errors.push(makeError("password", "Password is required"));
      }
      if (errors.length) {
        return { success: false, message: "Validation failed", errors, token: null, user: null };
      }

      const user = await User.findOne({
        $or: [{ username: identifier.trim() }, { email: identifier.trim().toLowerCase() }],
      });

      if (!user) {
        return {
          success: false,
          message: "Invalid credentials",
          errors: [makeError("identifier", "User not found")],
          token: null,
          user: null,
        };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          success: false,
          message: "Invalid credentials",
          errors: [makeError("password", "Incorrect password")],
          token: null,
          user: null,
        };
      }

      const token = signToken(user);

      return {
        success: true,
        message: "Login successful",
        errors: [],
        token,
        user,
      };
    },

    getAllEmployees: async () => {
      const employees = await Employee.find().sort({ created_at: -1 });
      return {
        success: true,
        message: "Employee list fetched successfully",
        errors: [],
        data: employees,
      };
    },

    getEmployeeByEid: async (_, { eid }) => {
      if (!eid) {
        return {
          success: false,
          message: "Validation failed",
          errors: [makeError("eid", "Employee id is required")],
          data: null,
        };
      }

      const emp = await Employee.findById(eid);
      if (!emp) {
        return {
          success: false,
          message: "Employee not found",
          errors: [makeError("eid", "No employee exists with this id")],
          data: null,
        };
      }

      return {
        success: true,
        message: "Employee fetched successfully",
        errors: [],
        data: emp,
      };
    },

    searchEmployee: async (_, { designation, department }) => {
      const errors = [];
      const filter = {};

      if (designation && designation.trim() !== "") {
        filter.designation = { $regex: designation.trim(), $options: "i" };
      }
      if (department && department.trim() !== "") {
        filter.department = { $regex: department.trim(), $options: "i" };
      }

      if (!designation && !department) {
        errors.push(makeError("designation/department", "Provide designation or department"));
        return { success: false, message: "Validation failed", errors, data: [] };
      }

      const employees = await Employee.find(filter).sort({ created_at: -1 });

      return {
        success: true,
        message: "Search results fetched successfully",
        errors: [],
        data: employees,
      };
    },
  },

  Mutation: {
    _healthMutation: () => "OK",


    signup: async (_, { input }) => {
      const errors = [];
      const username = input.username?.trim();
      const email = input.email?.trim().toLowerCase();
      const password = input.password;

      if (!username) errors.push(makeError("username", "Username is required"));
      if (!email) errors.push(makeError("email", "Email is required"));
      if (email && !isValidEmail(email)) errors.push(makeError("email", "Email is invalid"));
      if (!password) errors.push(makeError("password", "Password is required"));
      if (password && password.length < 6) errors.push(makeError("password", "Password must be at least 6 characters"));

      if (errors.length) {
        return { success: false, message: "Validation failed", errors, data: null };
      }

      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return { success: false, message: "Signup failed", errors: [makeError("username", "Username already exists")], data: null };
      }

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return { success: false, message: "Signup failed", errors: [makeError("email", "Email already exists")], data: null };
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashed,
      });

      return { success: true, message: "User created successfully", errors: [], data: user };
    },

    addEmployee: async (_, { input }) => {
      const errors = [];

      const requiredFields = ["first_name", "last_name", "email", "designation", "salary", "date_of_joining", "department"];
      requiredFields.forEach((f) => {
        if (input[f] === undefined || input[f] === null || String(input[f]).trim() === "") {
          errors.push(makeError(f, `${f} is required`));
        }
      });

      const email = input.email?.trim().toLowerCase();
      if (email && !isValidEmail(email)) errors.push(makeError("email", "Email is invalid"));

      if (input.gender && !["Male", "Female", "Other"].includes(input.gender)) {
        errors.push(makeError("gender", "Gender must be Male, Female, or Other"));
      }

      if (input.salary !== undefined && Number(input.salary) < 1000) {
        errors.push(makeError("salary", "Salary must be >= 1000"));
      }

      if (errors.length) {
        return { success: false, message: "Validation failed", errors, data: null };
      }

      const existingEmail = await Employee.findOne({ email });
      if (existingEmail) {
        return { success: false, message: "Employee creation failed", errors: [makeError("email", "Employee email already exists")], data: null };
      }

      let photoUrl = "";
      try {
        photoUrl = await uploadToCloudinaryIfBase64(input.employee_photo);
      } catch (e) {
        return { success: false, message: "Photo upload failed", errors: [makeError("employee_photo", e.message)], data: null };
      }

      const emp = await Employee.create({
        first_name: input.first_name.trim(),
        last_name: input.last_name.trim(),
        email,
        gender: input.gender,
        designation: input.designation.trim(),
        salary: Number(input.salary),
        date_of_joining: new Date(input.date_of_joining),
        department: input.department.trim(),
        employee_photo: photoUrl,
      });

      return { success: true, message: "Employee created successfully", errors: [], data: emp };
    },

 
    updateEmployeeByEid: async (_, { eid, input }) => {
      if (!eid) {
        return { success: false, message: "Validation failed", errors: [makeError("eid", "Employee id is required")], data: null };
      }

      const emp = await Employee.findById(eid);
      if (!emp) {
        return { success: false, message: "Employee not found", errors: [makeError("eid", "No employee exists with this id")], data: null };
      }

      const errors = [];
      if (input.email) {
        const email = input.email.trim().toLowerCase();
        if (!isValidEmail(email)) errors.push(makeError("email", "Email is invalid"));

        const emailUsed = await Employee.findOne({ email, _id: { $ne: eid } });
        if (emailUsed) errors.push(makeError("email", "Employee email already exists"));

        input.email = email;
      }

      if (input.gender && !["Male", "Female", "Other"].includes(input.gender)) {
        errors.push(makeError("gender", "Gender must be Male, Female, or Other"));
      }

      if (input.salary !== undefined && Number(input.salary) < 1000) {
        errors.push(makeError("salary", "Salary must be >= 1000"));
      }

      if (errors.length) {
        return { success: false, message: "Validation failed", errors, data: null };
      }

    
      if (input.employee_photo) {
        try {
          input.employee_photo = await uploadToCloudinaryIfBase64(input.employee_photo);
        } catch (e) {
          return { success: false, message: "Photo upload failed", errors: [makeError("employee_photo", e.message)], data: null };
        }
      }

    
      if (input.date_of_joining) {
        input.date_of_joining = new Date(input.date_of_joining);
      }

      const updated = await Employee.findByIdAndUpdate(eid, input, { new: true });

      return { success: true, message: "Employee updated successfully", errors: [], data: updated };
    },

    deleteEmployeeByEid: async (_, { eid }) => {
      if (!eid) {
        return { success: false, message: "Employee id is required" };
      }

      const emp = await Employee.findById(eid);
      if (!emp) {
        return { success: false, message: "Employee not found" };
      }

      await Employee.findByIdAndDelete(eid);

      return { success: true, message: "Employee deleted successfully" };
    },
  },

  User: {
    created_at: (u) => (u.created_at ? new Date(u.created_at).toISOString() : null),
    updated_at: (u) => (u.updated_at ? new Date(u.updated_at).toISOString() : null),
  },
  Employee: {
    created_at: (e) => (e.created_at ? new Date(e.created_at).toISOString() : null),
    updated_at: (e) => (e.updated_at ? new Date(e.updated_at).toISOString() : null),
    date_of_joining: (e) => (e.date_of_joining ? new Date(e.date_of_joining).toISOString() : null),
  },
};

module.exports = resolvers;