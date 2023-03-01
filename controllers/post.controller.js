const postModel = require("../models/post.model");
const leavesModel = require("../models/leaves.model");

const multer = require("multer");



const storage = multer.diskStorage({

    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },

});

const handleMultipartData = multer({ storage, limit: { filesize: 1000000 * 5 } }).single('image');

// const postController = {

exports.add_post = async (req, res) => {

    handleMultipartData(req, res, async (err) => {

        const current_date = new Date();
        const { description, title } = req.body;
        const filePath = req.file

        console.log(title, description)
        let addValue = {

        }
        if (title) {
            addValue.title = title;

        }
        if (description) {
            addValue.description = description;
        }
        if (filePath) {
            addValue.image = req.file.path
        }
        if (current_date) {
            addValue.post_date = current_date
        }

        let post_data;

        try {
            post_data = await postModel.create(
                addValue,


            );
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
}

exports.allpost = async (req, res) => {
    //     const all = await postModel.find();
    //     res.status(201).json(all);
    // },

    let all = await postModel.find().populate('comment.userId', { name: 1, image: 1 }).sort({ $natural: -1 })
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

}


exports.editpost = async (req, res) => {

    handleMultipartData(req, res, async (err) => {

        const image = req.file;
        const { title, description } = req.body;


        console.log(image, "fs")

        let updateFilter = {

        }
        if (title) {
            updateFilter.title = title
        }
        if (description) {
            updateFilter.description = description
        }
        if (image) {
            updateFilter.image = req.file.path
        }
        console.log(title, description, req.params.id, "sd")
        let document
        try {
            console.log("try")
            document = await postModel.findByIdAndUpdate(req.params.id,
                updateFilter,
            );

        }
        catch (err) {
            console.log("catch")
            console.log(err)
        }

        res.status(201).json({
            success: true,
            data: document
        });

        console.log(document)


    });

}



exports.deletepost = async (req, res) => {
    let all;
    try {
        all = await postModel.findOneAndDelete({ _id: req.params.id });
    }
    catch (error) {
        console.log(error);
    }


    res.status(201).json(all);
}




exports.add_leaves = async (req, res) => {

    const { name, leave_type } = req.body;
    let data;
    try {
        data = await leavesModel.create(
            {
                name,
                leave_type

            });
    }
    catch (err) {
        return next(err);
    }
    res.status(201).json({
        success: true,
        data: data
    });

}

exports.allleave = async (req, res) => {
    const leave = await leavesModel.find();
    res.status(201).json(leave);
}

exports.like = async (req, res) => {
    try {
        let check = await postModel.findById(req.params.id)
        let likeArray = check.like
        let likedOrNot = likeArray.indexOf(req.user.id)
        if (likedOrNot < 0) {
            check = await postModel.findByIdAndUpdate(req.params.id, { $push: { like: req.user.id } })
        } else {
            likeArray.splice(likedOrNot, 1)
            check = await postModel.findByIdAndUpdate(req.params.id, { $set: { like: [...likeArray] } })
        }
        res.status(201).json(check);
    }
    catch (error) {
        console.log(error)
    }


}







// module.exports = {
//     add_post, allcomment, like, allleave, add_leaves, deletepost, allpost
// }
