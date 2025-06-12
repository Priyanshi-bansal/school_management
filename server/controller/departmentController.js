import Department from "../models/department";

export const addDepartment = async (req, res) => {
  try {
    const errors = { departmentError: String };
    const { department } = req.body;
    const existingDepartment = await Department.findOne({ department });
    if (existingDepartment) {
      errors.departmentError = "Department already added";
      return res.status(400).json(errors);
    }
    const departments = await Department.find({});
    let add = departments.length + 1;
    let departmentCode;
    if (add < 9) {
      departmentCode = "0" + add.toString();
    } else {
      departmentCode = add.toString();
    }

    const newDepartment = await new Department({
      department,
      departmentCode,
    });

    await newDepartment.save();
    return res.status(200).json({
      success: true,
      message: "Department added successfully",
      response: newDepartment,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { department } = req.body;

    await Department.findOneAndDelete({ department });

    res.status(200).json({ message: "Department Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};


export const getAllDepartment = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    console.log("Backend Error", error);
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { department, newDepartment } = req.body;

    const updatedDepartment = await Department.findOneAndUpdate(
        { department },
        { department: newDepartment },
        { new: true }
        );
    if (!updatedDepartment) {
        return res.status(404).json({ message: "Department not found" });
        }
    res.status(200).json({
        message: "Department updated successfully",
        response: updatedDepartment,
    });
    }
    catch (error) {
        const errors = { backendError: String };
        errors.backendError = error;
        res.status(500).json(errors);
    }
}

export const getDepartmentById = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(department);
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
}