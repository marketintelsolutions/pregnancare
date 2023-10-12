"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var react_1 = __importDefault(require("react"));
var useFormSubmit_1 = __importDefault(require("../../utils/helpers/useFormSubmit"));
var FieldError_1 = __importDefault(require("../FieldError"));
var MotherForm = function () {
    var initialData = {
        email: "",
        firstname: "",
        age: "",
        children: "",
        pet: "",
        csection: "",
        bloodGroup: "",
        genotype: "",
        image: { name: null },
        userType: "pregnant woman"
    };
    var postURL = "".concat(process.env.REACT_APP_BASE_URL, "/saveUser");
    var _a = (0, useFormSubmit_1["default"])(initialData, postURL), formData = _a.formData, errors = _a.errors, isGeneralError = _a.isGeneralError, generalError = _a.generalError, handleChange = _a.handleChange, handleSubmit = _a.handleSubmit;
    return (react_1["default"].createElement("form", { className: "flex flex-col gap-5", onSubmit: handleSubmit },
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "email", className: "text-[#12141D] text-sm font-medium leading-5" }, "Enter email address"),
            react_1["default"].createElement("input", { type: "email", name: "email", id: "email", placeholder: "e.g dayo.abdullahi@gmail.com", className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]", value: formData.email, onChange: handleChange }),
            react_1["default"].createElement(FieldError_1["default"], { error: errors.email, text: "email is required" })),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "firstname", className: "text-[#12141D] text-sm font-medium leading-5" }, "Enter firstname"),
            react_1["default"].createElement("input", { type: "text", name: "firstname", id: "firstname", placeholder: "dayo", className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]", value: formData.firstname, onChange: handleChange }),
            react_1["default"].createElement(FieldError_1["default"], { error: errors.firstname, text: "firstname is required" })),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "age", className: "text-[#12141D] text-sm font-medium leading-5" }, "Age"),
            react_1["default"].createElement("input", { type: "number", name: "age", id: "age", placeholder: "28", className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]", value: formData.age, onChange: handleChange }),
            react_1["default"].createElement(FieldError_1["default"], { error: errors.age, text: "age is required" })),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "children", className: "text-[#12141D] text-sm font-medium leading-5" }, "Number of children"),
            react_1["default"].createElement("input", { type: "number", name: "children", id: "children", placeholder: "4", className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]", value: formData.children, onChange: handleChange }),
            react_1["default"].createElement(FieldError_1["default"], { error: errors.children, text: "children is required" })),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "pet", className: "text-[#12141D] text-sm font-medium leading-5" }, "Number of pet"),
            react_1["default"].createElement("input", { type: "number", name: "pet", id: "pet", placeholder: "1", className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]", value: formData.pet, onChange: handleChange }),
            react_1["default"].createElement(FieldError_1["default"], { error: errors.pet, text: "Pet is required" })),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "csection", className: "text-[#12141D] text-sm font-medium leading-5" }, "Number of C-section"),
            react_1["default"].createElement("input", { type: "number", name: "csection", id: "csection", placeholder: "2", className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]", value: formData.csection, onChange: handleChange }),
            react_1["default"].createElement(FieldError_1["default"], { error: errors.csection, text: "csection is required" })),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "bloodGroup", className: "text-[#12141D] text-sm font-medium leading-5" }, "Blood group"),
            react_1["default"].createElement("input", { type: "text", name: "bloodGroup", id: "bloodGroup", placeholder: "A", className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]", value: formData.bloodGroup, onChange: handleChange }),
            react_1["default"].createElement(FieldError_1["default"], { error: errors.bloodGroup, text: "Blood Group is required" })),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "genotype", className: "text-[#12141D] text-sm font-medium leading-5" }, "Genotype"),
            react_1["default"].createElement("input", { type: "text", name: "genotype", id: "genotype", placeholder: "AA", className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]", value: formData.genotype, onChange: handleChange }),
            react_1["default"].createElement(FieldError_1["default"], { error: errors.genotype, text: "genotype is required" })),
        react_1["default"].createElement("div", { className: "flex flex-col gap-2" },
            react_1["default"].createElement("label", { htmlFor: "image", className: "text-[#12141D] text-sm font-medium leading-5" }, "Profile Picture"),
            react_1["default"].createElement("input", { type: "file", name: "image", id: "image", placeholder: "AA", className: "rounded-lg p-3 placeholder-[#A8A8A8)] bg-[#F4F4F4]", onChange: handleChange }),
            react_1["default"].createElement(FieldError_1["default"], { error: errors.genotype, text: "image is required" })),
        isGeneralError && (react_1["default"].createElement("span", { className: "text-danger-red text-sm mt-4" }, generalError || "Complete all required fields.")),
        react_1["default"].createElement("button", { type: "submit", className: "rounded-md bg-[#3058A6] py-3 px-6 text-white text-sm font-medium leading-5 border-[1px] cursor-pointer hover:bg-white hover:border-[#3058A6] hover:text-[#3058A6] transition linear " }, "Continue")));
};
exports["default"] = MotherForm;
