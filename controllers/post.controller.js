import postModel from "../models/post.model";
import leavesModel from "../models/leaves.model";
import multer from "multer";


const storage = multer.diskStorage({

    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },

});

const handleMultipartData = multer({ storage, limit: { filesize: 1000000 * 5 } }).single('image');

const postController = {

    async add_post(req, res) {
        const current_date = new Date();

        console.log(current_date);

        handleMultipartData(req, res, async (err) => {

            const filePath = req.file ? req.file.path : '';
            const { description, title } = req.body;
            let post_data;
            try {
                post_data = await postModel.create({
                    title,
                    description,
                    post_date: current_date,
                    image: filePath
                });
                console.log(post_data);
            }
            catch (err) {
                return next(err);
            }
            res.status(201).json({
                success: true,
                data: post_data
            });
        });
    },

    async allpost(req, res) {
        //     const all = await postModel.find();
        //     res.status(201).json(all);
        // },

        let all = await postModel.find();
        const arr = [];
        for (let x of all) {
            let likeornot = x.like.indexOf(req.user.id)
            let like
            if (likeornot < 0) {
                console.log("false")
                like = false
            } else {
                console.log("true")
                like = true
            }
            arr.push({ x, isLike: like })

        }
        return res.send(arr);

    },



    async deletepost(req, res) {
        let all;
        try {
            all = await postModel.findOneAndDelete({ _id: req.params.id });
        }
        catch (error) {
            console.log(error);
        }


        res.status(201).json(all);
    },




    async add_leaves(req, res) {

        const { name, leave_type } = req.body;
        let data;
        try {
            data = await leavesModel.create(
                {
                    name,
                    leave_type

                });
            console.log(data);
        }
        catch (err) {
            return next(err);
        }
        res.status(201).json({
            success: true,
            data: data
        });

    },

    async allleave(req, res) {
        const leave = await leavesModel.find();
        res.status(201).json(leave);
    },

    async like(req, res) {
        try {
            let check = await postModel.findById(req.params.id)
            let likeArray = check.like
            let likedOrNot = likeArray.indexOf(req.user.id)
            if (likedOrNot < 0) {
                console.log(likedOrNot)
                check = await postModel.findByIdAndUpdate(req.params.id, { $push: { like: req.user.id } })
            } else {
                likeArray.splice(likedOrNot, 1)
                console.log(likeArray)
                check = await postModel.findByIdAndUpdate(req.params.id, { $set: { like: [...likeArray] } })
            }
            res.status(201).json(check);
        }
        catch (error) {
            console.log(error)
        }


    },


    async allcomment(req, res) {
        const comments = await postModel.find();
        res.status(201).json(comments);
    },

    ////////////////////////////////comment//////////////////

    // async allcomment(req, res) {
    //     const comments = await postModel.findOneAndUpdate({ _id: req.params.id }, {
    //         Comment: {
    //             comment: req.body.comment
    //         },
    //     })
    //     res.status(201).json(comments);
    //     console.log(comments, "likelike")
    // },



    //////////////////

}
export default postController;
