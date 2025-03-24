const db = require("../models");
const Role = db.Role;


exports.createRole = async (req, res) => {
    if (!req.body.name || !req.body.description) {
        return res.status(400).send({ message: "All fields are required" });
    }

    const { name, description } = req.body;

    try {
        // Check if role with the same name already exists
        const roleExists = await Role.findOne({ where: { name } });
        if (roleExists) {
            return res.status(400).send({ message: "Role name already exists." });
        }

        // Create the role
        const role = await Role.create({ name, description, role_status: 'DISABLED' });
        
        res.status(200).send({ message: "Role added successfully!", data: role });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message || "Some error occurred while creating the Role." });
    }
};


exports.findAllRoles = async (req, res) => {
    const { page, limit } = req.query;
    const offset = page ? parseInt(page) * parseInt(limit) : 0;
    const limitValue = limit ? parseInt(limit) : 10;

    Role.findAndCountAll({
        limit: limitValue,
        offset: offset,
      })
        .then(data => {
          res.send({
            total: data.count,
            roles: data.rows
          });
        })
        .catch(err => {
          res.status(500).send({
            message: err.message || "Some error occurred while retrieving roles."
          });
        });
};

exports.findRoleById = async (req, res) => {
    const id = req.params.id;

    try {
        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).send({ message: "Role not found!" });
        }
        res.status(200).send({ data: role });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.updateRole = async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    try {
        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).send({ message: "Role not found!" });
        }

        // Check if new name is provided and different from current name
        if (name && name !== role.name) {
            const roleExists = await Role.findOne({ where: { name } });
            if (roleExists) {
                return res.status(400).send({ message: "Role name already exists." });
            }

            // Update role's name
            role.name = name;
        }

        // Update other fields if needed
        await role.update(req.body);

        return res.status(200).send({ message: "Role updated successfully!", data: role });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: err.message || "Some error occurred while updating the Role." });
    }
};

exports.deleteRole = async (req, res) => {
    const id = req.params.id;

    try {
        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).send({ message: "Role not found!" });
        }

        await role.destroy();
        res.status(200).send({ message: "Role deleted successfully!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};