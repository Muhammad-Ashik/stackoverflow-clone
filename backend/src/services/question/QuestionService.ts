import AppDataSource from '../../config/databaseConfig'
import { Question } from '../../entities/Question'
import { ListResult, PaginationParams } from '../../types'

export interface QuestionsList extends ListResult {
  questions: Question[]
}

export interface CreatQuestionInfo {
  title: string
  description: string
  userId: number
}

class QuestionService {
  private questionRepository = AppDataSource.getRepository(Question)

  async getQuestions(pagination: PaginationParams): Promise<QuestionsList> {
    const { limit, page } = pagination
    const skip = limit * (page - 1)
    const [questions, total] = await this.questionRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
    })

    return {
      questions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async CreateQuestion(question: CreatQuestionInfo): Promise<Question> {
    const newQuestion = this.questionRepository.create({
      ...question,
      user: { id: question.userId },
    })

    return await this.questionRepository.save(newQuestion)
  }
}

export default new QuestionService()
