import { createServerFn } from '@tanstack/react-start'

import { authFnMiddleware } from '#/middleware/auth';
import { createPresentationInputSchema, updatePresentationInputSchema,
presentationIdInputSchema,
} from '../types/schemas';
import { prisma } from '#/lib/db';
import { PresentationStatus } from '#/generated/prisma/enums'

export const createPresentation = createServerFn({method: 'POST'}).inputValidator((data:unknown)=>createPresentationInputSchema.parse(data))
.middleware([authFnMiddleware])
.handler(async({data, context})=>{

    const userId = context.session.user.id;

    const presentation = await prisma.presentation.create({
        data: {
        userId,
        title: data.prompt,
        prompt: data.prompt,
        slideCount: data.slideCount,
        style: data.style,
        tone: data.tone,
        layout: data.layout,
        status: PresentationStatus.GENERATING,
      },
    })

    // todo: trigger background job to generate presentation content

    return presentation;

})

export const updatePresentation = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => updatePresentationInputSchema.parse(data))
  .middleware([authFnMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id
    if (!userId) throw new Error('Unauthorized')
    const { id, ...patch } = data
    const existing = await prisma.presentation.findFirst({
      where: { id: data.id, userId },
    })
    if (!existing) throw new Error('Not found')
    const updateData = patch
    return prisma.presentation.update({
      where: { id },
      data: updateData,
    })
  })

  export const deletePresentation = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => presentationIdInputSchema.parse(data))
  .middleware([authFnMiddleware])
  .handler(async ({ data, context }) => {

    const userId = context.session.user.id;
    const existing = await prisma.presentation.findFirst({
      where: { id: data.id, userId },
    })
    if (!existing) throw new Error('Not found')
    await prisma.presentation.delete({ where: { id: data.id } })
    return { ok: true as const }
  })

export const regeneratePresentation = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => presentationIdInputSchema.parse(data))
  .middleware([authFnMiddleware])
  .handler(async ({ data , context }) => {
    const userId = await context.session.user.id
    const existing = await prisma.presentation.findFirst({
      where: { id: data.id, userId },
    })
    if (!existing) throw new Error('Not found')

    await prisma.presentation.update({
      where: { id: data.id },
      data: { status: 'GENERATING' },
    })

    // await inngest.send({
    //   name: 'presentation/generate',
    //   data: { presentationId: data.id },
    // })

    
  })