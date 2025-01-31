import cron from 'node-cron';
import User from "../models/user.model";  // Adjust the import based on your file structure

// Set up a cron job to run every minute (or your desired interval)
cron.schedule('*/1 * * * *', async () => { // This will run every minute
  console.log('Cron job executed'); // Check if the cron job is running
  try {
    const now = new Date();
    console.log("2 mins before : ", now);

    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
    console.log("Two minutes ago : ", twoMinutesAgo); // Log time 2 minutes ago

    // Find all users whose statusUpdatedAt is older than 2 minutes
    const users = await User.find({
      statusUpdatedAt: { $lte: twoMinutesAgo },
      status: { $ne: "" }, // Status should not be empty
    });

    console.log("Found users: ", users); // Log found users

    // Update their status to empty string
    for (const user of users) {
      await User.findByIdAndUpdate(user._id, { status: "" });
      console.log(`Status for user ${user._id} updated to empty string`);
    }
    console.log("2 mins after : ", users);
  } catch (error) {
    console.error('Error checking for expired statuses:', error.message);
  }
});
