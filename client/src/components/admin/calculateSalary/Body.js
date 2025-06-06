import React, { useEffect, useState } from "react";
import {
  Engineering as AdminIcon,
  Person,
  InsertInvitation as InsertInvitationIcon,
  SupportAgent as SupportAgentIcon,
  AttachMoney as AttachMoneyIcon,
  HowToReg as HowToRegIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Cake,
  Email,
  Phone,
  School,
  Image
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import FileBase from "react-file-base64";
import { addAdmin } from "../../../redux/actions/adminActions";
import { Select, MenuItem, Button, Avatar, Box, Typography, Divider } from "@mui/material";
import Spinner from "../../../utils/Spinner";
import { ADD_ADMIN, SET_ERRORS } from "../../../redux/actionTypes";

const Body = () => {
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const departments = useSelector((state) => state.admin.allDepartment);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const [value, setValue] = useState({
    facultyName: "",
    month: "",
    year: new Date().getFullYear().toString(),
    presentDay: "",
    leaveDay: "",
    bonus: [{ name: "", amount: "" }],
    deduction: [{ name: "", amount: "" }],
    email: "",
    department: "",
    contactNumber: "",
    avatar: "",
    password: "",
    username: "",
  });

  useEffect(() => {
    if (Object.keys(store.errors).length !== 0) {
      setError(store.errors);
      setValue(prev => ({ ...prev, email: "" }));
    }
  }, [store.errors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);
    dispatch(addAdmin(value));
  };

  useEffect(() => {
    if (store.errors || store.admin.adminAdded) {
      setLoading(false);
      if (store.admin.adminAdded) {
        resetForm();
        dispatch({ type: SET_ERRORS, payload: {} });
        dispatch({ type: ADD_ADMIN, payload: false });
      }
    } else {
      setLoading(true);
    }
  }, [store.errors, store.admin.adminAdded]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  const resetForm = () => {
    setValue({
      facultyName: "",
      month: "",
      year: new Date().getFullYear().toString(),
      presentDay: "",
      leaveDay: "",
      bonus: [{ name: "", amount: "" }],
      deduction: [{ name: "", amount: "" }],
      email: "",
      department: "",
      contactNumber: "",
      avatar: "",
      password: "",
      username: "",
    });
    setError({});
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 color:'black' ">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <AdminIcon className="text-indigo-600 mr-3" fontSize="large" />
          <h1 className="text-2xl font-bold text-gray-800">Add CalCulate Salary</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* Faculty Name, Month, Year - One Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Person className="text-gray-500 mr-2" fontSize="small" />
                  Faculty Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter faculty name"
                  value={value.facultyName}
                  onChange={(e) => setValue({ ...value, facultyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <InsertInvitationIcon className="text-gray-500 mr-2" fontSize="small" />
                  Month</label>
                <input
                  type="text"
                  placeholder="Month"
                  required
                  value={value.month}
                  onChange={(e) => setValue({ ...value, month: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <InsertInvitationIcon className="text-gray-500 mr-2" fontSize="small" />Year</label>
                <input
                  type="number"
                  placeholder="Year"
                  required
                  value={value.year}
                  onChange={(e) => setValue({ ...value, year: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Present Days, Leave Days - One Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  < HowToRegIcon className="text-gray-500 mr-2" fontSize="small" />Present Days</label>
                <input
                  type="number"
                  placeholder="Present Days"
                  required
                  value={value.presentDay}
                  onChange={(e) => setValue({ ...value, presentDay: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  < SupportAgentIcon className="text-gray-500 mr-2" fontSize="small" />Leave Days</label>
                <input
                  type="number"
                  placeholder="Leave Days"
                  required
                  value={value.leaveDay}
                  onChange={(e) => setValue({ ...value, leaveDay: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <Divider></Divider>

            <Typography variant="h6" gutterBottom>
                <CurrencyRupeeIcon  className="text-gray-500 mr-2" fontSize="small" />

              Bonus
            </Typography>


            <div>
              {value.bonus.map((b, i) => (
                <div key={i} className="grid grid-cols-2 gap-4 mb-2">
                  <input
                    placeholder="Bonus Name"
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    value={b.name}
                    onChange={(e) => {
                      const updated = [...value.bonus];
                      updated[i].name = e.target.value;
                      setValue({ ...value, bonus: updated });
                    }}
                  />
                  <input
                    placeholder="Amount"
                    type="number"
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    value={b.amount}
                    onChange={(e) => {
                      const updated = [...value.bonus];
                      updated[i].amount = e.target.value;
                      setValue({ ...value, bonus: updated });
                    }}
                  />
                </div>
              ))}
            </div>
            <Divider></Divider>
 <Typography variant="h6" gutterBottom>

                < AttachMoneyIcon className="text-gray-500 mr-2" fontSize="small" />

            Deduction
            </Typography>

            {/* Deduction Section - One Row Per Entry */}
            <div>
              
              {value.deduction.map((d, i) => (
                <div key={i} className="grid grid-cols-2 gap-4 mb-2">
                  <input
                    placeholder="Deduction Name"
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    value={d.name}
                    onChange={(e) => {
                      const updated = [...value.deduction];
                      updated[i].name = e.target.value;
                      setValue({ ...value, deduction: updated });
                    }}
                  />
                  <input
                    placeholder="Amount"
                    type="number"
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    value={d.amount}
                    onChange={(e) => {
                      const updated = [...value.deduction];
                      updated[i].amount = e.target.value;
                      setValue({ ...value, deduction: updated });
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <Button variant="outlined" onClick={resetForm}>Clear Form</Button>
              <Button
                type="submit"
                variant="contained"
                className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <Spinner
                    message="Creating Admin..."
                    height={24}
                    width={140}
                    color="#ffffff"
                    messageColor="#ffffff"
                  />
                ) : (
                  "Create Salary"
                )}
              </Button>
            </div>

            {/* Error Display */}
            {error.backendError && (
              <Box className="mt-4 p-3 bg-red-50 rounded-lg">
                <Typography className="text-red-600 text-sm">
                  {error.backendError}
                </Typography>
              </Box>
            )}
          </form>

        </div>
      </div>
    </div>

  );
};

export default Body;











