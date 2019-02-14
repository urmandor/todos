async function userSignup(request, reply) {
  try {
    await this.admin.auth().createUser(request.body);
    return reply.sendResponse(201, { message: 'user registered' });
  } catch (err) {
    reply.sendResponse(400, { message: err.message });
  }
}

async function userLogin(request, reply) {
  try {
    const { deviceType, deviceId, fcmToken } = request.body;
    if (deviceType !== 'ios' && deviceType !== 'android') {
      return reply.sendResponse(400, { message: 'Unsupported device' });
    }

    const users = await this.admin
      .firestore()
      .collection('users')
      .where(`${[deviceType]}.deviceId`, '==', deviceId)
      .get();

    users.docs.forEach(user => {
      const data = user.data();
      delete data[deviceType];
      user.ref.set(data);
    });

    await this.admin
      .firestore()
      .collection('users')
      .doc(request.user.uid)
      .set({ [deviceType]: { deviceId, fcmToken } }, { merge: true });

    reply.sendResponse(200, 'user logged in');
  } catch (err) {
    console.log(err);
    reply.sendResponse(400, err.message);
  }
}

async function userLogout(request, reply) {
  try {
    await this.admin
      .firestore()
      .collection('users')
      .doc(request.user.uid)
      .delete();

    reply.sendResponse(200, 'user logged out');
  } catch (err) {
    reply.sendResponse(400, err.message);
  }
}

module.exports = {
  userSignup,
  userLogin,
  userLogout
};
