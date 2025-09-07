import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserService } from '../src/modules/users/service/user.service'
import type { PrismaService } from '../src/database/prisma.service'

// 🔧 Mock do bcrypt.hash
vi.mock('bcrypt', () => ({
  hash: vi.fn(async () => 'hashed-password')
}))
import { hash } from 'bcrypt'

// Tipagem mínima do “subset” do Prisma usado pelo serviço
type MockedPrisma = {
  user: {
    findUnique: ReturnType<typeof vi.fn>
    create: ReturnType<typeof vi.fn>
    findMany: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
  }
}

// helper pra criar um prisma mockado novo a cada teste
function makePrismaMock(): MockedPrisma {
  return {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
  }
}

describe('UserService', () => {
  let prisma: MockedPrisma
  let service: UserService

  beforeEach(() => {
    prisma = makePrismaMock()
 
    service = new UserService(prisma as unknown as PrismaService)
    vi.clearAllMocks()
  })

  it('createUsers → cria usuário novo e hasheia a senha', async () => {
    prisma.user.findUnique.mockResolvedValue(null)
    prisma.user.create.mockResolvedValue({
      id: 'u_1',
      name: 'Deyvid',
      email: 'd@ex.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await service.createUsers({
      name: 'Deyvid',
      email: 'd@ex.com',
      password: '123456'
    })

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'd@ex.com' } })
    expect(hash).toHaveBeenCalledWith('123456', 6)

    // garante que o create recebeu a senha hasheada
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { name: 'Deyvid', email: 'd@ex.com', password: 'hashed-password' }
    })

    expect(result.user).toMatchObject({
      id: 'u_1',
      email: 'd@ex.com',
      password: 'hashed-password'
    })
  })

  it('createUsers → lança erro se email já existe', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'u_1' })

    await expect(service.createUsers({
      name: 'X',
      email: 'exist@ex.com',
      password: '123'
    })).rejects.toMatchObject({
      name: 'EmailExistsError',
      statusCode: 406,
      message: 'Email já existe'
    })

    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it('getUsers → lista usuários', async () => {
    prisma.user.findMany.mockResolvedValue([
      { id: '1', name: 'A', email: 'a@a.com', password: 'x', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', name: 'B', email: 'b@b.com', password: 'y', createdAt: new Date(), updatedAt: new Date() },
    ])

    const res = await service.getUsers()
    expect(prisma.user.findMany).toHaveBeenCalledTimes(1)
    expect(res.users).toHaveLength(2)
  })

  it('getUserById → retorna usuário quando existe', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u_42', name: 'Z', email: 'z@z.com', password: 'p',
      createdAt: new Date(), updatedAt: new Date()
    })

    const res = await service.getUserById({ id: 'u_42' })
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'u_42' } })
    expect(res.userOne.id).toBe('u_42')
  })

  it('getUserById → lança erro quando não encontra', async () => {
    prisma.user.findUnique.mockResolvedValue(null)

    await expect(service.getUserById({ id: 'nope' }))
      .rejects.toThrowError('user not found')
  })

  it('updateUsers → atualiza e retorna usuário', async () => {
    prisma.user.update.mockResolvedValue({
      id: 'u_1',
      name: 'Novo',
      email: 'novo@ex.com',
      password: '123', // aqui seu service não re-hasheia (fica a dica)
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const res = await service.updateUsers({
      id: 'u_1',
      name: 'Novo',
      email: 'novo@ex.com',
      password: '123'
    })

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'u_1' },
      data: { name: 'Novo', email: 'novo@ex.com', password: '123' }
    })
    expect(res.users.email).toBe('novo@ex.com')
  })

  it('deleteUser → deleta e retorna mensagem', async () => {
    prisma.user.delete.mockResolvedValue({})

    const res = await service.deleteUser({ id: 'u_1' })

    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'u_1' } })
    expect(res).toEqual({ message: 'user delected with success' })
  })
})
