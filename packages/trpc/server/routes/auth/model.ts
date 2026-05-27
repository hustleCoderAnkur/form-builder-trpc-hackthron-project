import { z } from 'zod'

export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName:z.string().describe("name of user"),
    email:z.email().describe("email of user"),
    password:z.string().describe("password of user"),
})
export const createUserWithEmailAndPasswordOutputModel = z.object({
   id: z.string().describe('id of the user created')
})