const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener los  usuarios', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
}

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener el usuario', error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
}

exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        console.error('Error al crear el usuario', error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
}
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error al actualizar el usuario', error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el usuario', error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
}