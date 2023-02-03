import applyleaveModel from "../models/applyleave.model";
import leavesModel from "../models/leaves.model";
import newuserModel from "../models/newuser.model";

const applyleaveController = {

    async apply(req, res) {

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

    },


    async getapply_leaves(req, res) {


        try {
            const records = await applyleaveModel.find().populate('userId', { name: 1, emp_id: 1 }).populate('leave', { name: 1 });
            res.status(201).json(records);
        }
        catch (error) {
            console.log(error);
        }
    },


    async update_leave(req, res) {

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
            edit.leave['sick_leave'] -= 0.5
            edit.leave['casual_leave'] -= 0.5
        }

        let check = await newuserModel.findByIdAndUpdate(id, { $set: { leave: edit.leave } })
        return res.send("success")

    },

    async cancel_leave(req, res) {
        try {
            const id = req.params.id;
            let apply_leave_id = req.body.apply_leave_id;
            let cancelled = await applyleaveModel.findByIdAndUpdate(apply_leave_id, { status: 'rejected' })

        }
        catch (error) {
            console.log(error);
        }
        res.status(201).send("success");

    },


    async single_user_apply_leave(req, res) {


        try {
            const records = await applyleaveModel.find({ userId: req.user.id }).populate('userId', { name: 1, emp_id: 1 }).populate('leave', { name: 1 });
            res.status(201).json(records);
        }
        catch (error) {
            console.log(error);
        }
    },




}
export default applyleaveController
