import cron from 'cron';
import User from "../models/user.model.js";

const cronJob = new cron.CronJob('0 * * * *', async () => { 
  console.log('Cron job executed');
  try {
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Find all users whose statusUpdatedAt is older than 2 minutes
    const users = await User.find({
      statusUpdatedAt: { $lte: twoMinutesAgo },
      status: { $ne: "" }, // Status should not be empty
    });

    // Update their status and statusUpdatedAt to empty
    for (const user of users) {
      await User.findByIdAndUpdate(user._id, {
        status: "",            // Set status to empty
        statusUpdatedAt: null  // Set statusUpdatedAt to null
      });
    }
    console.log("Finished updating users.");
  } catch (error) {
    console.error('Error checking for expired statuses:', error.message);
  }
});

cronJob.start();  // Make sure to start the cron job when this file is loaded

export default cronJob;
