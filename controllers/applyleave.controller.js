const applyleaveModel = require("../models/applyleave.model");
const leavesModel = require("../models/leaves.model");
const newuserModel = require("../models/newuser.model");
const notificationModel = require("../models/notification.model");
const { sendEmail } = require('../helper/sendEmail')
const moment = require('moment')


exports.apply = async (req, res) => {
    const { reason, from_date, to_date, leave_type, leave } = req.body;
    if (!reason || !from_date || !leave || !leave_type) {
        return res.status(400).send("Parameters missing")
    }
    if (leave_type == 'Full Day' && !to_date) {
        return res.status(400).send("Parameters missing")
    }
    if (leave == 'Earned Leave') {
        let userData = await newuserModel.findById(req.user.id)
        console.info(userData.date_of_joining)
        var a = moment(new Date());
        var b = moment(userData.date_of_joining);
        // var b = moment('2023-01-15');
        let diff = a.diff(b, 'days') + 1
        if (diff < 90) {
            return res.status(400).json({
                success: false,
                msg: "You cannot Avail Earned Leave Within Three Months of Joining"
            })
        }


    }
    let data;
    try {
        data = await applyleaveModel.create({
            userId: req.user.id,
            leave,
            reason,
            from_date,
            to_date,
            leave_type
        });
        let notification = await notificationModel.create({
            userId: req.user.id,
            type: "pending",
            leave_id: data._id
        })
        let email = 'aman.kumar@smartinfocare.com'
        let html = `
        ${req.user?.email} applied for leave on ${from_date},Reason: ${reason}`
        let emailSubject = 'Leave Application'
        let sendMail = await sendEmail(email, html, emailSubject)


        res.status(201).json({
            success: true,
            data: data
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong")
    }

}


exports.getapply_leaves = async (req, res) => {



    try {
        // const records = await applyleaveModel.find().populate('userId', { name: 1, emp_id: 1 }).populate('leave', { name: 1 });
        const records = await applyleaveModel.find({ userId: { $ne: req.user.id } }).populate({ path: 'userId', match: { role: '0' } }).populate('userId', { name: 1, emp_id: 1 })
        res.status(201).json(records);
    }
    catch (error) {
        console.log(error);
    }
}
exports.admin_get_apply_leave = async (req, res) => {


    try {
        // const records = await applyleaveModel.find().match({userId:{role:'0'}}).populate('userId', { name: 1, emp_id: 1,role: 1}).populate('leave', { name: 1 });
        const records = await applyleaveModel.find().populate('userId', { name: 1, emp_id: 1 });
        res.status(201).json(records);
    }
    catch (error) {
        console.log(error);
    }
}

exports.update_leave = async (req, res) => {

    const id = req.params.id;
    let apply_leave_id = req.body.apply_leave_id;
    let approved = await applyleaveModel.findByIdAndUpdate(apply_leave_id, { status: 'approved' })

    let edit = await newuserModel.findById(req.params.id, { leave: 1 })
    // Don't Touch Any Condition  without permission
    if (approved?.leave == 'Casual Leave' || approved?.leave == 'Sick Leave') {
        //   ----------------Half Day leave---------------
        if (!approved?.to_date && approved?.leave_type == "Half Day") {
            if (approved?.leave == 'Casual Leave') {
                edit.leave['casual_leave'] -= 0.5
            }
            if (approved?.leave == 'Sick Leave') {
                edit.leave['sick_leave'] -= 0.5
            }
        }
        //   ----------------Half Day leave---------------


        // ------------- One Day Leave---------------
        else if (approved?.from_date === approved?.to_date) {
            edit.leave['sick_leave'] -= 0.5
            edit.leave['casual_leave'] -= 0.5
        }
        // ------------- One Day Leave---------------


        // -------------More then One Day--------------
        else if (approved?.from_date != approved?.to_date) {
            var a = moment(approved.to_date);
            var b = moment(approved.from_date);
            let diff = a.diff(b, 'days') + 1
            edit.leave['sick_leave'] -= diff / 2
            edit.leave['casual_leave'] -= diff / 2
        }
        // -------------More then One Day--------------



    }
    if (approved?.leave == 'Earned Leave') {
        var a = moment(approved.to_date);
        var b = moment(approved.from_date);
        let diff = a.diff(b, 'days') + 1
        edit.leave['earned_leave'] -= diff
    }
    // Don't Touch Any Condition  without permission

    let check = await newuserModel.findByIdAndUpdate(id, { $set: { leave: edit.leave } })
    let set_notification = await notificationModel.findOneAndUpdate({ leave_id: apply_leave_id }, { type: "approved", is_read: true })
    return res.send("success")

}

exports.cancel_leave = async (req, res) => {
    try {
        const id = req.params.id;
        let apply_leave_id = req.body.apply_leave_id;
        let cancelled = await applyleaveModel.findByIdAndUpdate(apply_leave_id, { status: 'rejected' })
        let set_notification = await notificationModel.findOneAndUpdate({ leave_id: apply_leave_id }, { type: "rejected", is_read: true })
    }
    catch (error) {
        console.log(error);
    }
    res.status(201).send("success");

}


exports.single_user_apply_leave = async (req, res) => {


    try {
        const records = await applyleaveModel.find({ userId: req.user.id }).populate('userId', { name: 1, emp_id: 1 })
        res.status(201).json(records);
    }
    catch (error) {
        console.log(error);
    }
}


exports.get_all_notification = async (req, res) => {
    let role = req.user.role;
    // console.log(req.user)
    let filter = {
        is_read: false
    }
    if (role == 2) {
        filter.type = "pending"
        filter.userId = { $ne: req.user.id }
    }
    if (role == 0) {
        filter.type = { $in: ['rejected', 'approved'] }
        filter.userId = req.user.id
    }
    // console.log(filter, 'noti')

    try {
        const all_notification = await notificationModel.find(filter).populate('userId', { name: 1 });
        res.status(200).json(all_notification);
    }
    catch (error) {
        console.log(error)
    }
}

exports.is_mark_read = async (req, res) => {
    let is_mark;
    try {
        is_mark = await notificationModel.findByIdAndUpdate({ _id: req.params.id }, { is_read: true })
    }
    catch (error) {
        console.log(error);
    }
    res.status(201).json(is_mark);
}

exports.earnedLeaveCron = async (req, res) => {
    let allUser = await newuserModel.find({ is_delete: false }, { createdAt: 1, leave: 1 })
    if (allUser?.length < 1) {
        return res.status(400).send("no user found")
    }
    for (let x of allUser) {
        let update = { ...x.leave }
        update['sick_leave'] = 0.5
        update['casual_leave'] = 0.5
        update['earned_leave'] += 1
        let check = await newuserModel.findByIdAndUpdate(x._id, { $set: { leave: update } })
    }
    // res.send("successfully")
}

// module.exports = {
//     apply, getapply_leaves, update_leave, single_user_apply_leave, cancel_leave, admin_get_apply_leave
// }

