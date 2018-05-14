let controller = require('./byteController');

// This is intentional! We want to start the filesystem cache before we serve requests.
//controller.start();

var router = require('express').Router();

router.route('/')
    .get(controller.get_all_files)
    .post(controller.post);

/*
router.route('/:prefix') - discussion in byteController.js
    .get(controller.get_with_prefix);
 */

module.exports = router;
