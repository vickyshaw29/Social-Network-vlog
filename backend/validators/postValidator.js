const { check } = require('express-validator')
exports.postValidate = [
    check('title')
        .not()
        .isEmpty()
        .withMessage('please enter the title'),
    check('body')
        .isLength({ min: 6 })
        .withMessage('body length must be at least 6 charaters long')
];