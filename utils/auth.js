async function auth(request, reply, done) {
  if (
    !request.headers.authorization ||
    !request.headers.authorization.startsWith('Bearer ')
  ) {
    console.error(
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>'
    );
    return reply.sendResponse(403, 'Unauthorized');
  }

  const idToken = request.headers.authorization.split('Bearer ')[1];

  try {
    const decodedIdToken = await this.admin.auth().verifyIdToken(idToken);
    request.user = decodedIdToken;
    done();
  } catch (err) {
    console.log(err);
    return reply.sendResponse(403, 'Unauthorized');
  }
}

module.exports = auth;
