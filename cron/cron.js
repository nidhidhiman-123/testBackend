const cron = require('node-cron');
const shell = require("shelljs")




cron.schedule('* * * * * *', () => {




    console.log('running a task every minute');
});
// const db = require("./models")
// // apptracker cron job
// const cron = require("node-cron");

// const moment = require("moment");

// const AppTracker = db.appTracker;

// exports.update = () => {
//     try {
//         const job = cron.schedule("0 0 0 * * *", async () => {
//             const date = new Date();

//             let allApptracker = await AppTracker.find({});

//             for (var i = 0; i < allApptracker.length; i++) {
              
//                 let currentDate = moment().utc().format("YYYY/MM/DD");
//                 let billingDate = moment(allApptracker[i].billingDate).utc().format("YYYY/MM/DD");

//                 if (moment(billingDate).isSame(currentDate)) {

//                     var futureMonth = moment(billingDate).add(1, 'M').format("YYYY/MM/DD");
//                     var futureMonthEnd = moment(futureMonth).endOf('month').format("YYYY/MM/DD");
//                     if (moment(currentDate).date() != moment(futureMonth).date() && moment(futureMonth).isSame(momemt(futureMonthEnd).format('YYYY-MM-DD'))) {
//                         futureMonth = moment(futureMonth).add(1, 'd');
//                     }

//                     await AppTracker.findByIdAndUpdate(allApptracker[i]._id, {
//                         billingDate: futureMonth
//                     }, {
//                         new: true,
//                     }.exec());
                   
//                 }

//             }
//             console.log("CRON JOB IS WORKING");
//         });

//         job.start();
//     } catch { }
// };

