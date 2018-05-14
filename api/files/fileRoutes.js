let controller = require('./fileController');

// This is intentional! We want to start the filesystem cache before we serve requests.
controller.start();

var router = require('express').Router();

router.route('/')
    .get(controller.get_all_files)
    .post(controller.post);

router.route('/:prefix')
    .get(controller.get_with_prefix);

router.route('/close')
    .get(controller.stop);

module.exports = router;
