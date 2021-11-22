const express=require('express')
const { getAllRoles, createNewRole, removeRole } = require('../controllers/roleController')
const router=express.Router()

router.route('/').get(getAllRoles).post(createNewRole)
router.route('/:id').delete(removeRole)

module.exports=router