import mongoose from 'mongoose';
import TimeSlot from '../models/timeSlotModel.js';
import DailyTimetable from '../models/dailyTimetableModel.js';
import ClassTimetable from '../models/classTimetableModel.js';
import Faculty from '../models/faculty.js';
import ClassSubject from '../models/ClassSubject.js';

// Helper function to validate object IDs
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// TimeSlot Services
export const createTimeSlotService = async (slotData) => {
  const slot = new TimeSlot(slotData);
  await slot.save();
  return slot;
};

export const getTimeSlotByIdService = async (id) => {
  if (!validateObjectId(id)) throw new Error('Invalid ID format');
  return await TimeSlot.findById(id);
};

export const updateTimeSlotService = async (id, updateData) => {
  if (!validateObjectId(id)) throw new Error('Invalid ID format');
  return await TimeSlot.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteTimeSlotService = async (id) => {
  if (!validateObjectId(id)) throw new Error('Invalid ID format');
  return await TimeSlot.findByIdAndDelete(id);
};

export const getAllTimeSlotsService = async () => {
  return await TimeSlot.find().sort({ periodNumber: 1 });
};

export const bulkCreateTimeSlotsService = async (slotsData) => {
  return await TimeSlot.insertMany(slotsData, { ordered: false });
};

// DailyTimetable Services
export const createDailyTimetableService = async (dailyData) => {
  const dailyTimetable = new DailyTimetable(dailyData);
  await dailyTimetable.save();
  return dailyTimetable;
};

export const getDailyTimetableByIdService = async (id) => {
  if (!validateObjectId(id)) throw new Error('Invalid ID format');
  return await DailyTimetable.findById(id)
    .populate('slots.slot slots.teacher slots.substituteTeacher slots.subject');
};

export const updateDailyTimetableService = async (id, updateData) => {
  if (!validateObjectId(id)) throw new Error('Invalid ID format');
  return await DailyTimetable.findByIdAndUpdate(id, updateData, { 
    new: true 
  }).populate('slots.slot slots.teacher slots.substituteTeacher slots.subject');
};

export const deleteDailyTimetableService = async (id) => {
  if (!validateObjectId(id)) throw new Error('Invalid ID format');
  return await DailyTimetable.findByIdAndDelete(id);
};

// ClassTimetable Services
export const createClassTimetableService = async (
  { classId, sectionId, academicYearId, timetable, effectiveFrom, createdBy },
  sessionOptions = {}
) => {
  const newTimetable = new ClassTimetable({
    class: classId,
    section: sectionId,
    academicYear: academicYearId,
    timetable,
    effectiveFrom,
    createdBy
  });

  await newTimetable.save(sessionOptions);
  return newTimetable;
};

export const getClassTimetableByIdService = async (id) => {
  if (!validateObjectId(id)) throw new Error('Invalid ID format');
  return await ClassTimetable.findById(id)
    .populate('class section academicYear createdBy')
    .populate({
      path: 'timetable',
      populate: {
        path: 'slots.slot slots.teacher slots.substituteTeacher slots.subject',
        select: 'startTime endTime periodNumber name email code'
      }
    });
};

export const updateClassTimetableService = async (id, updateData, sessionOptions = {}) => {
  if (!validateObjectId(id)) throw new Error('Invalid ID format');
  return await ClassTimetable.findByIdAndUpdate(id, updateData, { 
    new: true,
    ...sessionOptions 
  });
};

export const deleteClassTimetableService = async (id) => {
  if (!validateObjectId(id)) throw new Error('Invalid ID format');
  return await ClassTimetable.findByIdAndDelete(id);
};

// Specialized Services
export const getClassTimetableByClassService = async (
  classId,
  sectionId,
  academicYearId
) => {
  const query = {
    class: classId,
    academicYear: academicYearId,
    isActive: true
  };

  if (sectionId) query.section = sectionId;

  return await ClassTimetable.findOne(query)
    .populate('class section academicYear')
    .populate({
      path: 'timetable',
      populate: {
        path: 'slots.slot slots.teacher slots.substituteTeacher slots.subject',
        select: 'startTime endTime periodNumber name email code'
      }
    });
};

export const getTeacherTimetableService = async (teacherId, startDate, endDate) => {
  return await ClassTimetable.aggregate([
    {
      $match: {
        isActive: true,
        effectiveFrom: { $lte: endDate },
        $or: [
          { effectiveTill: { $gte: startDate } },
          { effectiveTill: null }
        ]
      }
    },
    { $lookup: {
        from: 'dailytimetables',
        localField: 'timetable',
        foreignField: '_id',
        as: 'days'
    }},
    { $unwind: '$days' },
    { $unwind: '$days.slots' },
    { $match: {
        $or: [
          { 'days.slots.teacher': new mongoose.Types.ObjectId(teacherId) },
          { 'days.slots.substituteTeacher': new mongoose.Types.ObjectId(teacherId) }
        ]
    }},
    { $lookup: {
        from: 'classes',
        localField: 'class',
        foreignField: '_id',
        as: 'class'
    }},
    { $lookup: {
        from: 'sections',
        localField: 'section',
        foreignField: '_id',
        as: 'section'
    }},
    { $lookup: {
        from: 'subjects',
        localField: 'days.slots.subject',
        foreignField: '_id',
        as: 'subject'
    }},
    { $lookup: {
        from: 'timeslots',
        localField: 'days.slots.slot',
        foreignField: '_id',
        as: 'slot'
    }},
    { $project: {
        _id: 0,
        day: '$days.day',
        date: '$days.date',
        period: { $arrayElemAt: ['$slot.periodNumber', 0] },
        startTime: { $arrayElemAt: ['$slot.startTime', 0] },
        endTime: { $arrayElemAt: ['$slot.endTime', 0] },
        subject: { $arrayElemAt: ['$subject.name', 0] },
        subjectCode: { $arrayElemAt: ['$subject.code', 0] },
        class: { $arrayElemAt: ['$class.name', 0] },
        section: { $arrayElemAt: ['$section.name', 0] },
        room: '$days.slots.room',
        isSubstitute: {
          $cond: [
            { $eq: ['$days.slots.substituteTeacher', new mongoose.Types.ObjectId(teacherId)] },
            true, false
          ]
        },
        isCancelled: '$days.slots.isCancelled'
    }}
  ]);
};

export const validateTimetableConflictsService = async ({
  timetableData,
  classId,
  sectionId,
  academicYearId,
  excludeTimetableId
}) => {
  const conflicts = [];
  const teacherAssignments = new Map();
  const roomAssignments = new Map();

  for (const day of timetableData) {
    for (const slot of day.slots) {
      if (!slot.slot) continue;

      // Check teacher conflicts
      if (slot.teacher) {
        const conflict = await DailyTimetable.findOne({
          'slots.slot': slot.slot,
          'slots.teacher': slot.teacher,
          day: day.day,
          _id: { $ne: excludeTimetableId }
        }).populate({
          path: 'classTimetable',
          match: {
            class: { $ne: classId },
            academicYear: academicYearId
          },
          select: 'class section'
        });

        if (conflict?.classTimetable) {
          conflicts.push({
            type: 'TEACHER_CONFLICT',
            teacher: slot.teacher,
            day: day.day,
            period: slot.slot.periodNumber,
            conflictingWith: {
              class: conflict.classTimetable.class,
              section: conflict.classTimetable.section
            }
          });
        }
      }

      // Check room conflicts
      if (slot.room) {
        const roomKey = `${day.day}-${slot.slot}-${slot.room}`;
        if (roomAssignments.has(roomKey)) {
          conflicts.push({
            type: 'ROOM_CONFLICT',
            room: slot.room,
            day: day.day,
            period: slot.slot.periodNumber,
            conflictingWith: roomAssignments.get(roomKey)
          });
        } else {
          roomAssignments.set(roomKey, {
            class: classId,
            section: sectionId
          });
        }
      }
    }
  }

  return conflicts;
};

export const assignSubstituteTeacherService = async (
  timetableId,
  dayId,
  slotId,
  substituteId,
  reason,
  sessionOptions = {}
) => {
  // Verify teacher exists
  const teacher = await Faculty.findById(substituteId);
  if (!teacher) throw new Error('Teacher not found');

  // Find the timetable and day
  const timetable = await ClassTimetable.findById(timetableId)
    .populate({
      path: 'timetable',
      match: { _id: dayId }
    });

  if (!timetable) throw new Error('Timetable not found');

  const day = timetable.timetable.find(d => d._id.equals(dayId));
  if (!day) throw new Error('Day not found in timetable');

  const slot = day.slots.id(slotId);
  if (!slot) throw new Error('Slot not found');

  // Check if teacher is already assigned
  const conflict = await DailyTimetable.findOne({
    'slots.slot': slot.slot,
    $or: [
      { 'slots.teacher': substituteId },
      { 'slots.substituteTeacher': substituteId }
    ],
    day: day.day,
    _id: { $ne: day._id }
  });

  if (conflict) throw new Error('Teacher already assigned during this period');

  // Check if substitute is assigned to the subject
  const isAssigned = await ClassSubject.findOne({
    teacher: substituteId,
    subject: slot.subject,
    class: timetable.class,
    academicYear: timetable.academicYear
  });

  if (!isAssigned) {
    throw new Error('Teacher is not assigned to this subject');
  }

  // Record original teacher if first substitution
  if (!slot.substituteTeacher) {
    slot.originalTeacher = slot.teacher;
  }

  // Update the slot
  slot.substituteTeacher = substituteId;
  slot.substitutionReason = reason;
  slot.updatedAt = new Date();

  await day.save(sessionOptions);

  // Update timetable validation timestamp
  timetable.lastValidatedAt = new Date();
  await timetable.save(sessionOptions);

  return {
    slotId: slot._id,
    day: day.day,
    period: slot.slot.periodNumber,
    originalTeacher: slot.originalTeacher,
    substituteTeacher: slot.substituteTeacher,
    subject: slot.subject,
    room: slot.room
  };
};

export const getRoomAssignmentsService = async (room, date) => {
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  
  return await ClassTimetable.aggregate([
    {
      $match: {
        isActive: true,
        effectiveFrom: { $lte: date },
        $or: [
          { effectiveTill: { $gte: date } },
          { effectiveTill: null }
        ]
      }
    },
    { $lookup: {
        from: 'dailytimetables',
        localField: 'timetable',
        foreignField: '_id',
        as: 'days'
    }},
    { $unwind: '$days' },
    { $match: {
        $or: [
          { 'days.day': dayOfWeek },
          { 'days.date': date }
        ]
    }},
    { $unwind: '$days.slots' },
    { $match: {
        'days.slots.room': room
    }},
    { $lookup: {
        from: 'classes',
        localField: 'class',
        foreignField: '_id',
        as: 'class'
    }},
    { $lookup: {
        from: 'sections',
        localField: 'section',
        foreignField: '_id',
        as: 'section'
    }},
    { $lookup: {
        from: 'subjects',
        localField: 'days.slots.subject',
        foreignField: '_id',
        as: 'subject'
    }},
    { $lookup: {
        from: 'timeslots',
        localField: 'days.slots.slot',
        foreignField: '_id',
        as: 'slot'
    }},
    { $lookup: {
        from: 'faculties',
        localField: 'days.slots.teacher',
        foreignField: '_id',
        as: 'teacher'
    }},
    { $lookup: {
        from: 'faculties',
        localField: 'days.slots.substituteTeacher',
        foreignField: '_id',
        as: 'substituteTeacher'
    }},
    { $project: {
        _id: 0,
        day: '$days.day',
        date: '$days.date',
        period: { $arrayElemAt: ['$slot.periodNumber', 0] },
        startTime: { $arrayElemAt: ['$slot.startTime', 0] },
        endTime: { $arrayElemAt: ['$slot.endTime', 0] },
        subject: { $arrayElemAt: ['$subject.name', 0] },
        class: { $arrayElemAt: ['$class.name', 0] },
        section: { $arrayElemAt: ['$section.name', 0] },
        teacher: { $arrayElemAt: ['$teacher.name', 0] },
        substituteTeacher: { $arrayElemAt: ['$substituteTeacher.name', 0] }
    }}
  ]);
};

export const getTimetableConflictsService = async (timetableId) => {
  const timetable = await ClassTimetable.findById(timetableId)
    .populate({
      path: 'timetable',
      populate: {
        path: 'slots.slot slots.teacher slots.substituteTeacher slots.subject',
        select: 'startTime endTime periodNumber name email code'
      }
    });

  if (!timetable) throw new Error('Timetable not found');

  const conflicts = [];

  for (const day of timetable.timetable) {
    for (const slot of day.slots) {
      if (!slot.slot) continue;

      // Check teacher conflicts
      if (slot.teacher) {
        const conflict = await DailyTimetable.findOne({
          'slots.slot': slot.slot,
          'slots.teacher': slot.teacher,
          day: day.day,
          _id: { $ne: day._id }
        }).populate({
          path: 'classTimetable',
          select: 'class section academicYear'
        });

        if (conflict) {
          conflicts.push({
            type: 'TEACHER_CONFLICT',
            teacher: slot.teacher,
            day: day.day,
            period: slot.slot.periodNumber,
            conflictingWith: conflict.classTimetable
          });
        }
      }

      // Check substitute conflicts
      if (slot.substituteTeacher) {
        const conflict = await DailyTimetable.findOne({
          'slots.slot': slot.slot,
          $or: [
            { 'slots.teacher': slot.substituteTeacher },
            { 'slots.substituteTeacher': slot.substituteTeacher }
          ],
          day: day.day,
          _id: { $ne: day._id }
        }).populate({
          path: 'classTimetable',
          select: 'class section academicYear'
        });

        if (conflict) {
          conflicts.push({
            type: 'SUBSTITUTE_CONFLICT',
            teacher: slot.substituteTeacher,
            day: day.day,
            period: slot.slot.periodNumber,
            conflictingWith: conflict.classTimetable
          });
        }
      }
    }
  }

  return conflicts;
};