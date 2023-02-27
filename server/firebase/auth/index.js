import firebaseApp from '../index.js'
import { getAuth } from 'firebase-admin/auth'

const auth = getAuth(firebaseApp)

async function setRole (req, res) {
    try {
        const idToken = req.headers.authorization.split("Bearer ")[1]
        const decodedToken = await auth.verifyIdToken(idToken)

        if (!decodedToken.uid) 
            throw new Error({ status: 401, message: 'User not authenticated'})

        const { role } = req.params
        if (role !== 'creator' && role !== 'user') 
            throw new Error({ status: 400, message: 'Invalid role'})

        // set custom claims
        await auth.setCustomUserClaims(decodedToken.uid, {
            isUser: true,
            isCreator: role === 'creator' ? true : false
        })

        res.status(200).send({ message: 'Role set up successfully' })

    } catch (error) {
        console.error(error)
        res.status(error.status || 500).send({ error: true, message: error.message })
    }
}

export {
    auth,
    setRole
}