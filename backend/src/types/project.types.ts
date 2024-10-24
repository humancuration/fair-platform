import { Project, ProjectStatus } from '@prisma/client'

export type { Project, ProjectStatus }

export interface CreateProjectInput {
  name: string
  groupId: number
  description?: string
  createdBy: number
  status?: ProjectStatus
  startDate?: Date
  dueDate?: Date
  priority?: number
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  id: number
}
