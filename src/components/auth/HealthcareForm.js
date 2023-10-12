"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var useFormSubmit_1 = __importDefault(require("../../utils/helpers/useFormSubmit"));
var FieldError_1 = __importDefault(require("../FieldError"));
var HealthcareForm = function () {
    var initialData = {
        hospitalName: "",
        email: "",
        hospitalAddress: "",
        phone: "",
        image: { name: null },
        userType: "healthcare provider"
    };
    var postURL = "".concat(process.env.REACT_APP_BASE_URL, "/saveUser");
    var _a = (0, useFormSubmit_1["default"])(initialData, postURL), formData = _a.formData, errors = _a.errors, isGeneralError = _a.isGeneralError, generalError = _a.generalError, handleChange = _a.handleChange, handleSubmit = _a.handleSubmit;
    return (react_1["default"].createElement("form", { className: "flex flex-col gap-5", onSubmit: handleSubmit },
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "hospitalName", className: "text-[#12141D] text-sm font-medium leading-5" }, "Hospital Name"),
            react_1["default"].createElement("input", { type: "text", name: "hospitalName", id: "hospitalName", placeholder: "Breegs Health", className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]", value: formData.hospitalName, onChange: handleChange }),
            react_1["default"].createElement(FieldError_1["default"], { error: errors.hospitalName, text: "hospital name is required" })),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "email", className: "text-[#12141D] text-sm font-medium leading-5" }, "Email address"),
            react_1["default"].createElement("input", { type: "email", name: "email", id: "email", placeholder: "e.g dayo.abdullahi@gmail.com", value: formData.email, onChange: handleChange, className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]" }),
            react_1["default"].createElement(FieldError_1["default"], { error: errors.email, text: "email is required" })),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "hospitalAddress", className: "text-[#12141D] text-sm font-medium leading-5" }, "Address"),
            react_1["default"].createElement("input", { type: "text", name: "hospitalAddress", id: "hospitalAddress", placeholder: "Majiro Street", value: formData.hospitalAddress, onChange: handleChange, className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]" }),
            react_1["default"].createElement(FieldError_1["default"], { error: errors.hospitalAddress, text: "hospital address is required" })),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "phone", className: "text-[#12141D] text-sm font-medium leading-5" }, "Phone Number"),
            react_1["default"].createElement("input", { type: "phone", name: "phone", id: "phone", placeholder: "+234703000900", value: formData.genotype, onChange: handleChange, className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]" }),
            react_1["default"].createElement(FieldError_1["default"], { error: errors.phone, text: "phone is required" })),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "image", className: "text-[#12141D] text-sm font-medium leading-5" }, "Profile Picture"),
            react_1["default"].createElement("input", { type: "file", name: "image", id: "image", placeholder: "AA", className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]", onChange: handleChange }),
            react_1["default"].createElement(FieldError_1["default"], { error: errors.genotype, text: "image is required" })),
        isGeneralError && (react_1["default"].createElement("span", { className: "text-danger-red text-sm mt-4" }, generalError || "Complete all required fields.")),
        react_1["default"].createElement("button", { type: "submit", className: "rounded-md bg-[#3058A6] py-3 px-6 text-white text-sm font-medium leading-5 border-[1px] cursor-pointer hover:bg-white hover:border-[#3058A6] hover:text-[#3058A6] transition linear " }, "Continue")));
};
exports["default"] = HealthcareForm;
