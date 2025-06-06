import Homework from "../models/Homework";
import HomeworkSubmission from "../models/HomeworkSubmission";
import HomeworkReminder from "../models/HomeworkRemainder";
import Class from "../models/Class";
import Section from "../models/Section";
import Subject from "../models/subject";


  const createHomework = async (req, res) => {
    try {
    const { classId, sectionId, subjectId } = req.params;
    const facultyId = req.user._id;
    const files = req.files;
    
    // Validate class, section, subject
    const [classObj, section, subject] = await Promise.all([
      Class.findById(classId),
      Section.findById(sectionId),
      Subject.findById(subjectId)
    ]);

    if (!classObj || !section || !subject) {
      // Clean up any uploaded files if validation fails
      if (files) {
        files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(404).json({ message: "Class, section or subject not found" });
    }

    // Check if faculty teaches this subject
    const classSubject = await ClassSubject.findOne({
      class: classId,
      subject: subjectId,
      teacher: facultyId
    });

    if (!classSubject) {
      if (files) {
        files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(403).json({ message: "You are not assigned to teach this subject" });
    }

    // Process uploaded files if they exist
    const uploadedFiles = files ? files.map(file => ({
      name: file.originalname,
      url: file.path,
      type: file.mimetype,
      size: file.size
    })) : [];

    const homework = new Homework({
      ...req.body,
      class: classId,
      section: sectionId,
      subject: subjectId,
      academicYear: classObj.academicYear,
      assignedBy: facultyId,
      files: uploadedFiles
    });

    await homework.save();

    // // Create notification for students
    // await NotificationController.createHomeworkNotification(homework);

    res.status(201).json({
      message: "Homework created successfully",
      homework
    });

  } catch (error) {
    // Clean up uploaded files if error occurs
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(500).json({ message: error.message });
  }
  };

  // Get all homework for a class/subject
 const getHomeworkForClass = async (req, res) => {
    try {
      const { classId, subjectId } = req.params;
      const { status = "published" } = req.query;

      const homeworks = await Homework.find({
        class: classId,
        subject: subjectId,
        status
      })
      .populate("assignedBy", "name avatar")
      .sort({ dueDate: 1 });

      res.json(homeworks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Update homework assignment
 const updateHomework = async (req, res) =>  {
    try {
      const { homeworkId } = req.params;
      const facultyId = req.user._id;

      const homework = await Homework.findById(homeworkId);
      if (!homework) {
        return res.status(404).json({ message: "Homework not found" });
      }

      // Check if faculty is the creator
      if (homework.assignedBy.toString() !== facultyId.toString()) {
        return res.status(403).json({ message: "You can only update your own homework" });
      }

      // Prevent updates if submissions exist
      const submissionsCount = await HomeworkSubmission.countDocuments({ homework: homeworkId });
      if (submissionsCount > 0 && req.body.points) {
        return res.status(400).json({ message: "Cannot change points after submissions exist" });
      }

      const updatedHomework = await Homework.findByIdAndUpdate(
        homeworkId,
        req.body,
        { new: true }
      );

      res.json(updatedHomework);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Delete homework assignment
  const deleteHomework = async (req, res) => {
    try {
      const { homeworkId } = req.params;
      const facultyId = req.user._id;

      const homework = await Homework.findById(homeworkId);
      if (!homework) {
        return res.status(404).json({ message: "Homework not found" });
      }

      // Check if faculty is the creator
      if (homework.assignedBy.toString() !== facultyId.toString()) {
        return res.status(403).json({ message: "You can only delete your own homework" });
      }

      // Check if submissions exist
      const submissionsCount = await HomeworkSubmission.countDocuments({ homework: homeworkId });
      if (submissionsCount > 0) {
        return res.status(400).json({ message: "Cannot delete homework with submissions" });
      }

      await homework.remove();
      res.json({ message: "Homework deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Get all submissions for a homework
 const getHomeworkSubmissions = async (req, res) => {
    try {
      const { homeworkId } = req.params;
      const facultyId = req.user._id;

      // Verify faculty owns this homework
      const homework = await Homework.findById(homeworkId);
      if (!homework || homework.assignedBy.toString() !== facultyId.toString()) {
        return res.status(403).json({ message: "Not authorized to view these submissions" });
      }

      const submissions = await HomeworkSubmission.find({ homework: homeworkId })
        .populate("student", "name avatar email")
        .sort({ submittedAt: -1 });

      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Grade a submission
 const gradeSubmission = async (req, res) => {
    try {
      const { submissionId } = req.params;
      const { score, feedback } = req.body;
      const facultyId = req.user._id;

      const submission = await HomeworkSubmission.findById(submissionId)
        .populate("homework");
      
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      // Verify faculty owns this homework
      if (submission.homework.assignedBy.toString() !== facultyId.toString()) {
        return res.status(403).json({ message: "Not authorized to grade this submission" });
      }

      // Validate score
      if (score > submission.homework.points) {
        return res.status(400).json({ 
          message: `Score cannot exceed maximum points (${submission.homework.points})`
        });
      }

      submission.grade = {
        score,
        maxScore: submission.homework.points,
        feedback,
        gradedBy: facultyId,
        gradedAt: new Date()
      };
      submission.isGraded = true;

      await submission.save();

      // Create notification for student
      await NotificationController.createGradeNotification(submission);

      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Send homework reminder
 const sendReminder = async (req, res) => {
    try {
      const { homeworkId } = req.params;
      const facultyId = req.user._id;
      const { studentIds, message } = req.body;

      // Verify faculty owns this homework
      const homework = await Homework.findById(homeworkId);
      if (!homework || homework.assignedBy.toString() !== facultyId.toString()) {
        return res.status(403).json({ message: "Not authorized to send reminders for this homework" });
      }

      const reminder = new HomeworkReminder({
        homework: homeworkId,
        sentTo: studentIds,
        sentBy: facultyId,
        message
      });

      await reminder.save();

      // Create notifications for students
      await NotificationController.createReminderNotification(reminder);

      res.status(201).json(reminder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Get homework statistics
 const getHomeworkStats = async (req, res) => {
    try {
      const { classId, subjectId } = req.params;
      const facultyId = req.user._id;

      // Verify faculty teaches this subject
      const classSubject = await ClassSubject.findOne({
        class: classId,
        subject: subjectId,
        teacher: facultyId
      });

      if (!classSubject) {
        return res.status(403).json({ message: "Not authorized to view stats for this subject" });
      }

      const homeworks = await Homework.find({ 
        class: classId, 
        subject: subjectId 
      }).select("_id title dueDate");

      const stats = await Promise.all(homeworks.map(async hw => {
        const totalStudents = await Student.countDocuments({ 
          class: classId,
          section: hw.section 
        });
        const submissions = await HomeworkSubmission.countDocuments({ 
          homework: hw._id 
        });
        const graded = await HomeworkSubmission.countDocuments({ 
          homework: hw._id,
          isGraded: true 
        });

        return {
          homeworkId: hw._id,
          title: hw.title,
          dueDate: hw.dueDate,
          totalStudents,
          submissions,
          pending: totalStudents - submissions,
          graded,
          ungraded: submissions - graded
        };
      }));

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Get all homework for a student
 const getStudentHomework = async (req, res) =>{
    try {
      const studentId = req.user._id;
      const { status } = req.query; // upcoming, pending, submitted, graded

      const student = await Student.findById(studentId)
        .populate("section", "class academicYear");
      
      if (!student || !student.section) {
        return res.status(404).json({ message: "Student or section not found" });
      }

      let query = { 
        class: student.section.class,
        section: student.section._id,
        status: "published"
      };

      if (status === "upcoming") {
        query.dueDate = { $gt: new Date() };
      } else if (status === "pending") {
        query.dueDate = { $gt: new Date() };
      }

      const homeworks = await Homework.find(query)
        .populate("subject", "subjectName subjectCode")
        .populate("assignedBy", "name avatar")
        .sort({ dueDate: 1 });

      // For pending, filter only those not submitted
      if (status === "pending") {
        const submittedHomework = await HomeworkSubmission.find({
          student: studentId
        }).distinct("homework");

        const pending = homeworks.filter(hw => 
          !submittedHomework.includes(hw._id.toString())
        );
        return res.json(pending);
      }

      res.json(homeworks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Submit homework
 const submitHomework = async (req, res) => {
    try {
      const { homeworkId } = req.params;
      const studentId = req.user._id;
      const { textSubmission } = req.body;
      const files = req.files;

      const homework = await Homework.findById(homeworkId);
      if (!homework) {
        return res.status(404).json({ message: "Homework not found" });
      }

      // Check if student belongs to this class/section
      const student = await Student.findById(studentId)
        .populate("section", "class");
      
      if (!student.section || 
          student.section.class.toString() !== homework.class.toString() ||
          student.section._id.toString() !== homework.section.toString()) {
        return res.status(403).json({ message: "Not authorized to submit this homework" });
      }

      // Check if already submitted
      const existingSubmission = await HomeworkSubmission.findOne({
        homework: homeworkId,
        student: studentId
      });

      if (existingSubmission) {
        return res.status(400).json({ message: "Homework already submitted" });
      }

      // Validate submission type
      if (homework.submissionType === "text" && !textSubmission) {
        return res.status(400).json({ message: "Text submission required" });
      }

      if (homework.submissionType === "file" && (!files || files.length === 0)) {
        return res.status(400).json({ message: "File submission required" });
      }

      // Validate file formats if files are submitted
      if (files && files.length > 0 && homework.allowedFormats) {
        const invalidFiles = files.filter(file => {
          const ext = path.extname(file.originalname).substring(1);
          return !homework.allowedFormats.includes(ext);
        });

        if (invalidFiles.length > 0) {
          return res.status(400).json({ 
            message: `Invalid file format. Allowed formats: ${homework.allowedFormats.join(', ')}`
          });
        }
      }

      // Create submission
      const submissionFiles = files ? files.map(file => ({
        name: file.originalname,
        url: file.path,
        type: file.mimetype
      })) : [];

      const status = new Date() > homework.dueDate ? "late" : "submitted";

      const submission = new HomeworkSubmission({
        homework: homeworkId,
        student: studentId,
        textSubmission,
        attachments: submissionFiles,
        status
      });

      await submission.save();

      // Create notification for teacher
      await NotificationController.createSubmissionNotification(submission);

      res.status(201).json(submission);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Update submission (resubmit)
 const updateSubmission = async (req, res) =>{
    try {
      const { submissionId } = req.params;
      const studentId = req.user._id;
      const { textSubmission } = req.body;
      const files = req.files;

      const submission = await HomeworkSubmission.findById(submissionId)
        .populate("homework");
      
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      // Check if student owns this submission
      if (submission.student.toString() !== studentId.toString()) {
        return res.status(403).json({ message: "Not authorized to update this submission" });
      }

      // Check if already graded
      if (submission.isGraded) {
        return res.status(400).json({ message: "Cannot update graded submission" });
      }

      // Validate submission type
      if (submission.homework.submissionType === "text" && !textSubmission) {
        return res.status(400).json({ message: "Text submission required" });
      }

      if (submission.homework.submissionType === "file" && (!files || files.length === 0)) {
        return res.status(400).json({ message: "File submission required" });
      }

      // Validate file formats if files are submitted
      if (files && files.length > 0 && submission.homework.allowedFormats) {
        const invalidFiles = files.filter(file => {
          const ext = path.extname(file.originalname).substring(1);
          return !submission.homework.allowedFormats.includes(ext);
        });

        if (invalidFiles.length > 0) {
          return res.status(400).json({ 
            message: `Invalid file format. Allowed formats: ${submission.homework.allowedFormats.join(', ')}`
          });
        }
      }

      // Update submission
      const submissionFiles = files ? files.map(file => ({
        name: file.originalname,
        url: file.path,
        type: file.mimetype
      })) : [];

      submission.textSubmission = textSubmission || submission.textSubmission;
      submission.attachments = files ? submissionFiles : submission.attachments;
      submission.status = new Date() > submission.homework.dueDate ? "late" : "submitted";
      submission.version += 1;

      await submission.save();

      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Get submission details
 const getSubmission = async (req, res) => {
    try {
      const { homeworkId } = req.params;
      const studentId = req.user._id;

      const submission = await HomeworkSubmission.findOne({
        homework: homeworkId,
        student: studentId
      })
      .populate("homework")
      .populate("grade.gradedBy", "name avatar");

      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Add comment to submission
 const addComment = async (req, res) => {
    try {
      const { submissionId } = req.params;
      const studentId = req.user._id;
      const { text } = req.body;

      const submission = await HomeworkSubmission.findById(submissionId);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      // Check if student owns this submission or is teacher of this homework
      const isStudent = submission.student.toString() === studentId.toString();
      const isTeacher = await Homework.exists({
        _id: submission.homework,
        assignedBy: studentId
      });

      if (!isStudent && !isTeacher) {
        return res.status(403).json({ message: "Not authorized to comment on this submission" });
      }

      submission.comments.push({
        text,
        postedBy: studentId,
        postedByModel: isStudent ? "Student" : "Faculty"
      });

      await submission.save();

      res.json(submission.comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const uploadHomework = async (req, res) => {
  try {
    const { classId, sectionId, subjectId } = req.params;
    const facultyId = req.user._id;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one file" });
    }

    // Validate class, section, subject
    const [classObj, section, subject] = await Promise.all([
      Class.findById(classId),
      Section.findById(sectionId),
      Subject.findById(subjectId)
    ]);

    if (!classObj || !section || !subject) {
      return res.status(404).json({ message: "Class, section or subject not found" });
    }

    // Check if faculty teaches this subject
    const classSubject = await ClassSubject.findOne({
      class: classId,
      subject: subjectId,
      teacher: facultyId
    });

    if (!classSubject) {
      return res.status(403).json({ message: "You are not assigned to teach this subject" });
    }

    // Process uploaded files
    const uploadedFiles = files.map(file => ({
      name: file.originalname,
      url: file.path,
      type: file.mimetype,
      size: file.size
    }));

    const homework = new Homework({
      ...req.body,
      class: classId,
      section: sectionId,
      subject: subjectId,
      academicYear: classObj.academicYear,
      assignedBy: facultyId,
      files: uploadedFiles
    });

    await homework.save();

    res.status(201).json({
      message: "Homework created with files successfully",
      homework
    });

  } catch (error) {
    // Clean up uploaded files if error occurs
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(500).json({ message: error.message });
  }
};

const addFilesToHomework = async (req, res) => {
  try {
    const { homeworkId } = req.params;
    const facultyId = req.user._id;
    const files = req.files;

    const homework = await Homework.findById(homeworkId);
    if (!homework) {
      return res.status(404).json({ message: "Homework not found" });
    }

    // Check if faculty is the creator
    if (homework.assignedBy.toString() !== facultyId.toString()) {
      return res.status(403).json({ message: "You can only add files to your own homework" });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const newFiles = files.map(file => ({
      name: file.originalname,
      url: file.path,
      type: file.mimetype,
      size: file.size
    }));

    homework.files = [...homework.files, ...newFiles];
    await homework.save();

    res.json({
      message: "Files added successfully",
      homework
    });

  } catch (error) {
    // Clean up uploaded files if error occurs
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export const uploadFilesToHomework = async (req, res) => {
  try {
    const { homeworkId } = req.params;
    const facultyId = req.user._id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const homework = await Homework.findById(homeworkId);
    if (!homework) {
      files.forEach(file => fs.unlinkSync(file.path));
      return res.status(404).json({ message: "Homework not found" });
    }

    // Check if faculty is the creator
    if (homework.assignedBy.toString() !== facultyId.toString()) {
      files.forEach(file => fs.unlinkSync(file.path));
      return res.status(403).json({ message: "You can only add files to your own homework" });
    }

    // Process new files
    const newFiles = files.map(file => ({
      name: file.originalname,
      url: file.path,
      type: file.mimetype,
      size: file.size
    }));

    // Add to existing files
    homework.files = [...homework.files, ...newFiles];
    await homework.save();

    res.json({
      message: "Files uploaded successfully",
      homework
    });

  } catch (error) {
    // Clean up uploaded files if error occurs
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(500).json({ message: error.message });
  }
};

 const deleteHomeworkFile = async (req, res) => {
  try {
    const { homeworkId, fileId } = req.params;
    const facultyId = req.user._id;

    const homework = await Homework.findById(homeworkId);
    if (!homework) {
      return res.status(404).json({ message: "Homework not found" });
    }

    // Check if faculty is the creator
    if (homework.assignedBy.toString() !== facultyId.toString()) {
      return res.status(403).json({ message: "You can only delete files from your own homework" });
    }

    const fileIndex = homework.files.findIndex(f => f._id.toString() === fileId);
    if (fileIndex === -1) {
      return res.status(404).json({ message: "File not found" });
    }

    const fileToDelete = homework.files[fileIndex];
    
    // Delete file from storage
    if (fs.existsSync(fileToDelete.url)) {
      fs.unlinkSync(fileToDelete.url);
    }

    // Remove file from array
    homework.files.splice(fileIndex, 1);
    await homework.save();

    res.json({ message: "File deleted successfully", homework });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
    createHomework,
    getHomeworkForClass,
    updateHomework,
    deleteHomework,
    getHomeworkSubmissions,
    gradeSubmission,
    sendReminder,
    getHomeworkStats,
    getStudentHomework,
    submitHomework,
    updateSubmission,
    getSubmission,
    addComment,
    uploadHomework,
    addFilesToHomework, 
    deleteHomeworkFile
}