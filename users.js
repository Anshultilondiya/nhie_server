const users = [];

const addUser = ({ id, name, room }) => {
  var user;
  if (name && room) {
    name = name.trim().toLowerCase();

    const existingUser = users.find(
      (user) => user.room === room && user.name === name
    );
    if (existingUser) {
      return { error: "Username is taken" };
    }
    let num = 0;
    user = { id, name, room, num };
    users.push(user);
  }

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = { addUser, getUser, getUsersInRoom, removeUser };
