const controller = require("../controllers/role.controller");
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: The roles managing API
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: The role was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Role name cannot be empty
 *       500:
 *         description: Some server error
 */

router.post('/roles', controller.createRole);

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: The list of the roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       500:
 *         description: Some server error
 */

router.get('/roles', controller.findAllRoles);

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Get the role by id
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The role id
 *     responses:
 *       200:
 *         description: The role description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: The role was not found
 *       500:
 *         description: Some server error
 */

router.get('/roles/:id', controller.findRoleById);

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update the role by the id
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The role id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: The role was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: The role was not found
 *       500:
 *         description: Some server error
 */

router.put('/roles/:id', controller.updateRole);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Remove the role by id
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The role id
 *     responses:
 *       200:
 *         description: The role was deleted
 *       404:
 *         description: The role was not found
 *       500:
 *         description: Some server error
 */

router.delete('/roles/:id', controller.deleteRole);

module.exports = router;
