"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var useFormSubmit_1 = __importDefault(require("../../utils/helpers/useFormSubmit"));
var FieldError_1 = __importDefault(require("../FieldError"));
var DriverForm = function () {
    var initialData = {
        name: "",
        email: "",
        dob: "",
        lno: "",
        address: "",
        sex: "",
        expdate: "",
        genotype: "",
        image: { name: null },
        userType: "driver"
    };
    var postURL = "".concat(process.env.REACT_APP_BASE_URL, "/saveUser");
    var _a = (0, useFormSubmit_1["default"])(initialData, postURL), formData = _a.formData, errors = _a.errors, isGeneralError = _a.isGeneralError, generalError = _a.generalError, handleChange = _a.handleChange, handleSubmit = _a.handleSubmit;
    return (react_1["default"].createElement("form", { className: "flex flex-col gap-5", onSubmit: handleSubmit },
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "name", className: "text-[#12141D] text-sm font-medium leading-5" }, "Name"),
            react_1["default"].createElement("input", { type: "text", name: "name", id: "name", placeholder: "Joseph Jimmy", className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]", value: formData.name, onChange: handleChange }),
            errors.name && (react_1["default"].createElement("span", { className: "text-red-500 text-sm" }, "Name is required."))),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "email", className: "text-[#12141D] text-sm font-medium leading-5" }, "Enter email address"),
            react_1["default"].createElement("input", { type: "email", name: "email", id: "email", placeholder: "e.g dayo.abdullahi@gmail.com", value: formData.email, onChange: handleChange, className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]" }),
            errors.email && (react_1["default"].createElement("span", { className: "text-red-500 text-sm" }, "Email is required."))),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "dob", className: "text-[#12141D] text-sm font-medium leading-5" }, "Date of birth"),
            react_1["default"].createElement("input", { type: "date", name: "dob", id: "dob", value: formData.dob, onChange: handleChange, placeholder: "9/10/1989", className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]" }),
            errors.dob && (react_1["default"].createElement("span", { className: "text-red-500 text-sm" }, "Dob is required."))),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "lno", className: "text-[#12141D] text-sm font-medium leading-5" }, "L/NO"),
            react_1["default"].createElement("input", { type: "text", name: "lno", id: "lno", placeholder: "AASU1219SDSJDSD", value: formData.lno, onChange: handleChange, className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]" }),
            errors.lno && (react_1["default"].createElement("span", { className: "text-red-500 text-sm" }, "L/No is required."))),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "address", className: "text-[#12141D] text-sm font-medium leading-5" }, "Address"),
            react_1["default"].createElement("input", { type: "text", name: "address", id: "address", placeholder: "Majiro Street", value: formData.address, onChange: handleChange, className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]" }),
            errors.address && (react_1["default"].createElement("span", { className: "text-red-500 text-sm" }, "Address is required."))),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "sex", className: "text-[#12141D] text-sm font-medium leading-5" }, "Sex"),
            react_1["default"].createElement("input", { type: "text", name: "sex", id: "sex", placeholder: "male", value: formData.sex, onChange: handleChange, className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]" }),
            errors.sex && (react_1["default"].createElement("span", { className: "text-red-500 text-sm" }, "Sex is required."))),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "expdate", className: "text-[#12141D] text-sm font-medium leading-5" }, "Exp date"),
            react_1["default"].createElement("input", { type: "date", name: "expdate", id: "expdate", placeholder: "exp", value: formData.expdate, onChange: handleChange, className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]" }),
            errors.expdate && (react_1["default"].createElement("span", { className: "text-red-500 text-sm" }, "Exp. Date is required."))),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "genotype", className: "text-[#12141D] text-sm font-medium leading-5" }, "Genotype"),
            react_1["default"].createElement("input", { type: "text", name: "genotype", id: "genotype", placeholder: "AA", value: formData.genotype, onChange: handleChange, className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]" }),
            errors.genotype && (react_1["default"].createElement("span", { className: "text-danger-red text-sm" }, "Genotype is required."))),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "image", className: "text-[#12141D] text-sm font-medium leading-5" }, "Profile Picture"),
            react_1["default"].createElement("input", { type: "file", name: "image", id: "image", placeholder: "AA", className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]", onChange: handleChange }),
            react_1["default"].createElement(FieldError_1["default"], { error: errors.genotype, text: "image is required" })),
        isGeneralError && (react_1["default"].createElement("span", { className: "text-red-500 text-sm mt-4" }, generalError || "Complete all required fields.")),
        react_1["default"].createElement("button", { type: "submit", className: "rounded-md bg-[#3058A6] py-3 px-6 text-white text-sm font-medium leading-5 border-[1px] cursor-pointer hover:bg-white hover:border-[#3058A6] hover:text-[#3058A6] transition linear " }, "Continue")));
};
exports["default"] = DriverForm;
