async function createList(request, reply) {
  try {
    await this.admin
      .firestore()
      .collection('todolists')
      .add({
        user: request.user.uid,
        isCollaborative: request.body.isCollaborative,
        name: request.body.name
      });
    return reply.sendResponse(201, { message: 'New todo list created' });
  } catch (err) {
    reply.sendResponse(400, { message: err.message });
  }
}

async function getAllTodoLists(request, reply) {
  try {
    const data = await this.admin
      .firestore()
      .collection('todolists')
      .where('user', '==', request.user.uid)
      .get();

    const response = data.docs.map(doc => doc.data());

    return reply.sendResponse(200, { data: response });
  } catch (err) {
    reply.sendResponse(400, { message: err.message });
  }
}

module.exports = {
  createList,
  getAllTodoLists
};
