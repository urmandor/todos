async function userSignup(request, reply) {
  try {
    await this.admin.auth().createUser(request.body);
    return reply.sendResponse(201, { message: 'user registered' });
  } catch (err) {
    reply.sendResponse(400, { message: err.message });
  }
}

module.exports = {
  userSignup
};
