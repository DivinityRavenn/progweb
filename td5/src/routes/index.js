import { Router } from 'express';
import { addContact, getAllContacts, getContactById, removeContact, updateContact } from '../controllers/contactController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = Router();

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     AuthCredentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: etudiant@exemple.fr
 *         password:
 *           type: string
 *           format: password
 *           example: MotDePasse123!
 */

// Protège toutes les routes /contacts et /contacts/:id
router.use('/contacts', requireAuth);

router.get('/', function (req, res) {
    res.status(200).json({
        status: 'API is Working',
        message: 'Welcome!',
    });
});

/**
 * @openapi
 * /contacts:
 *   get:
 *     description: All contacts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Returns all the contacts
 *       '401':
 *         description: Accès refusé (header Authorization manquant)
 *       '403':
 *         description: Token invalide ou expiré
 *   post:
 *     description: Add a new contact
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '201':
 *         description: Returns the newly added contact
 *       '401':
 *         description: Accès refusé (header Authorization manquant)
 *       '403':
 *         description: Token invalide ou expiré
 *       '404':
 *         description: The contact couldn't be added to the database.
 */
router.route('/contacts')
    .get(async (req, res) => {
        let response = await getAllContacts();
        if (response.success == true) {
            res.status(200).json(response);
        } else {
            res.status(404).json(response);
        }
    })
    .post(async (req, res) => {
        const addedContact = await addContact(req.body);
        if (addedContact.success) {
            res.status(201).json(addedContact);
        } else {
            res.status(404).json(addedContact);
        }
    });

/**
 * @openapi
 * /contacts/{id}:
 *   get:
 *     description: Get contact by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB du contact
 *         example: 6582a8e4f1a23b001c9d4e5f
 *     responses:
 *       '200':
 *         description: Returns the contact
 *       '401':
 *         description: Accès refusé (header Authorization manquant)
 *       '403':
 *         description: Token invalide ou expiré
 *       '404':
 *         description: Contact not found
 *   put:
 *     description: Update an existing contact
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB du contact
 *         example: 6582a8e4f1a23b001c9d4e5f
 *     responses:
 *       '200':
 *         description: Returns the updated contact
 *       '401':
 *         description: Accès refusé (header Authorization manquant)
 *       '403':
 *         description: Token invalide ou expiré
 *       '404':
 *         description: Contact couldn't be updated
 *   delete:
 *     description: Remove a contact
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID MongoDB du contact
 *         example: 6582a8e4f1a23b001c9d4e5f
 *     responses:
 *       '200':
 *         description: Contact deleted successfully
 *       '401':
 *         description: Accès refusé (header Authorization manquant)
 *       '403':
 *         description: Token invalide ou expiré
 *       '404':
 *         description: Contact couldn't be deleted
 */
router.route('/contacts/:id')
    .get(async (req, res) => {
        try {
            const contact = await getContactById(req.params.id);
            if (contact.success == false) {
                res.status(404).json(contact);
            } else {
                res.status(200).json(contact);
            }
        } catch (err) {
            res.status(404).json({ success: false, message: err.message });
        }
    })
    .put(async (req, res) => {
        try {
            const { age, name } = req.body;
            const updatedContact = await updateContact(req.params.id, name, age);
            res.status(200).json(updatedContact);
        } catch (error) {
            res.status(404).json(error);
        }
    })
    .delete(async (req, res) => {
        try {
            const response = await removeContact(req.params.id);
            res.status(200).json(response);
        } catch (error) {
            res.status(404).json(error);
        }
    });

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Connexion et génération d'un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthCredentials'
 *     responses:
 *       '200':
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Connexion réussie
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       '401':
 *         description: Identifiants invalides
 *       '500':
 *         description: Erreur serveur
 */
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await loginUser(email, password);

        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(401).json(response);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur critique" });
    }
});

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthCredentials'
 *     responses:
 *       '201':
 *         description: Compte créé avec succès
 *       '400':
 *         description: Email déjà utilisé ou données invalides
 *       '500':
 *         description: Erreur serveur
 */
router.post('/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await registerUser(email, password);
        if (response.success != true) {
            res.status(400).json(response);
        } else {
            res.status(201).json(response);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur critique" });
    }
});

export default router;