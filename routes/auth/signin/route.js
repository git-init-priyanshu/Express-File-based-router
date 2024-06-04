const users = require("../../../index");

function Post(req, res) {
  const { email, password } = req.body;

  const isDuplicate = users.find((user) => user.email === email);
  
  if (isDuplicate) return res.json({ error: `Duplicate user: ${email}` });
  users.push({ email, password });
  res.json({ msg: `User added with email ${email}` });
}

module.exports = Post;
