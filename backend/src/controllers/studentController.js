const { Student, Family, User, Branch, sequelize } = require('../models');
const { Op } = require('sequelize');

const studentController = {
    // Get all students - Role-based filtering applied
    getStudents: async (req, res, next) => {
        try {
            const { search, branchId, currentClass } = req.query;

            // Build where clause for Student
            const whereClause = {};

            // RBAC: If not ADMIN, force branchId to user's branch
            if (req.user.role !== 'ADMIN') {
                whereClause.branchId = req.user.branchId;
            } else if (branchId) {
                // Admin can filter by branch
                whereClause.branchId = branchId;
            }

            // Filtering by class
            if (currentClass) {
                whereClause.currentClass = currentClass;
            }

            // Search by Name, Father Name, or Phone (requires joining Family)
            const includeFamily = {
                model: Family,
                required: false
            };

            if (search) {
                whereClause[Op.or] = [
                    { name: { [Op.like]: `%${search}%` } },
                    { '$Family.fatherName$': { [Op.like]: `%${search}%` } },
                    { '$Family.fatherPhone$': { [Op.like]: `%${search}%` } }
                ];
                includeFamily.required = true; // Force inner join for accurate search
            }

            const students = await Student.findAll({
                where: whereClause,
                include: [
                    includeFamily,
                    { model: Branch, attributes: ['id', 'name'] }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json({
                success: true,
                data: students
            });

        } catch (error) {
            next(error);
        }
    },

    // Admit new student - Creates Family tree automatically
    admitStudent: async (req, res, next) => {
        const t = await sequelize.transaction();
        try {
            const {
                // Manually generated admissionNo is REMOVED from destructuring requirement
                name, dateOfBirth, gender, currentClass, classAdmitted, section,
                fatherName, fatherPhone, fatherOccupation,
                branchId, // Admins might pass this, ignored for others

                // Extra Fields
                referenceNo, formBNicNo, previousSchool, caste, religion,
                referenceInSchool, specialInfo, guardianName, guardianRelation,
                houseNo, streetNo, blockPhase, mohallahColony, cell1, cell2, whatsapp,
                schoolLeavingCert, characterCert, birthCert,
                admissionFee, monthlyFee, annualCharges, academyFee, labMiscFee

            } = req.body;

            // Determine Target Branch
            let targetBranchId = req.user.branchId;
            if (req.user.role === 'ADMIN') {
                if (!branchId) {
                    throw new Error('Branch ID is required for Admins when admitting a student.');
                }
                targetBranchId = branchId;
            }

            // Validations
            if (!name || !fatherName || !fatherPhone) {
                const err = new Error('Please provide all required fields including Name, Father Name and Phone.');
                err.statusCode = 400;
                throw err;
            }

            // Auto-Generate Global Admission Number (Format: BS-YYYY-0001)
            const currentYear = new Date().getFullYear();
            const prefix = `BS-${currentYear}-`;

            // Find the highest admission number for this year to increment correctly
            const latestStudent = await Student.findOne({
                where: {
                    admissionNo: {
                        [Op.like]: `${prefix}%`
                    }
                },
                order: [['admissionNo', 'DESC']],
                transaction: t
            });

            let newSequence = 1;
            if (latestStudent && latestStudent.admissionNo) {
                // Extract the sequence part and increment
                const parts = latestStudent.admissionNo.split('-');
                if (parts.length === 3) {
                    const lastSequence = parseInt(parts[2], 10);
                    if (!isNaN(lastSequence)) {
                        newSequence = lastSequence + 1;
                    }
                }
            }

            const admissionNo = `${prefix}${String(newSequence).padStart(4, '0')}`;

            // Family Tree Logic: Find by Father Phone and Target Branch
            let family = await Family.findOne({
                where: { fatherPhone, branchId: targetBranchId },
                transaction: t
            });

            if (!family) {
                // Auto-create Family
                family = await Family.create({
                    fatherName,
                    fatherPhone,
                    fatherOccupation: fatherOccupation || null,
                    branchId: targetBranchId,
                }, { transaction: t });
            }

            // Create Student with extended fields
            const student = await Student.create({
                admissionNo,
                referenceNo,
                name,
                dateOfBirth,
                formBNicNo,
                previousSchool,
                caste,
                religion,
                gender: gender || 'Male',
                classAdmitted: classAdmitted || currentClass,
                currentClass: currentClass || 'playgroup',
                section,
                referenceInSchool,
                specialInfo,
                guardianName,
                guardianRelation,
                houseNo,
                streetNo,
                blockPhase,
                mohallahColony,
                cell1,
                cell2,
                whatsapp,
                schoolLeavingCert: !!schoolLeavingCert,
                characterCert: !!characterCert,
                birthCert: !!birthCert,
                admissionFee: admissionFee || 0,
                monthlyFee: monthlyFee || 0,
                annualCharges: annualCharges || 0,
                academyFee: academyFee || 0,
                labMiscFee: labMiscFee || 0,
                branchId: targetBranchId,
                familyId: family.id,
                enrolledById: req.user.id
            }, { transaction: t });

            await t.commit();

            res.status(201).json({
                success: true,
                message: `Student admitted successfully with Admission No: ${admissionNo}`,
                data: student
            });

        } catch (error) {
            await t.rollback();
            next(error);
        }
    },

    // Update existing student and status
    updateStudent: async (req, res, next) => {
        try {
            const studentId = req.params.id;
            const {
                name, dateOfBirth, gender, currentClass, classAdmitted, section,
                referenceNo, formBNicNo, previousSchool, caste, religion,
                referenceInSchool, specialInfo, guardianName, guardianRelation,
                houseNo, streetNo, blockPhase, mohallahColony, cell1, cell2, whatsapp,
                schoolLeavingCert, characterCert, birthCert,
                admissionFee, monthlyFee, annualCharges, academyFee, labMiscFee,
                status
            } = req.body;

            const student = await Student.findByPk(studentId);

            if (!student) {
                const err = new Error('Student not found');
                err.statusCode = 404;
                throw err;
            }

            // Ensure proper authorization if not admin
            if (req.user.role !== 'ADMIN' && student.branchId !== req.user.branchId) {
                const err = new Error('Unauthorized to edit this student');
                err.statusCode = 403;
                throw err;
            }

            await student.update({
                name: name !== undefined ? name : student.name,
                dateOfBirth: dateOfBirth !== undefined ? dateOfBirth : student.dateOfBirth,
                gender: gender !== undefined ? gender : student.gender,
                currentClass: currentClass !== undefined ? currentClass : student.currentClass,
                classAdmitted: classAdmitted !== undefined ? classAdmitted : student.classAdmitted,
                section: section !== undefined ? section : student.section,
                referenceNo: referenceNo !== undefined ? referenceNo : student.referenceNo,
                formBNicNo: formBNicNo !== undefined ? formBNicNo : student.formBNicNo,
                previousSchool: previousSchool !== undefined ? previousSchool : student.previousSchool,
                caste: caste !== undefined ? caste : student.caste,
                religion: religion !== undefined ? religion : student.religion,
                referenceInSchool: referenceInSchool !== undefined ? referenceInSchool : student.referenceInSchool,
                specialInfo: specialInfo !== undefined ? specialInfo : student.specialInfo,
                guardianName: guardianName !== undefined ? guardianName : student.guardianName,
                guardianRelation: guardianRelation !== undefined ? guardianRelation : student.guardianRelation,
                houseNo: houseNo !== undefined ? houseNo : student.houseNo,
                streetNo: streetNo !== undefined ? streetNo : student.streetNo,
                blockPhase: blockPhase !== undefined ? blockPhase : student.blockPhase,
                mohallahColony: mohallahColony !== undefined ? mohallahColony : student.mohallahColony,
                cell1: cell1 !== undefined ? cell1 : student.cell1,
                cell2: cell2 !== undefined ? cell2 : student.cell2,
                whatsapp: whatsapp !== undefined ? whatsapp : student.whatsapp,
                schoolLeavingCert: schoolLeavingCert !== undefined ? !!schoolLeavingCert : student.schoolLeavingCert,
                characterCert: characterCert !== undefined ? !!characterCert : student.characterCert,
                birthCert: birthCert !== undefined ? !!birthCert : student.birthCert,
                admissionFee: admissionFee !== undefined ? admissionFee : student.admissionFee,
                monthlyFee: monthlyFee !== undefined ? monthlyFee : student.monthlyFee,
                annualCharges: annualCharges !== undefined ? annualCharges : student.annualCharges,
                academyFee: academyFee !== undefined ? academyFee : student.academyFee,
                labMiscFee: labMiscFee !== undefined ? labMiscFee : student.labMiscFee,
                status: status !== undefined ? status : student.status
            });

            res.status(200).json({
                success: true,
                message: 'Student details updated successfully',
                data: student
            });

        } catch (error) {
            next(error);
        }
    }
};

module.exports = studentController;
