import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import { env } from '@saas/env'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { authenticateWithGithub } from './routes/auth/authenticate-with-github'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'
import { requestPasswordRecover } from './routes/auth/request-passowrd-recover'
import { resetPassword } from './routes/auth/reset-password'
import { getMembers } from './routes/members/get-members'
import { updateMember } from './routes/members/update-member'
import { createOrganization } from './routes/organizations/create-organization'
import { getMembership } from './routes/organizations/get-membership'
import { getOrganization } from './routes/organizations/get-organization'
import { getOrganizations } from './routes/organizations/get-organizations'
import { shutdownOrganization } from './routes/organizations/shutdown-organization'
import { transferOrganization } from './routes/organizations/transfer-organization'
import { updateOrganization } from './routes/organizations/update-organization'
import { createProject } from './routes/projects/create-project'
import { deleteProject } from './routes/projects/delete-project'
import { getProject } from './routes/projects/get-project'
import { getProjects } from './routes/projects/get-projects'
import { updateProject } from './routes/projects/update-project'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js saas',
      description: 'Multi tenancy with RBAC',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(import('@scalar/fastify-api-reference'), {
  routePrefix: '/docs',
  configuration: {
    theme: 'elysiajs',
  },
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors)

// Auth routes
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(authenticateWithGithub)
app.register(requestPasswordRecover)
app.register(resetPassword)
app.register(getProfile)

// Organization routes
app.register(createOrganization)
app.register(getMembership)
app.register(getOrganization)
app.register(getOrganizations)
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(transferOrganization)

// Project routes
app.register(createProject)
app.register(deleteProject)
app.register(getProject)
app.register(getProjects)
app.register(updateProject)

// Members routes
app.register(getMembers)
app.register(updateMember)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running')
})
