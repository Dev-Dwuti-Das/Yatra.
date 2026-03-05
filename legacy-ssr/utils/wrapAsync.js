// utils/WrapAsync.js
module.exports = function WrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
};
