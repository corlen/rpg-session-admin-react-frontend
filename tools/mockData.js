const players = [
  { id: 1, name: "Max" },
  { id: 2, name: "Bergson" },
  { id: 3, name: "Bahia" }
];

const newPlayer = {
  id: null,
  name: ""
};

// Using CommonJS style export so we can consume via Node (without using Babel-node)
module.exports = {
  newPlayer,
  players
};
