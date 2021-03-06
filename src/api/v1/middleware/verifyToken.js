const jwt = require('jsonwebtoken');

const { CustomError } = require('../util/CustomError');
const userModel = require('../models/userModel');
/**
 * Verify token
 * @param {*request} req - request of client
 * @param {*response} res - response to client
 * @param {*callbackFunction} next - To call next route use next() in callbackFunction
 */
function verifyToken(req, res, next = () => {}) {
    //Check access token is in header
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new CustomError(401, 'You are not authenticated');
        }

        let accessToken = authHeader.split(' ')[1];

        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            { ignoreExpiration: true },
            (error, decode) => {
                if (error) throw new CustomError(401, 'Token is invalid');
                else {
                    req.decodeData = decode;
                    next();
                }
            },
        );
    } catch (error) {
        throw error;
    }
}

function verifyTokenAndAuthorization(req, res, next) {
    verifyToken(req, res, async () => {
        try {
            try {
                const user = await userModel.findOne({
                    _id: req.decodeData.id,
                });
                req.user = user;
            } catch (error) {
                throw new CustomError(400, 'User not exits');
            }
            next();
        } catch (error) {
            console.log(error);
            next(
                new CustomError(
                    401,
                    "You don't have permission to do this action!",
                ),
            );
        }
    });
}

function verifyTokenAndAuthorizationAdmin(req, res, next) {
    verifyToken(req, res, async () => {
        try {
            let user;
            try {
                user = await userModel.findOne({
                    _id: req.decodeData.id,
                });
            } catch (error) {
                throw new CustomError(400, 'User not exits');
            }

            if (!user.isSeller) throw new Error();
            req.user = user;
            next();
        } catch (error) {
            console.log(error);
            next(
                new CustomError(
                    401,
                    "You don't have permission to do this action!",
                ),
            );
        }
    });
}

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAuthorizationAdmin,
};
