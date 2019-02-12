async function createList(request, reply) {
  try {
    let users = [];

    if (request.body.isCollaborative) {
      users = request.body.users;
    }

    if (!users.includes(request.user.uid)) {
      users.push(request.user.uid);
    }

    await this.admin
      .firestore()
      .collection('todolists')
      .add({
        users,
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
      .where('users', 'array-contains', request.user.uid)
      .get();

    const response = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    return reply.sendResponse(200, { data: response });
  } catch (err) {
    console.log(err);
    reply.sendResponse(400, { message: err.message });
  }
}

module.exports = {
  createList,
  getAllTodoLists
};
