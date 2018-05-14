let controller = require('./byteController');

// This is intentional! We want to start the filesystem cache before we serve requests.
//controller.start();

var router = require('express').Router();

router.route('/')
    .get(controller.get_all_files);

router.route('/:prefix')
    .get(controller.get_with_prefix)
    .post(controller.post);

module.exports = router;
