import SalaryStructure from "../models/salaryStructure.js";
import SalaryPayment from "../models/salaryPayment.js";
import Faculty from "../models/faculty.js";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { sendEmailWithAttachment } from "../services/emailService.js";

const createSalaryStructure = async (req, res) => {
  try {
    const salaryStructure = new SalaryStructure({
      ...req.body,
      createdBy: req.userId,
    });
    await salaryStructure.save();
    res.status(201).json(salaryStructure);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateSalaryStructure = async (req, res) => {
  try {
    const salaryStructure = await SalaryStructure.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.userId,
      },
      { new: true }
    );
    if (!salaryStructure) {
      return res.status(404).json({ error: "Salary structure not found" });
    }
    res.json(salaryStructure);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSalaryStructures = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) filter.status = status;

    const salaryStructures = await SalaryStructure.find(filter)
      .populate("createdBy", "name")
      .populate("updatedBy", "name")
      .sort("-createdAt");

    res.json(salaryStructures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalaryStructureById = async (req, res) => {
  try {
    const salaryStructure = await SalaryStructure.findById(req.params.id)
      .populate("createdBy", "name")
      .populate("updatedBy", "name");

    if (!salaryStructure) {
      return res.status(404).json({ error: "Salary structure not found" });
    }

    res.json(salaryStructure);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Salary Payment Management
const calculateSalary = async (req, res) => {
  try {
    const {
      facultyId,
      month,
      year,
      presentDays,
      leaveDays,
      bonuses = [],
      deductions: customDeductions = [],
    } = req.body;

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    const salaryStructure = await SalaryStructure.findOne({
      role: faculty.role,
      status: "active",
    });

    if (!salaryStructure) {
      return res
        .status(404)
        .json({ error: "Active salary structure not found for this role" });
    }

    const workingDays = presentDays + leaveDays;
    if (workingDays === 0) {
      return res.status(400).json({ error: "Working days cannot be zero" });
    }

    // Helper for rounding
    const round = (val) => Math.round(val * 100) / 100;

    // Pro-rated basic salary
    const basicSalary = round(
      (salaryStructure.basicSalary / workingDays) * presentDays
    );

    const earnings = [];
    const deductionsList = [];

    // Fixed earnings
    salaryStructure.components
      .filter((c) => c.type === "earning" && c.calculationType === "fixed")
      .forEach((c) => {
        earnings.push({
          name: c.name,
          amount: round(c.amount),
          type: "fixed",
        });
      });

    // Percentage-based earnings
    salaryStructure.components
      .filter((c) => c.type === "earning" && c.calculationType === "percentage")
      .forEach((c) => {
        const base =
          c.basedOn === "basic" ? basicSalary : salaryStructure.basicSalary;
        const amount = round(base * (c.percentage / 100));
        earnings.push({
          name: c.name,
          amount,
          type: "percentage",
          percentage: c.percentage,
          basedOn: c.basedOn,
        });
      });

    // Fixed deductions
    salaryStructure.components
      .filter((c) => c.type === "deduction" && c.calculationType === "fixed")
      .forEach((c) => {
        deductionsList.push({
          name: c.name,
          amount: round(c.amount),
          type: "fixed",
        });
      });

    // Percentage-based deductions
    salaryStructure.components
      .filter(
        (c) => c.type === "deduction" && c.calculationType === "percentage"
      )
      .forEach((c) => {
        const base =
          c.basedOn === "basic" ? basicSalary : salaryStructure.basicSalary;
        const amount = round(base * (c.percentage / 100));
        deductionsList.push({
          name: c.name,
          amount,
          type: "percentage",
          percentage: c.percentage,
          basedOn: c.basedOn,
        });
      });

    // Custom bonuses
    bonuses.forEach((b) => {
      earnings.push({
        name: b.name,
        amount: round(b.amount),
        type: "bonus",
      });
    });

    // Custom deductions
    customDeductions.forEach((d) => {
      deductionsList.push({
        name: d.name,
        amount: round(d.amount),
        type: "deduction",
      });
    });

    // Final calculations
    const totalEarnings = round(earnings.reduce((sum, e) => sum + e.amount, 0));
    const totalDeductions = round(
      deductionsList.reduce((sum, d) => sum + d.amount, 0)
    );
    const netSalary = round(totalEarnings - totalDeductions);

    res.json({
      faculty: {
        _id: faculty._id,
        name: faculty.name,
        role: faculty.role,
      },
      month,
      year,
      workingDays,
      presentDays,
      leaveDays,
      basicSalary,
      earnings,
      deductions: deductionsList,
      totalEarnings,
      totalDeductions,
      netSalary,
    });
  } catch (error) {
    console.error("Salary calculation error:", error);
    res.status(500).json({ error: error.message });
  }
};

const processSalaryPayment = async (req, res) => {
  try {
    const {
      facultyId,
      salaryStructureId,
      month,
      year,
      paymentDate,
      paymentMode,
      bankDetails,
      chequeDetails,
      components,
      workingDays,
      presentDays,
      leaveDays,
      lopDays,
      remarks,
    } = req.body;

    // Check if salary already processed for this month
    const existingPayment = await SalaryPayment.findOne({
      faculty: facultyId,
      month,
      year,
    });

    if (existingPayment) {
      return res
        .status(400)
        .json({ error: "Salary already processed for this month" });
    }

    // Calculate totals
    const earnings = components.filter((c) => c.type === "earning");
    const deductions = components.filter((c) => c.type === "deduction");

    const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
    const netSalary = totalEarnings - totalDeductions;

    // Create payment record
    const payment = new SalaryPayment({
      faculty: facultyId,
      salaryStructure: salaryStructureId,
      month,
      year,
      paymentDate,
      paymentMode,
      bankDetails,
      chequeDetails,
      components,
      workingDays,
      presentDays,
      leaveDays,
      lopDays,
      earnings: totalEarnings,
      deductions: totalDeductions,
      netSalary,
      processedBy: req.userId,
      remarks,
    });

    await payment.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const approveSalaryPayment = async (req, res) => {
  try {
    const payment = await SalaryPayment.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        approvedBy: req.userId,
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: "Salary payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const markSalaryAsPaid = async (req, res) => {
  try {
    const payment = await SalaryPayment.findByIdAndUpdate(
      req.params.id,
      {
        status: "paid",
        paymentDate: req.body.paymentDate || Date.now(),
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: "Salary payment not found" });
    }

    // Generate payslip
    const payslipUrl = await this.generatePayslip(payment._id);
    payment.payslipUrl = payslipUrl;
    payment.payslipGenerated = true;
    await payment.save();

    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

async function generatePayslip(paymentId) {
  const payment = await SalaryPayment.findById(paymentId)
    .populate("faculty")
    .populate("salaryStructure")
    .populate("processedBy")
    .populate("approvedBy");

  const doc = new PDFDocument({ margin: 50 });
  const fileName = `payslip_${payment._id}.pdf`;
  const filePath = path.join(__dirname, "../public/payslips", fileName);

  // Ensure payslips directory exists
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  doc.pipe(fs.createWriteStream(filePath));

  // Add school header
  doc.image(path.join(__dirname, "../public/images/school-logo.png"), 50, 45, {
    width: 50,
  });
  doc.fontSize(20).text("SCHOOL NAME", 110, 50);
  doc.fontSize(10).text("School Address Line 1", 110, 75);
  doc.fontSize(10).text("City, State, PIN", 110, 90);
  doc.moveDown(2);

  // Payslip title
  doc.fontSize(16).text("SALARY PAYSLIP", { align: "center" });
  doc.moveDown();

  // Payslip details
  doc
    .fontSize(12)
    .text(`Payslip No: ${payment._id.toString().substr(-6).toUpperCase()}`, {
      continued: true,
    });
  doc.text(`Payment Date: ${payment.paymentDate.toLocaleDateString()}`, {
    align: "right",
  });
  doc.text(
    `Payment Period: ${this.getMonthName(payment.month)} ${payment.year}`
  );
  doc.moveDown();

  // Faculty details
  doc.font("Helvetica-Bold").text("Faculty Details:", { underline: true });
  doc.font("Helvetica");
  doc.text(`Name: ${payment.faculty.name}`);
  doc.text(`Faculty ID: ${payment.faculty.facultyId}`);
  doc.text(`Department: ${payment.faculty.department}`);
  doc.text(`Joining Date: ${payment.faculty.joiningDate.toLocaleDateString()}`);
  doc.moveDown();

  // Salary structure
  doc.font("Helvetica-Bold").text("Salary Structure:", { underline: true });
  doc.font("Helvetica");
  doc.text(`Structure: ${payment.salaryStructure.name}`);
  doc.moveDown();

  // Attendance summary
  doc.font("Helvetica-Bold").text("Attendance Summary:", { underline: true });
  doc.font("Helvetica");
  doc.text(`Working Days: ${payment.workingDays}`);
  doc.text(`Present Days: ${payment.presentDays}`);
  doc.text(`Leave Days: ${payment.leaveDays}`);
  doc.text(`Loss of Pay Days: ${payment.lopDays}`);
  doc.moveDown();

  // Earnings
  doc.font("Helvetica-Bold").text("Earnings:", { underline: true });
  doc.font("Helvetica");

  const earnings = payment.components.filter((c) => c.type === "earning");
  earnings.forEach((e) => {
    doc.text(`${e.name}: ₹${e.amount.toFixed(2)}`);
  });

  doc
    .font("Helvetica-Bold")
    .text(`Total Earnings: ₹${payment.earnings.toFixed(2)}`, {
      align: "right",
    });
  doc.moveDown();

  // Deductions
  doc.font("Helvetica-Bold").text("Deductions:", { underline: true });
  doc.font("Helvetica");

  const deductions = payment.components.filter((c) => c.type === "deduction");
  deductions.forEach((d) => {
    doc.text(`${d.name}: ₹${d.amount.toFixed(2)}`);
  });

  doc
    .font("Helvetica-Bold")
    .text(`Total Deductions: ₹${payment.deductions.toFixed(2)}`, {
      align: "right",
    });
  doc.moveDown(2);

  // Net salary
  doc
    .font("Helvetica-Bold")
    .text(`Net Salary: ₹${payment.netSalary.toFixed(2)}`, { align: "right" });
  doc.moveDown();

  // Payment details
  doc.font("Helvetica-Bold").text("Payment Details:", { underline: true });
  doc.font("Helvetica");
  doc.text(`Payment Mode: ${payment.paymentMode}`);

  if (payment.paymentMode === "bank") {
    doc.text(`Bank: ${payment.bankDetails.bankName}`);
    doc.text(`Account: ${payment.bankDetails.accountNumber}`);
  } else if (payment.paymentMode === "cheque") {
    doc.text(`Cheque No: ${payment.chequeDetails.number}`);
    doc.text(
      `Cheque Date: ${new Date(
        payment.chequeDetails.date
      ).toLocaleDateString()}`
    );
  }

  doc.moveDown();

  // Footer
  doc
    .fontSize(10)
    .text("This is a computer generated payslip. No signature required.", {
      align: "center",
    });
  doc.text("Processed by:", { align: "left", continued: true });
  doc.text(`${payment.processedBy.name}`, { align: "left" });

  if (payment.approvedBy) {
    doc.text("Approved by:", { align: "left", continued: true });
    doc.text(`${payment.approvedBy.name}`, { align: "left" });
  }

  doc.end();

  return `/payslips/${fileName}`;
}

function getMonthName(monthNumber) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber - 1];
}

const downloadPayslip = async (req, res) => {
  try {
    const payment = await SalaryPayment.findById(req.params.id);
    if (!payment || !payment.payslipUrl) {
      return res.status(404).json({ error: "Payslip not found" });
    }

    const filePath = path.join(__dirname, "../public", payment.payslipUrl);
    if (!fs.existsSync(filePath)) {
      // Regenerate payslip if file is missing
      await this.generatePayslip(payment._id);
    }

    res.download(filePath, `payslip_${payment._id.toString().substr(-6)}.pdf`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const emailPayslip = async (req, res) => {
  try {
    const payment = await SalaryPayment.findById(req.params.id).populate(
      "faculty"
    );

    if (!payment || !payment.payslipUrl) {
      return res.status(404).json({ error: "Payslip not found" });
    }

    if (!payment.faculty.email) {
      return res.status(400).json({ error: "Faculty email not found" });
    }

    const filePath = path.join(__dirname, "../public", payment.payslipUrl);
    if (!fs.existsSync(filePath)) {
      await this.generatePayslip(payment._id);
    }

    await sendEmailWithAttachment({
      to: payment.faculty.email,
      subject: `Salary Payslip - ${this.getMonthName(payment.month)} ${
        payment.year
      }`,
      text: `Dear ${
        payment.faculty.name
      },\n\nPlease find attached your salary payslip for ${this.getMonthName(
        payment.month
      )} ${payment.year}.\n\nThank you,\nSchool Administration`,
      attachments: [
        {
          filename: `payslip_${payment._id.toString().substr(-6)}.pdf`,
          path: filePath,
        },
      ],
    });

    res.json({ message: "Payslip emailed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalaryPayments = async (req, res) => {
  try {
    const { facultyId, month, year, status } = req.query;
    const filter = {};

    if (facultyId) filter.faculty = facultyId;
    if (month) filter.month = month;
    if (year) filter.year = year;
    if (status) filter.status = status;

    const payments = await SalaryPayment.find(filter)
      .populate("faculty")
      .populate("salaryStructure")
      .populate("processedBy")
      .populate("approvedBy")
      .sort("-year -month");

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalaryPaymentById = async (req, res) => {
  try {
    const payment = await SalaryPayment.findById(req.params.id)
      .populate("faculty")
      .populate("salaryStructure")
      .populate("processedBy")
      .populate("approvedBy");

    if (!payment) {
      return res.status(404).json({ error: "Salary payment not found" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const exportSalaryPayments = async (req, res) => {
  try {
    const { fromDate, toDate, department, status } = req.query;
    const filter = {};

    if (fromDate && toDate) {
      filter.paymentDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }
    if (status) filter.status = status;

    // If department is specified, filter by Facultys in that department
    if (department) {
      const facultys = await Faculty.find({ department }).select("_id");
      filter.faculty = { $in: facultys.map((e) => e._id) };
    }

    const payments = await SalaryPayment.find(filter)
      .populate("faculty")
      .populate("salaryStructure")
      .sort("-paymentDate");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Salary Payments");

    // Add headers
    worksheet.columns = [
      { header: "Payment ID", key: "paymentId", width: 15 },
      { header: "Faculty", key: "faculty", width: 25 },
      { header: "Faculty ID", key: "facultyId", width: 15 },
      { header: "Department", key: "department", width: 20 },
      { header: "Period", key: "period", width: 15 },
      { header: "Payment Date", key: "paymentDate", width: 15 },
      { header: "Net Salary", key: "netSalary", width: 15 },
      { header: "Status", key: "status", width: 12 },
      { header: "Payment Mode", key: "paymentMode", width: 15 },
    ];

    // Add data
    payments.forEach((payment) => {
      worksheet.addRow({
        paymentId: payment._id.toString().substr(-6).toUpperCase(),
        faculty: payment.faculty.name,
        facultyId: payment.faculty.facultyId,
        department: payment.faculty.department,
        period: `${this.getMonthName(payment.month)} ${payment.year}`,
        paymentDate: payment.paymentDate.toLocaleDateString(),
        netSalary: payment.netSalary,
        status: payment.status,
        paymentMode: payment.paymentMode,
      });
    });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=salary_payments.xlsx"
    );

    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalarySummary = async (req, res) => {
  try {
    const { year, department } = req.query;
    const match = {};

    if (year) match.year = parseInt(year);

    // If department is specified, filter by Facultys in that department
    if (department) {
      const Facultys = await Faculty.find({ department }).select("_id");
      match.faculty = { $in: Facultys.map((e) => e._id) };
    }

    const summary = await SalaryPayment.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$month",
          totalNetSalary: { $sum: "$netSalary" },
          count: { $sum: 1 },
          paidCount: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
          },
          approvedCount: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          draftCount: {
            $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalNetSalary: 1,
          totalPayments: "$count",
          paidPayments: "$paidCount",
          approvedPayments: "$approvedCount",
          draftPayments: "$draftCount",
        },
      },
      { $sort: { month: 1 } },
    ]);

    // Fill in missing months with zero values
    const fullSummary = Array.from({ length: 12 }, (_, i) => {
      const monthData = summary.find((s) => s.month === i + 1);
      return (
        monthData || {
          month: i + 1,
          totalNetSalary: 0,
          totalPayments: 0,
          paidPayments: 0,
          approvedPayments: 0,
          draftPayments: 0,
        }
      );
    });

    res.json(fullSummary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createSalaryStructure,
  updateSalaryStructure,
  getSalaryStructures,
  getSalaryStructureById,
  calculateSalary,
  processSalaryPayment,
  approveSalaryPayment,
  markSalaryAsPaid,
  downloadPayslip,
  emailPayslip,
  getSalaryPayments,
  getSalaryPaymentById,
  exportSalaryPayments,
  getSalarySummary,
};
