async function createTodo(request, reply) {
  try {
    const todolist = await getTodoListHelper.call(
      this,
      request.params.todolist,
      request.user.uid
    );
    if (todolist.auth === false) {
      return reply.sendResponse(403, { message: 'unauthorized' });
    }

    if (!todolist.data) {
      return reply.sendResponse(404, { message: 'Todo list not found' });
    }

    await todolist.ref.collection('todos').add({
      message: request.body.message,
      isComplete: false
    });

    await sendNotification.call(
      this,
      todolist.data.users,
      'New todo created',
      request.body.message
    );

    return reply.sendResponse(201, {
      message: 'New todo created'
    });
  } catch (err) {
    reply.sendResponse(400, { message: err.message });
  }
}

async function updateTodo(request, reply) {
  try {
    const todolist = await getTodoListHelper.call(
      this,
      request.params.todolist,
      request.user.uid
    );

    if (todolist.auth === false) {
      return reply.sendResponse(403, { message: 'unauthorized' });
    }

    if (!todolist.data) {
      return reply.sendResponse(404, { message: 'Todo list not found' });
    }

    await todolist.ref
      .collection('todos')
      .doc(request.params.todo)
      .set({
        message: request.body.message,
        isComplete: request.body.isComplete
      });

    await sendNotification.call(
      this,
      todolist.data.users,
      'Todo updated',
      request.body.message
    );

    return reply.sendResponse(200, { message: 'todo item updated' });
  } catch (err) {
    reply.sendResponse(400, { message: err.message });
  }
}

async function deleteTodo(request, reply) {
  try {
    const todolist = await getTodoListHelper.call(
      this,
      request.params.todolist,
      request.user.uid
    );

    if (todolist.auth === false) {
      return reply.sendResponse(403, { message: 'unauthorized' });
    }

    if (!todolist.data) {
      return reply.sendResponse(404, { message: 'Todo list not found' });
    }

    await todolist.ref
      .collection('todos')
      .doc(request.params.todo)
      .delete();

    await sendNotification.call(this, todolist.data.users, 'Todo deleted');

    return reply.sendResponse(200, { message: 'todo item deleted' });
  } catch (err) {
    reply.sendResponse(400, { message: err.message });
  }
}

async function getAllTodos(request, reply) {
  try {
    const todolist = await getTodoListHelper.call(
      this,
      request.params.todolist,
      request.user.uid
    );

    if (todolist.auth === false) {
      return reply.sendResponse(403, { message: 'unauthorized' });
    }

    if (!todolist.data) {
      return reply.sendResponse(404, { message: 'Todo list not found' });
    }

    const todos = await todolist.ref.collection('todos').get();

    const response = todos.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    return reply.sendResponse(200, { data: response });
  } catch (err) {
    reply.sendResponse(400, { message: err.message });
  }
}

/**
 * getTodoListHelper function, retrieves the todolist
 * and verifies whether user is allowed to access it or not.
 * @param {string} listUid  contains the uid of the todolist.
 * @param {string} userUid  contains the uid of the logged in user.
 *
 * */

async function getTodoListHelper(listUid, userUid) {
  const todolistRef = await this.admin
    .firestore()
    .collection('todolists')
    .doc(listUid)
    .get();

  const todolist = todolistRef.data();
  if (!todolist) {
    return { data: null, ref: null };
  }

  if (!todolist.users || !todolist.users.includes(userUid)) {
    return { data: null, ref: null, auth: false };
  }

  return { data: todolist, ref: todolistRef.ref, auth: true };
}

/**
 * sendNotification function, sends notification to all
 * of user's registered devices.
 * @param {array} users  contains the uid of all users associated with the todolist.
 * @param {string} title  contains the title of the notification.
 * @param {string} body  contains the body of the notification.
 *
 * */
async function sendNotification(users, title, body) {
  const firestore = this.admin.firestore();
  const userDocs = users.map(user => firestore.collection('users').doc(user));
  try {
    const usersData = await firestore.getAll(userDocs);
    let requests = [];
    usersData.forEach(user => {
      const userData = user.data();
      if (userData) {
        const devices = Object.keys(userData);
        const req = devices.map(device => {
          return this.sendFCM(userData[device].fcmToken, title, body);
        });
        requests = requests.concat(req);
      }
    });
    return await Promise.all(requests);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  createTodo,
  getAllTodos,
  updateTodo,
  deleteTodo
};
