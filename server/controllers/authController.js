const bcrypt = require('bcryptjs');
const validator = require('../../test/validator');

module.exports = {

    login: async (req, res) => {

        try {
            let db = req.app.get('db');
            let { loginEmail, loginPassword } = req.body;
            email = loginEmail.toLowerCase();

            let userResponse = await db.get_user_by_email(email)
            let user = userResponse[0]

            if (!user) {
                return res.status(401).send('Email not found')
            }

            let isAuthenticated = bcrypt.compareSync(loginPassword, user.password)
            if (!isAuthenticated) {
                return res.status(403).send('Incorrect password')
            }

            delete user.password
            req.session.user = user
            return res.send(user)
        } catch(error) {
            console.log(error)
            return res.status(500).send(error)
        }

    },

    register: async (req, res) => {

        try {
            let db = req.app.get('db');
            let { username, email, password, confirmPassword, venmo} = req.body;
            email = email.toLowerCase();

            if (validator.usernameValidator(username)) {
                return res.status(409).send('Username must be 4 or more characters long')
            }

            if (validator.emailValidator(email)) {
                return res.status(409).send('Email must be in format "youremail@email.com/net/etc.')
            }

            if (validator.passwordValidator(password)) {
                return res.status(409).send('Password must be at least 5 characters long')
            }

            if (validator.confirmPasswordValidator(password, confirmPassword)) {
                return res.status(409).send('Passwords must match')
            }

            let userResponse = await db.get_user_by_email(email)
            if (userResponse[0]) {
                return res.status(409).send('Email already taken')
            }

            const salt = bcrypt.genSaltSync(10)
            password = bcrypt.hashSync(password, salt)

            let response = await db.register_user({username, password, email, venmo})
            let newUser = response[0]

            delete newUser.password

            req.session.user = newUser
            res.send(newUser)
        } catch(error) {
            console.log(error)
            return res.status(500).send(error)
        }
    },

    logout: async (req, res) => {

        req.session.destroy()
        return res.sendStatus(200)

    },

    currentUser: async (req, res) => {

        res.send(req.session.user)
        
    }
}