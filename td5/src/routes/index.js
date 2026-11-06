import { Router } from 'express';
import {addContact, getAllContacts, getContactById, removeContact, updateContact} from '../controllers/contactController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
const router = Router();

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
 *     responses:
 *       '200':
 *         description: Returns all the contacts
 *   post:
 *     description: Add a new contact
 *     responses:
 *       '200':
 *         description: Returns the newly added contact
 *       '404':
 *         description: The contact couldn't be added to the database.
 */
router.route('/contacts',requireAuth)
    .get(async (req, res) => {
    let response = await getAllContacts();
    if (response.success == true) {
        res.status(200).json(response);
    } else {
        res.status(404).json(response);
    }
    })
    .post(async (req,res)=>{
        const addedContact = await addContact(req.body);
        if (addedContact){
            res.status(200).json(addedContact);
        }else{
            res.status(404).json(addedContact);
        }
    });

/**
 * @openapi
 * /contacts/{id}:
 *   get:
 *     description: Get contact by ID
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
 *       '404':
 *         description: Contact not found
 *   put:
 *     description: Update an existing contact
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
 *       '404':
 *         description: Contact couldn't be updated
 *   delete:
 *     description: Remove a contact
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
 *       '404':
 *         description: Contact couldn't be deleted
 */
router.route('/contacts/:id')
.get(async (req,res)=>{
    try{
        const contact=await getContactById(req.params.id);
        if (contact.success==false){
            res.status(404).json(contact);
        }else{
            res.status(200).json(contact);
        }
    }catch(err){
        res.status(404);
    }
})
.put(async (req,res)=>{
    console.log("je suis bien dans patch")
    try {
        const {age,name}=req.body;
        console.log(age,name);
        const updatedContact=await updateContact(req.params.id,name,age);
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(404).json(error);
    }
})
.delete(async (req,res)=>{
    try {
        const response = await removeContact(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json(error);
    }
});
router.post('/auth/login',async (req,res,next)=>{
    try{
    const response=await requireAuth(req,res,next);
    }catch (error){
        res.status(401)
    }
    });
router.post('/auth/register')
export default router;
    