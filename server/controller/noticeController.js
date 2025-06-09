import Admin from "../models/admin.js";
import Department from "../models/department.js";
import Faculty from "../models/faculty.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Notice from "../models/notice.js";


export const createNotice = async (req, res) => {
  try {
    const { from, content, topic, date, noticeFor } = req.body;

    const errors = { noticeError: String };
    const exisitingNotice = await Notice.findOne({ topic, content, date });
    if (exisitingNotice) {
      errors.noticeError = "Notice already created";
      return res.status(400).json(errors);
    }
    const newNotice = await new Notice({
      from,
      content,
      topic,
      noticeFor,
      date,
    });
    await newNotice.save();
    return res.status(200).json({
      success: true,
      message: "Notice created successfully",
      response: newNotice,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};


export const getNotice = async (req, res) => {
  try {
    const errors = { noNoticeError: String };
    const notices = await Notice.find({});
    if (notices.length === 0) {
      errors.noNoticeError = "No Notice Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: notices });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getNoticeById = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const errors = { noNoticeError: String };
    const notice = await Notice.findById(noticeId);
    if (!notice) {
      errors.noNoticeError = "No Notice Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: notice });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
}

export const deleteNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const errors = { noNoticeError: String };
    const notice = await Notice.findByIdAndDelete(noticeId);
    if (!notice) {
      errors.noNoticeError = "No Notice Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ message: "Notice Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const updateNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const { from, content, topic, date, noticeFor } = req.body;

    const errors = { noNoticeError: String };
    const notice = await Notice.findById(noticeId);
    if (!notice) {
      errors.noNoticeError = "No Notice Found";
      return res.status(404).json(errors);
    }

    notice.from = from || notice.from;
    notice.content = content || notice.content;
    notice.topic = topic || notice.topic;
    notice.date = date || notice.date;
    notice.noticeFor = noticeFor || notice.noticeFor;

    await notice.save();
    
    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      response: notice,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
