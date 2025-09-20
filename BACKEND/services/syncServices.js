import db from "../models/index.js";

export const syncUsers = async (users, deviceId) => {
  const synced = [];

  for (let u of users) {
    const user = await db.User.create({
      ...u,
      device_id: deviceId,
      synced_at: new Date(),
    });
    synced.push(user);
  }

  return synced;
};
