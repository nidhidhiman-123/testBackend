const applyleaveModel = require("../models/applyleave.model");
const leavesModel = require("../models/leaves.model");
const newuserModel = require("../models/newuser.model");


exports.apply = async (req, res) => {

    const { userId, reason, from_date, to_date, type_of_day, leave } = req.body;
    const leaves = req.body;

    let data;
    try {
        data = await applyleaveModel.create({
            userId: req.user.id,
            leave,
            reason,
            from_date,
            to_date


        });
        console.log(data);
    }
    catch (err) {
        console.log(err);
    }
    res.status(201).json({
        success: true,
        data: data
    });

}


exports.getapply_leaves = async (req, res) => {



    try {
        // const records = await applyleaveModel.find().populate('userId', { name: 1, emp_id: 1 }).populate('leave', { name: 1 });
        const records = await applyleaveModel.find({ userId: { $ne: req.user.id } }).populate({ path: 'userId', match: { role: '0' } }).populate('userId', { name: 1, emp_id: 1 }).populate('leave', { name: 1 });
        res.status(201).json(records);
    }
    catch (error) {
        console.log(error);
    }
}
exports.admin_get_apply_leave = async (req, res) => {


    try {
        // const records = await applyleaveModel.find().match({userId:{role:'0'}}).populate('userId', { name: 1, emp_id: 1,role: 1}).populate('leave', { name: 1 });
        const records = await applyleaveModel.find().populate('userId', { name: 1, emp_id: 1 }).populate('leave', { name: 1 });
        res.status(201).json(records);
    }
    catch (error) {
        console.log(error);
    }
}

exports.update_leave = async (req, res) => {

    const id = req.params.id;
    // console.log(id);
    // console.log(req.body)
    let apply_leave_id = req.body.apply_leave_id;
    let approved = await applyleaveModel.findByIdAndUpdate(apply_leave_id, { status: 'approved' })

    let edit = await newuserModel.findById(req.params.id, { leave: 1 })
    if (req.body.leave_type == 'sick_leave' || req.body.leave_type == 'casual_leave') {

        let balance = edit.leave[req.body.leave_type]
        let rem = balance - 0.5

        edit.leave[req.body.leave_type] = rem


    }
    if (req.body.leave_type == 'full_leave') {
        // if (approved.from_date != approved.to_date) {
        //find diff 7
        var a = moment(approved.to_date);
        var b = moment(approved.from_date);
        let diff = a.diff(b, 'days') + 1

        edit.leave['sick_leave'] -= diff / 2
        edit.leave['casual_leave'] -= diff / 2


        // } else {

        //     edit.leave['sick_leave'] -= 0.5
        //     edit.leave['casual_leave'] -= 0.5
        // }
    }

    let check = await newuserModel.findByIdAndUpdate(id, { $set: { leave: edit.leave } })
    return res.send("success")

}

exports.cancel_leave = async (req, res) => {
    try {
        const id = req.params.id;
        let apply_leave_id = req.body.apply_leave_id;
        let cancelled = await applyleaveModel.findByIdAndUpdate(apply_leave_id, { status: 'rejected' })

    }
    catch (error) {
        console.log(error);
    }
    res.status(201).send("success");

}


exports.single_user_apply_leave = async (req, res) => {


    try {
        const records = await applyleaveModel.find({ userId: req.user.id }).populate('userId', { name: 1, emp_id: 1 }).populate('leave', { name: 1 });
        res.status(201).json(records);
    }
    catch (error) {
        console.log(error);
    }
}





// module.exports = {
//     apply, getapply_leaves, update_leave, single_user_apply_leave, cancel_leave, admin_get_apply_leave
// }

